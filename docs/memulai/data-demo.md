# Data Demo

OpenSIMRS menyediakan data demo fiktif agar Anda bisa langsung mencoba setiap segmen faskes tanpa data pasien nyata. Halaman ini menjelaskan 8 faskes demo, pola akun per peran, dan perintah untuk mengisi, mengulang, serta menambah transaksi demo.

::: danger Hanya untuk development dan staging
Data demo seluruhnya fiktif dan **hanya untuk lingkungan development dan staging**. Jangan menjalankan `db:demo:seed` atau `db:demo:reset` di server production atau server yang berisi data nyata: `db:demo:reset` **menghapus seluruh data faskes dan pasien**.
:::

## Prasyarat

- Migrasi sudah dijalankan: `npm run db:migrate`.
- Berkas `.env` di root berisi koneksi PostgreSQL (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`).
- Untuk `db:demo:reset`, `.env` tiap layanan sudah dibuat, karena skrip membaca koneksi MongoDB dari `rekamedis-service/.env`.
- Untuk `db:demo:transaksi`, semua layanan backend sedang berjalan (`npm run dev`).

Langkah-langkah ini sudah dijalankan otomatis oleh installer `install.sh` / `install.cmd`, kecuali Anda memilih tanpa data demo. Lihat [Instalasi](/memulai/instalasi).

## Mengisi data demo

```bash
npm run db:demo:seed
```

Perintah ini membuat **8 faskes fiktif**, satu per segmen, beserta lokasi/poli/kamar, penjamin, pegawai, jadwal dokter, peran dan akun, tarif, obat dan stok awal, layar antrian, serta datamaster penunjang. Tidak ada transaksi pasien yang dibuat. Daftar lengkap akun dicetak di akhir proses.

Pada database baru, `db:demo:seed` bisa langsung dijalankan karena `schema.sql` hanya berisi struktur dan data referensi nasional. Bila database sudah berisi faskes, skrip berhenti dan meminta Anda menjalankan reset terlebih dahulu.

## Faskes demo

Semua nama faskes dan orang di data demo fiktif.

| Kode | Awalan akun | Segmen | Nama faskes |
|---|---|---|---|
| `PMD` | `pm` | Dokter praktik mandiri | Praktik dr. Andi Wijaya |
| `KPS` | `kp` | Klinik pratama | Klinik pratama demo |
| `KUM` | `ku` | Klinik utama | Klinik Utama Mitra Medika |
| `PKM` | `pkm` | Puskesmas | UPT Puskesmas Tambak Wedi Asri |
| `RSD` | `rsd` | RS kelas D | RSU Bhakti Husada |
| `RSC` | `rsc` | RS kelas C | RSU Citra Medika Malang |
| `RSB` | `rsb` | RS kelas B | RS Permata Husada Surabaya |
| `RSA` | `rsa` | RS kelas A | RSUP Dharma Nusantara |

Modul yang aktif di setiap faskes mengikuti preset segmennya di Manajemen Modul. Misalnya, faskes klinik utama dan RS kelas D–A memiliki ruang rawat inap, dan faskes RS kelas D–A juga memiliki IGD.

## Akun demo

**Kata sandi semua akun** adalah nilai `DEMO_PASSWORD` di `.env` root, bawaan **`Demo@2026`**.

| Akun | Pola | Contoh |
|---|---|---|
| Superadmin | `superadmin` | `superadmin` |
| Dokter | `<awalan>.dr.<nama depan>` | `pm.dr.andi`, `kp.dr.rina` |
| Dokter gigi | `<awalan>.drg.<nama depan>` | `kp.drg.maya` |
| Staf | `<awalan>.<peran>` | `rsd.kasir`, `kp.pendaftaran` |
| Staf penunjang | `<awalan>.fisioterapis`, `<awalan>.radiografer`, `<awalan>.mcu` | `rsa.radiografer` |
| Admin faskes | `<awalan>.admin` | `ku.admin` |

Catatan:

- **`superadmin`** memakai peran `super admin`, bisa berpindah faskes, dan merupakan satu-satunya akun yang boleh mengubah Manajemen Modul.
- **Peran staf**: `perawat`, `apoteker`, `lab`, `pendaftaran`, `kasir`, `gudang`, `admin`.
- **Staf penunjang** hanya dibuat bila modulnya (Fisioterapi, Radiologi, MCU) aktif di segmen faskes tersebut.
- Bila satu faskes punya dua staf dengan peran yang sama, akun kedua diberi akhiran angka, mis. `kp.perawat` dan `kp.perawat2`.
- **Praktik mandiri** berbeda: dokter pemilik (`pm.dr.andi`) memiliki akses penuh dan dibantu satu akun `pm.asisten`. Faskes ini tidak memiliki akun `pm.admin`.
- Email akun demo memakai domain fiktif `@demo.opensimrs.local`.

::: tip Uji dengan akun peran
Saat menguji perubahan, pakai akun peran yang sesuai (mis. `kp.pendaftaran` untuk pendaftaran, `kp.kasir` untuk kasir), bukan hanya `superadmin`, agar masalah izin ikut terlihat.
:::

Untuk mencoba login lewat API:

```bash
curl -X POST http://localhost:8083/api/v3/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "superadmin", "password": "Demo@2026"}'
```

## Mengulang dari awal

```bash
npm run db:demo:reset -- --ya
npm run db:demo:seed
```

`db:demo:reset` mengosongkan seluruh data faskes dan transaksi di PostgreSQL serta rekam medis di MongoDB. Data referensi nasional (wilayah, ICD, SNOMED, LOINC, odontogram), katalog Manajemen Modul, dan riwayat migrasi **dipertahankan**. Flag `--ya` wajib sebagai konfirmasi; tanpa flag ini skrip menolak berjalan.

::: warning Cadangkan dulu
Reset tidak bisa dibatalkan. Buat cadangan bila database berisi data yang masih Anda perlukan.
:::

## Transaksi demo

Setelah semua layanan berjalan (`npm run dev`), isi data transaksi yang realistis:

```bash
npm run db:demo:transaksi
```

Berbeda dengan `db:demo:seed` yang menulis datamaster langsung ke database, skrip ini **menjalankan alur API sungguhan** seperti layar aplikasi, sehingga data lintas layanan konsisten:

1. Pengadaan dan penerimaan obat/BMHP ke lokasi stok faskes.
2. ±30 pasien fiktif (sekitar 40% berpenjamin BPJS).
3. ±60 kunjungan rawat jalan selama 30 hari terakhir: pendaftaran → antrean → pemeriksaan dokter (asesmen, tindakan, resep) → resume → farmasi → kasir. Termasuk pasien kontrol ulang dan beberapa kunjungan hari ini dengan status beragam.
4. Penjualan obat bebas di farmasi.

Bawaan skrip adalah faskes praktik mandiri (`PMD`).

### Opsi

Opsi diberikan setelah `--`:

| Opsi | Bawaan | Fungsi |
|---|---|---|
| `--faskes <kode>` | `PMD` | Kode faskes demo yang diisi transaksi |
| `--hari <angka>` | `30` | Rentang hari ke belakang (minimal 7) |
| `--benih <angka>` | tetap | Benih acak; benih yang sama menghasilkan data yang sama persis |
| `--bersihkan` | – | Menghapus transaksi yang dibuat skrip ini (datamaster tidak disentuh) |
| `--dokter <username>` | dokter faskes | Akun dokter yang dipakai |
| `--petugas <username>` | asisten/pendaftaran/admin | Akun petugas yang dipakai |
| `--gudang <username>` | pemilik/gudang/admin | Akun gudang untuk pengadaan |
| `--apoteker <username>` | apoteker/asisten/admin | Akun farmasi (telaah, verifikasi, serah resep, penjualan bebas) |
| `--kasir <username>` | kasir/asisten/admin | Akun kasir (pembayaran, buka & tutup shift) |
| `--rencana` | – | Uji kering: hanya menampilkan rencana tanpa memanggil API transaksi |

Contoh:

```bash
# isi 14 hari terakhir dengan variasi acak lain
npm run db:demo:transaksi -- --faskes PMD --hari 14 --benih 42

# hapus transaksi demo yang dibuat skrip
npm run db:demo:transaksi -- --faskes PMD --bersihkan
```

Baris yang dibuat skrip dicatat di tabel jejak `demo_jejak_transaksi`. Bila transaksi demo untuk faskes itu sudah ada, skrip berhenti dan meminta Anda menjalankan `--bersihkan` terlebih dahulu.

## Melengkapi datamaster penunjang

Untuk menambah datamaster layanan penunjang ke faskes demo yang **sudah ada**, tanpa reset:

```bash
npm run db:demo:master-penunjang
```

Skrip ini mengisi datamaster Laboratorium, Radiologi, Fisioterapi, MCU, Patologi Anatomi, Mikrobiologi, dan Bank Darah untuk modul yang aktif di tiap faskes. Skrip aman dijalankan berulang karena kode yang sudah ada dilewati.

| Opsi | Fungsi |
|---|---|
| `--faskes KUM,RSA` | Hanya faskes tertentu (kode faskes, dipisah koma) |
| `--modul laboratorium` | Hanya satu modul |
| `--kering` | Uji coba: semua perubahan di-rollback |

```bash
npm run db:demo:master-penunjang -- --faskes KUM,RSA
```

## Ringkasan perintah

| Perintah | Fungsi |
|---|---|
| `npm run db:demo:seed` | Membuat 8 faskes demo, akun, dan datamaster |
| `npm run db:demo:reset -- --ya` | Menghapus seluruh data faskes dan transaksi |
| `npm run db:demo:transaksi` | Mengisi transaksi demo lewat alur API |
| `npm run db:demo:master-penunjang` | Melengkapi datamaster penunjang ke faskes demo yang sudah ada |

::: info Instalasi faskes sungguhan
Belum ada wizard instalasi bersih tanpa data demo (backlog B-40). Untuk sementara, implementasi di faskes memakai `db:demo:seed` lalu menonaktifkan faskes demo. Lihat [Instalasi](/memulai/instalasi) dan [Deployment](/memulai/deployment).
:::

## Langkah berikutnya

- [Instalasi](/memulai/instalasi): menyiapkan OpenSIMRS sebelum mengisi data demo.
- [Manajemen Modul & Fitur](/arsitektur/manajemen-modul): mengapa menu tiap faskes demo berbeda.
- [Panduan Kontribusi › Cara menguji](/pendahuluan/kontribusi#cara-menguji)
- [Peta Modul](/modul/)
