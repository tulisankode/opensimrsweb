# Manajemen Modul & Fitur

Manajemen Modul adalah kerangka yang membuat satu aplikasi OpenSIMRS bisa dipakai dokter praktik mandiri sampai rumah sakit kelas A, tanpa membebani faskes kecil dengan menu rumah sakit. Halaman ini menjelaskan konsepnya untuk tim IT dan langkah teknisnya untuk pengembang. Katalog lengkap (setiap modul, fitur, dan bagian) ada di [Peta Modul](/modul/).

## Empat tingkat

```text
Segmen faskes ──preset──▶ Modul ──▶ Fitur ──▶ Bagian
                    ▲
          override per faskes (hanya superadmin)
```

| Tingkat | Artinya | Contoh |
|---|---|---|
| **Segmen** | Jenis faskes. Menentukan modul, fitur, dan bagian yang **aktif bawaan** (preset). | Dokter praktik mandiri, klinik pratama, puskesmas, RS kelas C |
| **Modul** | Menu besar di header aplikasi. | Farmasi, Laboratorium, Rawat Inap |
| **Fitur** | Kemampuan di dalam modul: tombol, tab, atau langkah alur. | Racikan obat, Shift kasir, Bridging LIS |
| **Bagian** | Unit terkecil: satu form asesmen atau satu jenis surat. Bisa dibatasi ke jenis poli tertentu. | Form Alergi, Odontogram (khusus poli gigi) |

Istilah penting:

- **Preset**: daftar bawaan per segmen. Faskes yang tidak diubah apa-apa mengikuti preset segmennya.
- **Override**: pengecualian per faskes yang dibuat superadmin, mis. "klinik pratama ini juga memakai Radiologi". Yang disimpan hanya **selisih** dari preset, sehingga bila preset diperbarui, faskes ikut berubah kecuali pada item yang di-override.

### Modul: inti dan opsional

- **Modul inti** selalu aktif dan tidak bisa dimatikan: Dashboard, Pendaftaran Pasien, RME Rawat Jalan, Kasir & Pembayaran, Data Master, Laporan, SATUSEHAT, dan Audit Trail.
- **Modul opsional** aktif menurut preset segmen dan bisa dinyalakan atau dimatikan per faskes.
- Setiap modul punya **kelompok** (Inti, Layanan, Penunjang, Penjaminan, Puskesmas, Rumah Sakit) untuk layar Manajemen Modul, serta **bidang › instalasi** yang menempatkannya di panel menu **Lainnya** mengikuti struktur organisasi faskes. Bidang yang dipakai: *Pelayanan Medis & Keperawatan*, *Penunjang Medis*, *Penunjang Umum*, *Keuangan & Administrasi*, *Manajemen & Mutu*, *Program Kesehatan Masyarakat*, dan *Sistem*.

### Aturan penting

| Aturan | Penjelasan |
|---|---|
| Status **Segera** | Modul/fitur yang terdaftar di katalog tetapi belum dibangun (`tersedia: false`). Tampil di menu sebagai *Segera* dan tidak bisa dibuka. |
| Fitur/bagian **wajib** | Tidak bisa dimatikan, mis. Resume Medis dan Telaah Resep, karena menyangkut keselamatan pasien atau regulasi. |
| **Syarat modul** | Sebagian fitur hanya berfungsi bila modul lain aktif, mis. Obat Kronis BPJS butuh modul BPJS FKRTL. |
| Fitur ikut modulnya | Fitur yang tidak disebut di `preset.fitur_mati` aktif di semua segmen **selama modulnya aktif**. |
| Faskes tanpa segmen | Semua modul yang tersedia aktif. Segera atur segmen setelah membuat faskes baru. |

## Segmen dan isi bawaannya

Katalog saat ini memuat **8 segmen**, **37 modul** (8 inti, 1 berstatus Segera), **102 fitur** (4 berstatus Segera), dan **27 bagian**.

| Segmen | Kode | Modul aktif bawaan | Fitur aktif bawaan | Bagian aktif bawaan |
|---|---|---|---|---|
| Dokter Praktik Mandiri | `praktik_mandiri` | 10 | 11 | 18 |
| Klinik Pratama | `klinik_pratama` | 15 | 36 | 24 |
| Klinik Utama | `klinik_utama` | 21 | 64 | 26 |
| Puskesmas | `puskesmas` | 16 | 38 | 24 |
| Rumah Sakit Kelas D | `rs_d` | 22 | 72 | 27 |
| Rumah Sakit Kelas C | `rs_c` | 29 | 77 | 27 |
| Rumah Sakit Kelas B | `rs_b` | 33 | 87 | 27 |
| Rumah Sakit Kelas A | `rs_a` | 34 | 93 | 27 |

Angka di atas dihitung dari `database/data/katalog-modul.json`: modul inti ditambah modul di `preset.segmen_modul`, lalu fitur dan bagian milik modul tersebut dikurangi `preset.fitur_mati`/`preset.bagian_mati` dan yang syarat modulnya tidak aktif. Item berstatus *Segera* ikut terhitung, dan bagian khusus jenis poli dihitung satu kali walaupun hanya tampil di poli tertentu. Matriks lengkap modul × segmen ada di [Peta Modul](/modul/).

## Mengaktifkan atau mematikan modul

Hanya **superadmin** yang bisa menyimpan perubahan. Admin faskes biasa bisa melihat halamannya tetapi tidak bisa menyimpan.

1. Login sebagai superadmin dan pilih faskes yang akan diatur.
2. Buka **Setting › Manajemen Modul**.
3. **Pilih segmen** faskes. Modul, fitur, dan bagian bawaan segmen itu tampil dengan label *Bawaan segmen*.
4. Nyalakan atau matikan modul, fitur, dan bagian. Perubahan di luar preset ditandai sebagai override.
5. **Simpan.** Sistem mencatat perubahan di **riwayat** (siapa, kapan, apa yang berubah) dan menyinkronkan izin modul yang baru aktif ke peran admin faskes.
6. Pengguna lain perlu **login ulang** agar menunya mengikuti konfigurasi baru.

Contoh kasus:

| Kebutuhan | Langkah |
|---|---|
| Klinik pratama ingin memakai Radiologi | Segmen tetap *Klinik Pratama*; nyalakan modul **Radiologi** (override), lalu beri izin Radiologi ke peran terkait di Datamaster › Role. |
| Klinik pratama ingin bridging ke LIS | Nyalakan fitur **Bridging LIS** di modul Laboratorium, lalu isi koneksi di Setting › Konfigurasi Integrasi. |
| Praktik mandiri tidak menjual obat sendiri | Matikan modul **Farmasi**. Resep tetap bisa ditulis di RME, tetapi menu dan alur apotek hilang. |

## Menu yang tampil

Modul aktif **tidak otomatis** berarti semua pengguna melihat menunya:

```text
Menu yang tampil  =  modul AKTIF di faskes  ∩  modul yang ada di IZIN pengguna
```

- **Modul aktif** diatur di Setting › Manajemen Modul.
- **Izin** diatur per peran di Datamaster › Role (lihat [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin#struktur-izin)).
- **Sinkron otomatis untuk admin**: menyimpan Manajemen Modul memanggil `POST /api/v3/auth/permission/sinkron-modul`, yang menambahkan izin modul aktif ke **peran admin faskes** (peran yang memiliki izin Setting › "Profile Faskes"). Peran lain diatur manual.

Bila menu modul tidak muncul, periksa berurutan:

1. Apakah modulnya aktif untuk faskes ini? (Setting › Manajemen Modul)
2. Apakah peran pengguna punya izin modul itu? (Datamaster › Role)
3. Apakah pengguna sudah login ulang?
4. Apakah modulnya berstatus *Segera*?

### Di mana konfigurasi berlaku

Frontend membaca konfigurasi faskes saat login dari `GET /api/v3/setting/modul` (berisi modul, fitur, dan bagian aktif beserta katalognya), lalu menyaring menu header, sidebar, rute halaman, tombol, tab, langkah alur, dan bagian form RME.

::: warning Penegakan di server baru sebagian
Penyaringan berdasarkan modul aktif sebagian besar terjadi di frontend. Di sisi server baru sebagian layanan yang menegakkannya (mis. `payment-service` mengecek fitur Shift Kasir, `penunjang-service` menegakkan izin per aksi). Penegakan menyeluruh di backend masih tercatat di backlog.
:::

## Katalog dan sinkronisasi

**Sumber tunggal** katalog adalah `database/data/katalog-modul.json`, berisi `jenis_poli`, `segmen`, `modul`, `fitur`, `bagian`, dan `preset` (`segmen_modul`, `fitur_mati`, `bagian_mati`).

Katalog disalin ke tabel database (`ref_*` dan `preset_segmen_*`) oleh fungsi `sinkronKatalog` di `database/lib/sinkron-katalog.cjs`. Fungsi ini idempoten: melakukan *upsert* item katalog, menulis ulang tabel preset, dan menghapus item yang tidak lagi ada di JSON. Override faskes yang merujuk item yang dihapus ikut terhapus.

```text
ref_segmen ──< preset_segmen_modul >── ref_modul ──< ref_fitur ──< ref_bagian ──< ref_bagian_poli >── ref_jenis_poli
faskes ──1:1── faskes_segmen ──< faskes_modul_override / faskes_fitur_override / faskes_bagian_override
```

Setiap perubahan katalog dijalankan lewat **migrasi baru** yang hanya memanggil `sinkronKatalog`:

```js
'use strict';
const { sinkronKatalog } = require('../lib/sinkron-katalog.cjs');

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction((transaction) => sinkronKatalog(queryInterface, transaction));
  },
  async down() {
    // Katalog mengikuti JSON; kembalikan JSON lalu jalankan migrasi sinkron baru.
  },
};
```

Setelah mengubah katalog, perbarui juga dokumen katalog di repo:

```bash
npm run docs:katalog                      # = node scripts/dokumen-katalog.mjs
node scripts/dokumen-katalog.mjs --cek    # hanya memeriksa (dipakai CI)
```

## Menambah modul atau fitur

Ringkasan langkah untuk pengembang:

1. **Katalog JSON**: tambahkan modul di array `modul` (`kode` snake_case yang unik dan tidak boleh diganti, `nama`, `kelompok`, `bidang`, `instalasi`, `inti`, `tersedia`, `deskripsi`, `menu` = nama modul izin, `rute`, `urutan`), lalu masukkan kodenya ke `preset.segmen_modul.<segmen>` yang mengaktifkannya. Fitur baru masuk array `fitur`; bila tidak boleh menyala di segmen tertentu, tambahkan ke `preset.fitur_mati.<segmen>`.
2. **Migrasi sinkron katalog** baru, lalu `npm run db:migrate`. Jangan mengedit migrasi yang sudah ada.
3. **Izin**: objek izin di `auth-service/src/helpers/permission-list.js` + kunci di `mapPermission`, dan nama modul di `SEMUA_MODUL` pada `permission-controller.js`.
4. **Frontend**: daftarkan rute (wajib ada rute induk dengan redirect, mis. `/patologi-anatomi` → `/patologi-anatomi/order`) dan menu di header. Di komponen, pakai helper dari `frontend-service/src/stores/modulFaskes.ts`:

   | Helper | Pakai untuk |
   |---|---|
   | `modulAktif('patologi_anatomi')` | Menampilkan/menyembunyikan elemen milik modul |
   | `fiturAktif('lab_bridging_lis')` | Tombol, tab, atau langkah alur milik fitur |
   | `bagianTampil('rme_asesmen', 'Pemeriksaan Gigi', lokasiUuid)` | Bagian form yang bisa bergantung jenis poli |
   | `ruteDiizinkanModul(path)` | Dipakai router guard & sidebar |

5. **Izin peran lama**: buat migrasi izin untuk peran yang sudah ada, atau andalkan sinkron otomatis untuk peran admin.
6. **Backend & dokumen**: tegakkan izin di server untuk aksi penting, tambahkan seeder demo bila perlu (idempoten, data fiktif), lalu jalankan `npm run docs:katalog`.
7. **Uji di dua segmen**: satu yang mengaktifkan dan satu yang mematikan modul/fitur tersebut.

## Lihat juga

- [Peta Modul](/modul/)
- [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin)
- [Basis Data & Migrasi](/arsitektur/basis-data-migrasi)
