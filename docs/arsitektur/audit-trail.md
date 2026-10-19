# Audit Trail

Audit Trail mencatat siapa melakukan apa, kapan, dan dari mana di OpenSIMRS: login, akses rekam medis, perubahan data penting, ekspor, dan perubahan izin, lintas semua layanan. Halaman ini menjelaskan apa yang dicatat, bagaimana catatan dilindungi dari perubahan, dan cara melihatnya. Fitur ini ditambahkan lewat item SIMRS Studio **STD-0029**.

## Gambaran

- Semua catatan masuk ke **satu tabel PostgreSQL** `audit_trail` di database bersama. Tidak ada layanan audit tersendiri; setiap layanan menulis langsung lewat helper bersama di `@opensimrs/model-sdk`.
- Tabel bersifat **append-only**: baris yang sudah tertulis tidak bisa diubah atau dihapus.
- Setiap baris terkait dengan baris sebelumnya lewat **rantai hash SHA-256 per faskes**, sehingga perubahan diam-diam bisa dideteksi.
- Catatan dibaca lewat menu **Setting › Audit Trail** dengan izin khusus.
- Di Manajemen Modul, Audit Trail tampil sebagai modul inti `audit_trail` (selalu aktif, tidak bisa dimatikan).

## Apa yang dicatat

| Sumber | Aksi | Keterangan |
|---|---|---|
| `auth-service` | `login`, `login_gagal`, `logout`, `ganti_sandi` | Sandi lama maupun baru tidak pernah disimpan. Percobaan login dengan username yang tidak terdaftar **tidak** dicatat, karena faskesnya tidak diketahui. |
| Hook Sequelize global (layanan yang memakai `@opensimrs/model-sdk`) | `buat`, `ubah`, `hapus`, `ubah_izin` | Perubahan pada tabel yang masuk daftar putih (lihat di bawah). Soft delete dicatat sebagai `hapus`. |
| `rekamedis-service` | `baca`, `buat`, `ubah` | Satu peristiwa `baca` per akses detail RME (bukan per item daftar), serta ringkasan metadata saat dokumen RME dibuat atau catatan ditambahkan. **Isi klinis tidak disalin** ke audit. |
| `penunjang-service` (modul HR/SDM) | `buat`, `ubah`, `hapus` | Ditulis langsung dengan `pg` dalam transaksi yang sama, memakai aturan hash dan penyamaran yang sama. |
| `setting-service` | `ekspor` | Setiap ekspor Audit Trail ikut dicatat, beserta filter dan jumlah barisnya. |

::: warning Cakupan saat ini
Layanan yang mengakses PostgreSQL langsung dengan `pg` (`bpjs-service`, `satusehat-service`, dan sebagian besar `penunjang-service`) tidak tercakup hook Sequelize. Dari kelompok ini, baru modul HR/SDM di `penunjang-service` yang menulis catatan audit.
:::

Nilai kolom `aksi` dibatasi oleh `CHECK` di database: `login`, `login_gagal`, `logout`, `ganti_sandi`, `baca`, `buat`, `ubah`, `hapus`, `ekspor`, `cetak`, `ubah_izin`.

### Tabel daftar putih

Hook Sequelize hanya mencatat perubahan pada tabel berikut:

| Tabel | Entitas |
|---|---|
| `patients`, `addresses`, `birth_details` | Pasien, Alamat, Detail Kelahiran |
| `rawat_jalans`, `rawat_inaps`, `instalasi_gawat_darurats` | Kunjungan Rawat Jalan, Rawat Inap, IGD |
| `prescriptions` | Resep |
| `order_lab`, `observation_item` | Order Laboratorium, Hasil Laboratorium |
| `bills`, `payment_history` | Tagihan, Pembayaran |
| `users`, `role` | Pengguna, Peran. Perubahan `permissions` atau `roleUuid` dicatat sebagai `ubah_izin`. |
| `faskes` | Faskes |

Perubahan massal (`Model.update()`/`Model.destroy()` tanpa `individualHooks`) dicatat sebagai **satu** peristiwa ringkasan per panggilan, karena baris yang terdampak tidak diketahui di hook itu. Jalur yang membutuhkan catatan per baris memakai `individualHooks: true`.

### Kolom yang dicatat

Setiap baris memuat antara lain: `faskes_uuid`, `waktu_epoch`, pengguna (`pengguna_uuid`, `identitas_akun`, `peran`), `layanan`, `aksi`, `entitas` dan `entitas_uuid`, `patient_uuid` (bila terkait pasien), `ringkasan_perubahan` (nilai lama → baru), `alamat_ip`, `user_agent`, `request_id`, serta `hash_sebelumnya` dan `hash_baris`. Konteks pengguna dan permintaan diambil oleh middleware `auditContextMiddleware()` dari `@opensimrs/model-sdk/audit-context`, yang dipasang di layanan berbasis Sequelize (admisi, antrian, auth, datamaster, farmasi, IGD, inventory, lab, payment, rawat inap, rawat jalan, rekam medis, dan setting).

### Penyamaran nilai sensitif

Sebelum disimpan atau ditampilkan, ringkasan perubahan disaring:

- field yang namanya mengandung kata seperti `password`, `sandi`, `token`, `secret`, `rahasia`, `apikey`, `kunci`, `signature`, atau `authorization` **dibuang** atau ditandai `[DISAMARKAN]`;
- **NIK** disamarkan, hanya menyisakan 6 digit depan dan 2 digit belakang;
- berkas biner (mis. unggahan PDF) diganti penanda `[BERKAS BINER n byte]`, dan teks sangat panjang dipotong.

## Append-only

Sifat append-only dijaga dua lapis:

1. **Aplikasi**: tidak ada endpoint untuk mengubah atau menghapus catatan audit.
2. **Database**: trigger `audit_trail_tolak_ubah_hapus_trg` menolak setiap `UPDATE` dan `DELETE` pada tabel `audit_trail` dari jalur mana pun, termasuk akses database langsung:

```text
ERROR: audit_trail bersifat append-only: UPDATE/DELETE tidak diizinkan
```

Satu-satunya pengecualian adalah sesi yang secara eksplisit memakai `SET LOCAL audit_trail.izinkan_tulis_sistem = 'on'`, yang disediakan untuk migrasi pemeliharaan resmi, bukan untuk kode aplikasi.

## Rantai hash

Setiap faskes punya rantai hash sendiri:

```text
hash_baris = sha256( kanonik(isi baris) + hash_sebelumnya )
```

- `hash_sebelumnya` adalah `hash_baris` dari catatan terakhir faskes yang sama.
- Representasi kanonis memakai urutan kolom tetap dan JSON dengan kunci terurut, agar hash bisa dihitung ulang persis sama saat verifikasi.
- Penulisan dikunci per faskes dengan `pg_advisory_xact_lock`, sehingga penulisan serentak tidak membuat rantai bercabang.
- Untuk perubahan di dalam transaksi, baris audit ditulis **setelah transaksi utama commit**. Perubahan yang di-rollback tidak meninggalkan catatan audit palsu.

Mengubah, menghapus, atau menyisipkan baris di tengah rantai membuat hash baris itu, atau keterkaitannya dengan baris berikutnya, tidak cocok lagi saat diverifikasi.

::: info Kegagalan audit
Secara bawaan, kegagalan menulis catatan audit **tidak** menggagalkan transaksi utama. Kegagalan itu dilaporkan ke log konsol layanan. Pantau log layanan untuk pesan `[audit-trail] gagal menulis catatan audit`.
:::

## Melihat catatan: Setting › Audit Trail

Menu **Setting › Audit Trail** menyediakan:

- **cari dan filter** berdasarkan pasien, pengguna, aksi, entitas, layanan, dan rentang waktu;
- **detail** setiap catatan, termasuk perubahan nilai lama → baru;
- **riwayat akses per pasien**;
- **ekspor Excel** (paling banyak 5.000 baris pertama yang cocok per ekspor);
- **verifikasi rantai hash** untuk suatu rentang waktu (paling banyak 5.000 baris per verifikasi; bila rentang lebih besar, hasil ditandai terpotong dan rentang perlu dipecah).

Semua kueri dibatasi `faskes_uuid` dari token, jadi pengguna hanya melihat catatan faskesnya sendiri.

### Izin

Akses diatur submodul izin **Audit Trail** pada modul **Setting**:

| Aksi | Memberi akses ke |
|---|---|
| `LIHAT` | Cari, detail, riwayat per pasien, dan verifikasi rantai hash. |
| `EKSPOR` | Ekspor catatan. |

Secara bawaan izin ini **hanya diberikan ke superadmin** (lewat migrasi `20261018000001-izin_audit_trail_setting`). Peran lain, termasuk admin faskes, harus diberi secara manual di **Datamaster › Role**. Izin diperiksa di server oleh `permission-sdk`, tidak hanya disembunyikan di UI.

### Endpoint

| Metode & path | Izin | Fungsi |
|---|---|---|
| `GET /api/v3/setting/audit-trail` | `LIHAT` | Cari catatan (filter lewat query: `patient_uuid`, `pengguna_uuid`, `aksi`, `entitas`, `layanan`, `dari`, `sampai`, `page`, `page_size`). |
| `GET /api/v3/setting/audit-trail/:uuid` | `LIHAT` | Detail satu catatan. |
| `GET /api/v3/setting/audit-trail/pasien/:patientUuid` | `LIHAT` | Riwayat akses dan perubahan per pasien. |
| `POST /api/v3/setting/audit-trail/ekspor` | `EKSPOR` | Menyiapkan data ekspor. |
| `POST /api/v3/setting/audit-trail/verifikasi` | `LIHAT` | Memverifikasi rantai hash pada rentang `dari`–`sampai` (epoch detik). |

Contoh hasil verifikasi:

```json
{
  "message": "Rantai hash utuh",
  "payload": {
    "status": "utuh",
    "diperiksa": 1240,
    "waktu_mulai": 1760745600,
    "waktu_selesai": 1760832000,
    "uuid_tidak_cocok": [],
    "terpotong": false
  }
}
```

## Mencatat peristiwa dari kode

Perubahan pada tabel daftar putih tercatat otomatis. Untuk peristiwa yang tidak berasal dari perubahan model (mis. login, akses baca, ekspor), panggil helper `catatPeristiwaAudit`:

```js
import { catatPeristiwaAudit } from "@opensimrs/model-sdk/audit-sequelize";

await catatPeristiwaAudit(sequelizeInstance, {
  faskes_uuid: author.faskesUuid,   // selalu dari token
  layanan: "setting",
  aksi: "ekspor",
  entitas: "Audit Trail",
});
```

Pengguna, IP, user agent, dan request id diambil dari konteks permintaan bila tidak diisi. Helper ini tidak melempar galat ke pemanggil. Bila operasi Anda sudah mencatat peristiwa yang lebih spesifik sendiri (mis. `ganti_sandi`), berikan opsi `{ skipAudit: true }` pada operasi model agar tidak tercatat dua kali.

## Lihat juga

- [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin)
- [Basis Data & Migrasi](/arsitektur/basis-data-migrasi)
- [Kebijakan Keamanan](/pendahuluan/keamanan)
