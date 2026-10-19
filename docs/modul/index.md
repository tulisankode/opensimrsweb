# Peta Modul

Halaman ini memetakan seluruh modul OpenSIMRS menurut bidang dan instalasi, lengkap dengan statusnya, modul mana yang inti dan mana yang opsional, serta modul bawaan per segmen faskes. Halaman ini ditujukan bagi implementator faskes yang perlu menentukan modul yang dipakai, admin yang mengaktifkannya, dan pengembang yang ingin tahu cakupan tiap modul.

Semua data di halaman ini berasal dari katalog modul `database/data/katalog-modul.json` di repo OpenSIMRS. Katalog itu dimuat ke database lewat migrasi, lalu dipakai untuk menyaring menu, rute, tombol, dan form di aplikasi.

## Empat tingkat konfigurasi

OpenSIMRS dipakai oleh faskes dengan kebutuhan yang sangat berbeda, dari dokter praktik mandiri sampai rumah sakit kelas A. Karena itu kemampuan aplikasi dibagi menjadi empat tingkat:

| Tingkat | Artinya | Contoh |
|---|---|---|
| **Segmen** | Jenis faskes. Menentukan modul, fitur, dan bagian yang aktif bawaan (preset). | Klinik pratama, puskesmas, RS kelas C |
| **Modul** | Menu besar di header aplikasi. | Farmasi, Laboratorium, Rawat Inap |
| **Fitur** | Kemampuan di dalam modul: tombol, tab, atau langkah alur. | Obat racikan, Shift kasir, Bridging LIS |
| **Bagian** | Unit terkecil, misalnya satu form asesmen atau satu jenis surat. Bisa dibatasi ke jenis poli tertentu. | Form Alergi, Odontogram (poli gigi), Resep kacamata (poli mata) |

Katalog saat ini memuat **8 segmen**, **37 modul** (8 inti), **102 fitur**, dan **27 bagian**. Satu modul dan empat fitur masih berstatus *dalam pengembangan*.

::: info Status modul
- **Inti**: selalu aktif di semua faskes dan tidak bisa dimatikan.
- **Tersedia**: sudah dibangun dan bisa diaktifkan.
- **Dalam pengembangan**: sudah terdaftar di katalog (`tersedia: false`) tetapi belum dibangun. Di menu aplikasi, modul seperti ini tampil berlabel **Segera** dan tidak bisa dibuka.
:::

## Modul inti

Delapan modul berikut aktif di semua faskes, apa pun segmennya.

| Modul | Fungsi | Halaman |
|---|---|---|
| Dashboard | Ringkasan kunjungan dan pendapatan | [Manajemen & Mutu](/modul/manajemen#dashboard) |
| Pendaftaran Pasien | Data pasien, No. RM, pendaftaran kunjungan | [Pendaftaran & Antrian](/modul/pendaftaran-antrian) |
| RME Rawat Jalan | Pemeriksaan, SOAP, diagnosis ICD-10, tindakan, resep, resume | [Rawat Jalan](/modul/rawat-jalan) |
| Kasir & Pembayaran | Tagihan otomatis dan pembayaran | [Kasir & Penjamin](/modul/kasir-penjamin) |
| Data Master | Pegawai, praktisi, lokasi/poli, tarif, penjamin | – |
| Laporan | Laporan kunjungan, diagnosis, keuangan | [Manajemen & Mutu](/modul/manajemen#laporan) |
| SATUSEHAT | Integrasi wajib Kemenkes | [SATUSEHAT](/integrasi/satusehat) |
| Audit Trail | Jejak login, akses rekam medis, dan perubahan data (rantai hash) | [Audit Trail](/arsitektur/audit-trail) |

## Modul per bidang dan instalasi

Di menu atas aplikasi, modul yang tidak muat ditampilkan di panel **Lainnya**, satu kolom per bidang dengan instalasi sebagai subjudul. Tabel berikut mengikuti susunan yang sama.

### Pelayanan Medis & Keperawatan

| Instalasi | Modul | Status | Halaman |
|---|---|---|---|
| Instalasi Rawat Jalan | RME Rawat Jalan | Inti | [Rawat Jalan](/modul/rawat-jalan) |
| Instalasi Rawat Inap | Rawat Inap | Tersedia | [Rawat Inap](/modul/rawat-inap) |
| Instalasi Gawat Darurat | IGD | Tersedia | [IGD](/modul/igd) |
| Instalasi Bedah Sentral | Kamar Operasi | Tersedia | [Penunjang Medis](/modul/penunjang-medis#kamar-operasi) |
| Instalasi Perawatan Intensif | ICU / Intensif | Tersedia | [Penunjang Medis](/modul/penunjang-medis#icu-intensif) |
| Medical Check Up | Medical Check Up (MCU) | Tersedia | [Penunjang Medis](/modul/penunjang-medis#medical-check-up-mcu) |
| Unit Hemodialisa | Unit Hemodialisa | Tersedia | [Penunjang Medis](/modul/penunjang-medis#unit-hemodialisa) |

### Penunjang Medis

| Instalasi | Modul | Status | Halaman |
|---|---|---|---|
| Instalasi Farmasi | Farmasi | Tersedia | [Farmasi & Stok](/modul/farmasi-stok) |
| Instalasi Laboratorium | Laboratorium (Patologi Klinik) | Tersedia | [Laboratorium](/modul/laboratorium) |
| Instalasi Laboratorium | Patologi Anatomi | Tersedia | [Laboratorium](/modul/laboratorium#patologi-anatomi) |
| Instalasi Laboratorium | Mikrobiologi | Tersedia | [Laboratorium](/modul/laboratorium#mikrobiologi) |
| Instalasi Rehabilitasi Medik | Fisioterapi / Rehabilitasi Medik | Tersedia | [Penunjang Medis](/modul/penunjang-medis#fisioterapi-rehabilitasi-medik) |
| Instalasi Radiologi | Radiologi | Tersedia | [Radiologi](/modul/radiologi) |
| Instalasi Gizi | Gizi | Tersedia | [Penunjang Medis](/modul/penunjang-medis#gizi) |
| Instalasi Rekam Medis | Koding & Rekam Medis | Tersedia | [Penunjang Medis](/modul/penunjang-medis#koding-rekam-medis) |
| Instalasi Sterilisasi (CSSD) | CSSD | Tersedia | [Penunjang Medis](/modul/penunjang-medis#cssd) |
| Pelayanan Darah | Bank Darah RS (BDRS) | Tersedia | [Penunjang Medis](/modul/penunjang-medis#bank-darah-rs-bdrs) |
| Pelayanan Darah | UTD / UPTD Produksi Darah | Tersedia | [Penunjang Medis](/modul/penunjang-medis#utd-uptd-produksi-darah) |

### Penunjang Umum

| Instalasi | Modul | Status | Halaman |
|---|---|---|---|
| Logistik & Gudang | Gudang & Pengadaan (Inventory) | Tersedia | [Farmasi & Stok](/modul/farmasi-stok#gudang-pengadaan) |
| Transportasi & Ambulans | Manajemen Ambulans | Tersedia | [Penunjang Umum](/modul/penunjang-umum#manajemen-ambulans) |
| Instalasi Laundry | Laundry & Linen | Tersedia | [Penunjang Umum](/modul/penunjang-umum#laundry-linen) |
| IPSRS | Sarana dan Prasarana (IPSRS) | Tersedia | [Penunjang Umum](/modul/penunjang-umum#sarana-dan-prasarana-ipsrs) |

### Keuangan & Administrasi

| Instalasi | Modul | Status | Halaman |
|---|---|---|---|
| Pendaftaran & Admisi | Pendaftaran Pasien | Inti | [Pendaftaran & Antrian](/modul/pendaftaran-antrian) |
| Pendaftaran & Admisi | Antrian & Layar Panggil | Tersedia | [Pendaftaran & Antrian](/modul/pendaftaran-antrian#antrian-dan-layar-panggil) |
| Kasir & Penjaminan | Kasir & Pembayaran | Inti | [Kasir & Penjamin](/modul/kasir-penjamin) |
| Kasir & Penjaminan | BPJS FKTP (PCare) | Tersedia | [BPJS Kesehatan](/integrasi/bpjs) |
| Kasir & Penjaminan | BPJS FKRTL (VClaim/SEP) | Tersedia | [Pendaftaran & Antrian](/modul/pendaftaran-antrian#sep-rencana-kontrol-dan-spri-vclaim) |
| Akuntansi & Remunerasi | Akuntansi & Remunerasi | Dalam pengembangan | [Manajemen & Mutu](/modul/manajemen#akuntansi-remunerasi) |
| SDM & Kepegawaian | HR / SDM | Tersedia | [Manajemen & Mutu](/modul/manajemen#hr-sdm) |

### Manajemen & Mutu

| Instalasi | Modul | Status | Halaman |
|---|---|---|---|
| Pelaporan | Dashboard | Inti | [Manajemen & Mutu](/modul/manajemen#dashboard) |
| Pelaporan | Laporan | Inti | [Manajemen & Mutu](/modul/manajemen#laporan) |
| Audit Trail | Audit Trail | Inti | [Audit Trail](/arsitektur/audit-trail) |
| Manajemen Mutu | Mutu & Akreditasi | Tersedia | [Manajemen & Mutu](/modul/manajemen#mutu-akreditasi) |

### Program Kesehatan Masyarakat

| Instalasi | Modul | Status | Halaman |
|---|---|---|---|
| Program Puskesmas | Program Puskesmas | Tersedia | [Penunjang Medis](/modul/penunjang-medis#program-puskesmas) |

### Sistem

| Instalasi | Modul | Status | Halaman |
|---|---|---|---|
| Data Master | Data Master | Inti | – |
| Integrasi & Interoperabilitas | SATUSEHAT | Inti | [SATUSEHAT](/integrasi/satusehat) |
| Pelatihan | Kelas Training | Tersedia | [Penunjang Umum](/modul/penunjang-umum#kelas-training) |

## Preset per segmen

Setiap faskes diberi satu **segmen**. Segmen menentukan modul yang aktif bawaan. Faskes yang tidak diubah apa-apa otomatis mengikuti preset segmennya.

| Singkatan | Segmen | Gambaran |
|---|---|---|
| PM | Dokter Praktik Mandiri | 1 dokter, rawat jalan; daftar–periksa–resep–bayar sederhana |
| KP | Klinik Pratama | Pelayanan dasar, apotek & lab sederhana; FKTP BPJS; mutu & akreditasi |
| KU | Klinik Utama | Pelayanan spesialistik, penunjang, rawat inap terbatas; FKRTL BPJS; mutu, SDM & sarpras |
| PKM | Puskesmas | FKTP pemerintah: banyak poli, program, laporan dinkes; mutu & ambulans |
| RS D | Rumah Sakit Kelas D | Pelayanan dasar RS: rawat jalan, IGD, rawat inap, penunjang; mutu, SDM, sarpras & ambulans |
| RS C | Rumah Sakit Kelas C | Kelas D + kamar operasi, gizi, koding rekam medis, hemodialisa, akuntansi |
| RS B | Rumah Sakit Kelas B | Kelas C + ICU, CSSD, bank darah |
| RS A | Rumah Sakit Kelas A | Pelayanan paripurna & rujukan nasional/provinsi, termasuk UTD |

Matriks modul opsional di bawah ini memakai tanda ✓ untuk modul yang aktif bawaan. Tanda – berarti modul tidak aktif bawaan, tetapi superadmin tetap bisa menyalakannya per faskes. Modul inti tidak dicantumkan karena selalu aktif.

| Modul | PM | KP | KU | PKM | RS D | RS C | RS B | RS A |
|---|---|---|---|---|---|---|---|---|
| Antrian & Layar Panggil | – | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Farmasi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Gudang & Pengadaan | – | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Laboratorium | – | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| BPJS FKTP (PCare) | ✓ | ✓ | – | ✓ | – | – | – | – |
| BPJS FKRTL (VClaim/SEP) | – | – | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| Medical Check Up (MCU) | – | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| Mutu & Akreditasi | – | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Radiologi | – | – | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| Fisioterapi / Rehabilitasi Medik | – | – | ✓ | – | – | ✓ | ✓ | ✓ |
| Rawat Inap | – | – | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| Laundry & Linen | – | – | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| HR / SDM | – | – | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| Sarana dan Prasarana (IPSRS) | – | – | ✓ | – | ✓ | ✓ | ✓ | ✓ |
| Program Puskesmas | – | – | – | ✓ | – | – | – | – |
| Manajemen Ambulans | – | – | – | ✓ | ✓ | ✓ | ✓ | ✓ |
| IGD | – | – | – | – | ✓ | ✓ | ✓ | ✓ |
| Kamar Operasi | – | – | – | – | – | ✓ | ✓ | ✓ |
| Gizi | – | – | – | – | – | ✓ | ✓ | ✓ |
| Koding & Rekam Medis | – | – | – | – | – | ✓ | ✓ | ✓ |
| Patologi Anatomi | – | – | – | – | – | ✓ | ✓ | ✓ |
| Unit Hemodialisa | – | – | – | – | – | ✓ | ✓ | ✓ |
| Akuntansi & Remunerasi *(dalam pengembangan)* | – | – | – | – | – | ✓ | ✓ | ✓ |
| ICU / Intensif | – | – | – | – | – | – | ✓ | ✓ |
| CSSD | – | – | – | – | – | – | ✓ | ✓ |
| Bank Darah RS (BDRS) | – | – | – | – | – | – | ✓ | ✓ |
| Mikrobiologi | – | – | – | – | – | – | ✓ | ✓ |
| UTD / UPTD Produksi Darah | – | – | – | – | – | – | – | ✓ |
| Kelas Training | – | – | – | – | – | – | – | – |

::: tip Kelas Training tidak masuk preset mana pun
Modul **Kelas Training** (kelas yoga, pilates, senam hamil, dan sejenisnya) tidak aktif bawaan di segmen apa pun. Superadmin menyalakannya per faskes bila diperlukan.
:::

### Fitur yang dimatikan bawaan

Fitur ikut aktif selama modulnya aktif, kecuali yang dimatikan oleh preset segmen. Beberapa contoh yang perlu diperhatikan implementator:

| Fitur | Dimatikan bawaan di |
|---|---|
| SOAP Ringkas (1 layar) dan Pendaftaran Ringkas | Semua segmen kecuali praktik mandiri |
| Antrean Online BPJS (Mobile JKN) | Semua segmen |
| Pembelian via Marketplace | Semua segmen |
| Rencana Kontrol & SPRI (VClaim) | Klinik utama, RS D/C/B/A |
| Bridging PACS/RIS | Klinik utama, RS D/C/B/A |
| Bridging Bank Darah (UTD) | RS B, RS A |
| Bridging LIS dan Expertise Dokter Lab | Praktik mandiri, klinik pratama (Expertise juga di puskesmas) |
| MCU PCare (BPJS) | Klinik pratama |
| Shift Kasir, Transaksi APS & OTC | Praktik mandiri |
| Diskon & Voucher | Puskesmas |

Daftar lengkap fitur per modul ada di [Manajemen Modul & Fitur](/arsitektur/manajemen-modul).

## Mengaktifkan modul untuk faskes

Hanya akun **superadmin** yang bisa mengubah modul. Admin faskes biasa bisa melihat halamannya, tetapi tidak bisa menyimpan.

1. Login sebagai superadmin. Bila mengelola beberapa faskes, pilih faskes yang akan diatur.
2. Buka **Setting › Manajemen Modul** (rute `/setting/manajemen-modul`).
3. Pilih **segmen** faskes. Modul, fitur, dan bagian bawaan segmen itu tampil dengan label *Bawaan segmen*.
4. Nyalakan atau matikan modul sesuai kebutuhan. Perubahan di luar preset disimpan sebagai *override*.
5. Di dalam setiap modul, atur **fitur** dan **bagian** dengan sakelar yang sama. Item wajib tidak bisa dimatikan. Item yang mensyaratkan modul lain hanya bisa dinyalakan bila modul syaratnya aktif.
6. Klik **Simpan**. Perubahan dicatat di riwayat, dan izin modul yang baru aktif otomatis ditambahkan ke peran admin faskes.
7. Minta pengguna lain **login ulang** agar menunya mengikuti konfigurasi baru.

### Modul aktif belum tentu tampil

Menu yang tampil untuk seorang pengguna dihitung dengan rumus berikut:

```
Menu yang tampil = modul AKTIF di faskes ∩ modul di IZIN pengguna
```

Izin peran selain admin faskes (dokter, perawat, kasir, dan seterusnya) diatur manual di **Datamaster › Role**. Bila menu tidak muncul, periksa berurutan:

1. Apakah modulnya aktif untuk faskes ini? (**Setting › Manajemen Modul**)
2. Apakah peran pengguna punya izin modul itu? (**Datamaster › Role**)
3. Apakah pengguna sudah login ulang?
4. Apakah modulnya berstatus *Segera* (dalam pengembangan)?

::: warning Penegakan di backend belum menyeluruh
Konfigurasi modul dibaca frontend saat login. Penegakan di sisi server baru sebagian. Contohnya, `payment-service` memeriksa fitur Shift Kasir dan `penunjang-service` memeriksa izin per aksi. Penegakan menyeluruh masih menjadi backlog.
:::

## Lihat juga

- [Manajemen Modul & Fitur](/arsitektur/manajemen-modul): konsep lengkap, katalog fitur dan bagian, serta cara menambah modul baru.
- [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin): cara kerja izin modul, submodul, dan aksi.
- [Data Demo](/memulai/data-demo): 8 faskes fiktif, satu untuk setiap segmen.
- [Roadmap](/pendahuluan/roadmap): modul dan fitur yang sedang dikembangkan.
