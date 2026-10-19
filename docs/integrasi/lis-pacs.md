# LIS & PACS

Halaman ini untuk tim IT faskes yang menyambungkan OpenSIMRS ke sistem informasi laboratorium (LIS) dan ke PACS/RIS radiologi. Setelah mengikuti halaman ini, Anda memahami pola konfigurasinya, cara mendaftarkan alamat penerima hasil di sistem mitra, dan cara mengujinya dengan server tiruan sebelum memakai sistem sungguhan.

## Integrasi yang tersedia

| Integrasi | Layanan | Fitur katalog | Konfigurasi koneksi | Pemetaan kode |
|---|---|---|---|---|
| **LIS Patologi Klinik** | `lab-service` (8087) | `lab_bridging_lis` | Setting › Konfigurasi Integrasi › LIS › Lab PK | Laboratorium › Mapping LIS |
| **LIS Patologi Anatomi** | `penunjang-service` (8099) | `pa_bridging_lis` | Setting › Konfigurasi Integrasi › LIS › Lab PA | Patologi Anatomi › Mapping LIS PA |
| **LIS Mikrobiologi** | `penunjang-service` (8099) | `mikro_bridging_lis` | Setting › Konfigurasi Integrasi › LIS › Mikrobiologi | Mikrobiologi › Mapping LIS |
| **PACS/RIS Radiologi** | `penunjang-service` (8099) | `rad_bridging_pacs` | Setting › Konfigurasi Integrasi › Radiologi › PACS/RIS | Radiologi › Mapping PACS |

Nyalakan fitur bridging di **Setting › Manajemen Modul** bila belum aktif di segmen faskes Anda. Lihat [Manajemen Modul & Fitur](/arsitektur/manajemen-modul).

## Pola konfigurasi

Semua bridging di atas memakai pola yang sama.

### 1. Koneksi

Satu faskes boleh punya **lebih dari satu koneksi** (misalnya dua vendor LIS). Satu koneksi ditandai **bawaan** dan dipakai bila petugas tidak memilih.

Isi koneksi pada umumnya:

| Kolom | Arah | Keterangan |
|---|---|---|
| URL registrasi / kirim order | OpenSIMRS → sistem mitra | Alamat tujuan order |
| URL ambil hasil | OpenSIMRS → sistem mitra | Opsional, untuk menarik hasil secara manual |
| API key | OpenSIMRS → sistem mitra | Kunci yang diberikan vendor. Dikirim saat OpenSIMRS memanggil sistem mitra |
| Kode RS (dan kode lab untuk LIS PK) | OpenSIMRS → sistem mitra | Identitas faskes di sistem mitra |
| **Kunci masuk** | sistem mitra → OpenSIMRS | Dibuat otomatis oleh OpenSIMRS saat koneksi baru disimpan |

Kolom tambahan per integrasi:

- **LIS PK**: mode kirim `per_order` atau `bulk` (kirim massal untuk MCU). Mode bulk membutuhkan URL registrasi bulk dan **Kode Lab**.
- **LIS PA**: URL laporan (opsional).
- **PACS/RIS**: URL viewer untuk membuka citra.

### 2. Kunci masuk per koneksi

Kunci masuk adalah sandi yang dipakai sistem mitra saat mengirim hasil ke OpenSIMRS. Aturannya:

- kunci **ditampilkan utuh satu kali** saat dibuat. Salin dan pasang segera di sistem mitra;
- setelah itu hanya tampil tersamar;
- tombol **Buat ulang kunci masuk** membuat kunci baru dan langsung membatalkan kunci lama;
- OpenSIMRS menentukan koneksi dan faskes dari kunci ini, **tidak pernah** dari isi pesan.

API key dan kunci masuk disimpan terenkripsi. Kunci enkripsinya:

| Integrasi | Variabel (bila kosong memakai `SECRET_KEY`) |
|---|---|
| LIS PK, LIS Mikrobiologi | `LIS_KUNCI_RAHASIA` |
| LIS PA | `PA_LIS_KUNCI_RAHASIA` |
| PACS/RIS | `RAD_PACS_KUNCI_RAHASIA` |

::: danger
Jangan mengganti kunci enkripsi atau `SECRET_KEY` setelah koneksi tersimpan. API key dan kunci masuk lama tidak bisa dibaca lagi.
:::

### 3. Pemetaan kode

Sistem mitra biasanya punya kode master sendiri. Petakan kode OpenSIMRS ke kode sistem mitra sebelum mengirim order pertama:

- **LIS PK**: tindakan/tarif lab, item hasil pemeriksaan, serta unit asal, dokter, dan penjamin. Order MCU memakai unit asal dan dokter MCU yang dipetakan di tempat yang sama;
- **LIS PA**: pemeriksaan, unit/dokter/penjamin, dan field hasil (per koneksi);
- **LIS Mikrobiologi**: kode per jenis master;
- **PACS/RIS**: tindakan → kode prosedur & modalitas, unit/dokter/penjamin, serta ruang/alat → AE Title.

### 4. Alur order dan hasil

1. Petugas **memvalidasi order** di OpenSIMRS. Order dikirim ke sistem mitra memakai koneksi bawaan, atau koneksi yang dipilih.
2. **Bila pengiriman gagal, validasi order dibatalkan**, sehingga order tidak tampak sudah terkirim padahal belum. Khusus radiologi, tombol **Validasi Saja** tetap tersedia sebagai jalur darurat.
3. Hasil masuk dengan dua cara:
   - **push**: sistem mitra memanggil titik masuk OpenSIMRS dengan kunci masuk;
   - **tarik manual**: petugas berizin menekan ambil hasil, dan OpenSIMRS memanggil URL ambil hasil koneksi.
4. Setiap pengiriman tercatat di riwayat. Bila status tidak pasti (misalnya koneksi terputus setelah data terkirim), gunakan **Cek status** sebelum mengirim ulang agar tidak terjadi registrasi ganda.

## Titik masuk hasil

Daftarkan alamat berikut di sistem mitra. Kirim kunci masuk di header `x-api-key` atau parameter `?key=`. Titik masuk ini **tidak memakai JWT login**.

| Integrasi | Alamat langsung ke layanan | Alias di bawah `/api/v3` |
|---|---|---|
| LIS PK | `POST http(s)://<host lab-service>/adam-lis/bridging` | `POST /api/v3/lab/lis/hasil` |
| LIS PA | `POST http(s)://<host penunjang-service>/adam-pa-lis/bridging` | `POST /api/v3/penunjang/patologi/lis/hasil` |
| LIS Mikrobiologi | `POST http(s)://<host penunjang-service>/adam-lis/mikrobiologi/bridging` | `POST /api/v3/penunjang/mikrobiologi/lis/hasil` |
| PACS/RIS | `POST http(s)://<host penunjang-service>/adam-pacs/bridging` | `POST /api/v3/penunjang/radiologi/pacs/hasil` |

Galat dari titik masuk dikembalikan dalam format `{ "success": false, "message": "…" }`.

::: warning Di balik gateway, pakai alias `/api/v3`
Gateway nginx bawaan (`deploy/server/gateway.nginx.conf`) hanya meneruskan `/api/v3/*` dan `/adam-lis/` (ke `lab-service`). Alamat `/adam-pa-lis/`, `/adam-pacs/`, dan `/adam-lis/mikrobiologi/` **tidak sampai** ke `penunjang-service` lewat gateway. Bila sistem mitra mengakses OpenSIMRS lewat gateway atau domain API, daftarkan alias `/api/v3/...` dari tabel di atas.
:::

Contoh uji titik masuk dengan alias (data fiktif, kunci dari OpenSIMRS):

```bash
curl -X POST "https://api.simrs.contoh.id/api/v3/lab/lis/hasil" \
  -H "Content-Type: application/json" \
  -H "x-api-key: <kunci masuk>" \
  -d @hasil-uji.json
```

Format isi pesan mengikuti kontrak tiap integrasi. Rujukan lengkapnya ada di README server tiruan pada bagian berikut.

## Menguji dengan server tiruan

Repo menyediakan server tiruan tanpa dependensi di folder `scripts/`. Gunakan hanya data fiktif (NIK berawalan `9999`).

| Integrasi | Perintah | Port bawaan | Rujukan kontrak |
|---|---|---|---|
| LIS PK | `node scripts/lis-tiruan.mjs` | 2312 | `scripts/README-lis-tiruan.md` |
| LIS PA | `node scripts/lis-pa-tiruan.mjs` | 2313 | `scripts/README-lis-pa-tiruan.md` |
| LIS Mikrobiologi | `PORT=2612 node scripts/lis-tiruan-mikro.mjs` | atur dengan `PORT` (contoh README: 2612) | `scripts/README-lis-tiruan-mikro.md` |
| PACS/RIS | `node scripts/pacs-tiruan.mjs` | 2412 | `scripts/README-pacs-tiruan.md` |

Selain itu, `LIS_MODE=mock` (LIS PK), `PA_LIS_MODE=mock` (LIS PA), dan `LIS_MIKRO_MODE=mock` (LIS Mikrobiologi) membuat registrasi dibalas tiruan tanpa server LIS.

## Hak akses

| Aksi | Izin |
|---|---|
| Melihat/mengubah koneksi dan kunci masuk | **Setting › Konfigurasi Integrasi** (READ / UPDATE KONFIGURASI LAINNYA). LIS Mikrobiologi memakai **Mikrobiologi › Konfigurasi LIS Mikrobiologi** (LIHAT / KELOLA) |
| Pemetaan kode | Izin datamaster/mapping modul terkait, atau UPDATE KONFIGURASI LAINNYA |
| Mengirim order | Izin validasi order modul terkait, mis. **Laboratorium › Order Lab › VALIDASI ORDER**, **Radiologi › Order Radiologi › VALIDASI** |
| Kirim massal LIS dari MCU | **MCU › Peserta › KIRIM LIS** |
| Menarik hasil | Izin input hasil modul terkait, mis. **Laboratorium › Hasil Pemeriksaan › SIMPAN HASIL** |

Rute bridging PACS, LIS PA, dan HDIS juga memeriksa status fitur secara *fail-closed*: bila fitur nonaktif atau statusnya tidak bisa dipastikan, permintaan ditolak.

## Pola yang sama: Bank Darah ↔ UTD

Bridging **Bank Darah RS ↔ UTD** (`bdrs_bridging`) dan [HDIS hemodialisa](/integrasi/hdis) memakai pola koneksi, kunci masuk, dan pemetaan yang sama. Konfigurasi UTD ada di **Setting › Konfigurasi Integrasi › Bank Darah › UTD**, pemetaannya di **Bank Darah › Mapping UTD**, dan titik masuknya `/adam-utd/bridging`. Kantong darah hanya masuk stok setelah petugas berizin menerimanya; tidak ada penerimaan otomatis. Uji dengan `node scripts/utd-tiruan.mjs`.

## Lihat juga

- [Laboratorium](/modul/laboratorium)
- [Radiologi](/modul/radiologi)
- [Penunjang Medis](/modul/penunjang-medis)
- [HDIS (Hemodialisa)](/integrasi/hdis)
- [Akses Lewat Domain](/memulai/akses-domain)
