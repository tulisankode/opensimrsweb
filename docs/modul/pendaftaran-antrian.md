# Pendaftaran & Antrian

Halaman ini menjelaskan modul **Pendaftaran Pasien** (menu **Admisi**) dan **Antrian & Layar Panggil**, termasuk penjaminan BPJS di loket: SEP, Rencana Kontrol, SPRI VClaim, dan Antrean Online BPJS. Bacalah bila Anda menyiapkan alur loket pendaftaran, mengatur hak akses petugas admisi, atau ingin memahami bagaimana pasien masuk ke rawat jalan, IGD, dan rawat inap.

| Modul | Kode katalog | Status | Menu |
|---|---|---|---|
| Pendaftaran Pasien | `pendaftaran` | Inti (selalu aktif) | Admisi |
| Antrian & Layar Panggil | `antrian` | Tersedia | Antrian |
| BPJS FKRTL (VClaim/SEP) | `bpjs_fkrtl` | Tersedia | Admisi › SEP, Admisi › Rencana Kontrol & SPRI |
| BPJS FKTP (PCare) | `bpjs_fktp` | Tersedia | Setting › Konfigurasi Integrasi |

## Alur besar

```
Pasien datang ──▶ Admisi (cari / buat pasien, No. RM)
                    ├─▶ Rawat Jalan  ──▶ antrean poli ──▶ RME dokter
                    ├─▶ IGD          ──▶ RME IGD
                    └─▶ Rawat Inap   ◀── SPRI dari RME (poli / IGD), admisi menetapkan kamar & bed
```

Pasien yang mendaftar sendiri lewat Anjungan Pasien Mandiri (APM) atau aplikasi mobile masuk ke daftar Admisi Rawat Jalan dan tinggal di-check-in petugas.

## Data pasien

Menu **Admisi › Data Pasien** menyimpan identitas pasien dan **No. RM**. No. RM dibuat otomatis saat pasien baru disimpan.

- Pencarian berdasarkan nama, alamat, atau No. RM, dengan saringan status **Aktif**/**Non-Aktif**.
- Detail pasien memuat data lengkap, riwayat pemeriksaan, dan riwayat unggah berkas rekam medis lama (PDF).
- **Import** banyak pasien sekaligus dari Excel, **Download** daftar pasien, **Cetak Kartu Pasien**.
- **Non-Aktifkan**/**Aktifkan** pasien. **Hapus** hanya berlaku untuk pasien yang belum pernah bertransaksi. No. RM yang dihapus tidak dipakai ulang.
- Sistem menolak nomor identitas (NIK/paspor) yang sudah terdaftar, sehingga pasien tidak tercatat ganda.

Contoh data fiktif yang aman dipakai saat uji coba: NIK `9999010101010001`, HP `080000000000`.

### Pendaftaran Ringkas

Fitur **Pendaftaran Ringkas** (`daftar_ringkas`) membuat pendaftaran pasien baru cukup dengan nama, identitas, tanggal lahir, jenis kelamin, HP, dan alamat. Poli, DPJP, dan jadwal tunggal terisi otomatis. Fitur ini aktif bawaan hanya untuk segmen praktik mandiri. Kolom lain (tempat lahir, agama, wilayah, nama ibu, dan seterusnya) tetap bisa diisi lewat tautan **Isi data lengkap**.

### General Consent

Fitur **General Consent** (`daftar_general_consent`) menampilkan jendela persetujuan umum setelah pendaftaran. Persetujuan bisa diberikan oleh pasien atau keluarga, memakai format yang dikelola di **Datamaster › General Consent**, lalu dicetak ulang dari detail kunjungan atau data pasien.

## Admisi rawat jalan

Petugas mendaftarkan kunjungan di **Admisi › Rawat Jalan › Daftar**:

1. Cari pasien lama di **Cari Nama / No. RM**, atau isi data pasien baru.
2. Pilih cara bayar **TUNAI** atau **ASURANSI**.
3. Pilih **Poli**, **DPJP**, lalu **Jadwal**. Hanya jadwal dokter hari ini yang bisa dipilih, dan kuota jadwal diperiksa.
4. Bila perlu, isi **Keluhan Utama**, **Catatan**, atau tandai **Pasien Maternitas**.
5. Untuk **ASURANSI**, isi **Nama Penjamin**, **No. Penjamin**, dan **Kelas**.
6. **Simpan**. Pasien masuk antrean poli.

Dari detail kunjungan, petugas bisa **Cetak Kunjungan**, **Cetak Label**, mengisi General Consent, atau **Edit** data kunjungan. Poli dan dokter tidak bisa diubah setelah tersimpan; bila salah, batalkan kunjungan lalu daftarkan ulang. Pembatalan memerlukan alasan dan ditolak bila pasien sudah diperiksa.

Pasien APM atau mobile tampil dengan label sumbernya (saringan **Cara Daftar**). Petugas membuka baris pasien lalu klik **Simpan & Checkin**.

## Admisi IGD

**Admisi › IGD › Daftar** mendaftarkan pasien gawat darurat (modul **IGD** harus aktif):

- **Tanpa Identitas**: untuk pasien yang belum bisa diidentifikasi. Data dilengkapi kemudian, dan pasien bertanda data tidak lengkap di daftar.
- **Bayi Baru Lahir**: isi **No. KTP Ibu** dan **Jam Lahir**. Ibu harus sudah terdaftar sebagai pasien.
- Pilih **TUNAI**/**ASURANSI**, **DPJP**, dan **Keluhan Utama**.

Pasien yang tersimpan langsung tampil di menu **IGD**. Lihat [IGD](/modul/igd).

## Admisi rawat inap

Rawat inap biasa **tidak** dimulai dari loket. Dokter membuat **Surat Permohonan Rawat Inap (SPRI)** dari rekam medis pasien di poli atau IGD (tab **Cetak Hasil & Surat**). Pasien lalu tampil otomatis di **Admisi › Rawat Inap** dengan status **WAITING** dan nomor SPRI di kolom **Data Kunjungan**.

Petugas admisi kemudian:

1. Membuka baris pasien dan memeriksa identitas serta cara bayar.
2. Memilih **Kategori Ruangan**, **Kelas**, dan **Ruangan**.
3. Memilih bed berstatus **Kosong** pada **Pilih Bed**. Bed **Terisi** tidak bisa dipilih.
4. Mengatur opsi tambahan bila perlu: **Pasien Titipan**, **Naik Kelas**, atau **Gabung Tagihan Sebelumnya**.
5. **Simpan**. Pasien berstatus **DIRAWAT** dan tampil di menu **Rawat Inap**.

Untuk rawat inap, detail kunjungan menyediakan **Cetak Gelang**. Ketersediaan bed dipantau di **Admisi › Monitoring Kamar**.

### Bayi baru lahir dari ibu yang dirawat

Bila fitur **Registrasi Bayi Baru Lahir** (`ri_bayi_baru_lahir`) aktif, toolbar **Admisi › Rawat Inap** menampilkan tombol **Bayi Baru Lahir**. Tombol ini mendaftarkan bayi yang lahir dari ibu yang sedang dirawat. Rekapnya tersedia di **Admisi › Laporan › Bayi Baru Lahir**.

## Penjamin

Setiap kunjungan memakai salah satu cara bayar:

| Cara bayar | Isian | Keterangan |
|---|---|---|
| **TUNAI** (umum) | – | Memerlukan data penjamin "Tunai" di **Datamaster › Penjamin**. Tanpa data itu, pendaftaran ditolak. |
| **ASURANSI** | Nama Penjamin, No. Penjamin, Kelas | Dipakai untuk asuransi swasta, perusahaan, maupun BPJS Kesehatan. Daftar penjamin dikelola di **Datamaster › Penjamin**. |
| **ASURANSI** – BPJS | Penjamin BPJS + nomor kartu 13 digit | Untuk FKTP, kunjungan dikirim ke PCare. Untuk FKRTL, petugas menerbitkan SEP. |

Rincian tagihan per penjamin dan pembayaran dijelaskan di [Kasir & Penjamin](/modul/kasir-penjamin).

## BPJS di loket

### FKTP: sinkron PCare

Untuk faskes tingkat pertama (modul **BPJS FKTP (PCare)**), tidak ada layar SEP. Kunjungan pasien berpenjamin BPJS dikirim otomatis ke PCare dalam dua tahap: **pendaftaran** saat pasien didaftarkan, lalu **kunjungan** setelah dokter menyelesaikan pemeriksaan dan mengisi diagnosis ICD-10. Konfigurasi, pemetaan poli/dokter, cek peserta, dan pemantauan kirim ulang ada di **Setting › Konfigurasi Integrasi**. Rinciannya di [BPJS Kesehatan](/integrasi/bpjs).

### SEP, Rencana Kontrol, dan SPRI (VClaim)

Untuk rumah sakit dan klinik utama (modul **BPJS FKRTL (VClaim/SEP)**):

**SEP** diterbitkan di **Admisi › SEP**, terpisah untuk **Rawat Jalan**, **Rawat Inap**, dan **IGD**:

| Jenis SEP | Yang diperlukan |
|---|---|
| Rawat Jalan | Peserta aktif, rujukan aktif dari FKTP/RS, poli tujuan, DPJP, diagnosis awal ICD-10 |
| IGD | Peserta aktif, DPJP, diagnosis awal. Poli otomatis IGD, tanpa rujukan |
| Rawat Inap | Peserta aktif, **No. SPRI**, spesialis dan DPJP, diagnosis awal |

SEP bisa dikaitkan ke pasien dan kunjungan OpenSIMRS (30 hari terakhir), dicari, dilihat detailnya, dan dihapus selama belum dipakai klaim. Tombol **Buat SEP** nonaktif sampai konfigurasi VClaim di **Setting › Konfigurasi Integrasi** lengkap.

**Rencana Kontrol & SPRI** lewat VClaim tersedia bila fitur **Rencana Kontrol & SPRI** (`vclaim_rencana_kontrol`) dinyalakan. Fitur ini mati bawaan di semua segmen.

- Halaman **Admisi › Rencana Kontrol** dan **Admisi › SPRI** memuat daftar surat dengan saringan status (termasuk jatuh tempo dan sudah dipakai SEP), tombol buat, ubah, hapus, **Cetak**, dan **Cek status di VClaim** untuk surat yang hasil pengirimannya tidak pasti.
- Dari rekam medis, tombol **Rencana Kontrol BPJS** (resume rawat jalan atau discharge rawat inap) dan **SPRI BPJS** (rawat jalan/IGD) membuka formulir yang sama.
- Saat membuat SEP, petugas memilih SPRI atau Rencana Kontrol aktif milik pasien. Satu surat hanya bisa dipakai satu SEP.
- Ubah dan hapus hanya berlaku untuk surat yang belum dipakai SEP.

::: warning Belum terverifikasi ke BPJS
Jalur VClaim untuk Rencana Kontrol dan SPRI belum diverifikasi terhadap katalog resmi VClaim. Di luar mode simulasi, operasi surat ditolak sampai variabel `BPJS_VCLAIM_RENKON_DIKONFIRMASI=true` diaktifkan setelah diuji di sandbox BPJS. Surat yang dibuat dalam mode simulasi diberi tanda air.
:::

## Antrian dan layar panggil

Modul **Antrian & Layar Panggil** mengatur jadwal praktik dokter beserta kuotanya, memanggil pasien, dan menampilkan nomor antrean di layar TV bersuara.

### Jadwal dokter dan kuota

**Antrian › Konfigurasi › Jadwal Dokter** memuat jadwal per poli dan dokter, dengan kode antrean poli dan dokter. Setiap baris hari berisi jam praktik, **Slot JKN**, **Slot Non-JKN** (total kuota dihitung otomatis), durasi per pasien, dan status. Jadwal yang sudah memiliki pasien terdaftar tidak bisa diubah atau dihapus. Jadwal inilah yang dipilih saat pendaftaran rawat jalan.

### Memanggil pasien

| Tempat | Cara memanggil |
|---|---|
| Loket pendaftaran | Ikon megafon di halaman Admisi membuka panel **Panggilan Antrian**: **Panggil**, **Panggil Ulang**, **Lewati**, **Proses**, **Selesaikan Proses**, dengan tab **Antrian Aktif**, **Terlewat**, **Selesai**. |
| Poli | Tombol **Panggil** di daftar pasien poli, atau panel antrean poli lewat ikon megafon di luar halaman Admisi. Lihat [Rawat Jalan](/modul/rawat-jalan). |

Ikon megafon di header hanya tampil bila modul Antrian aktif. **Antrian › Data antrian** menampilkan riwayat antrean per tab **Admisi**, **Rawat Jalan**, dan **Farmasi** (termasuk status **PENYERAHAN OBAT** untuk farmasi).

### Layar antrean TV

**Antrian › Konfigurasi › Layar Antrian** membuat layar dengan beberapa tipe tata letak (mis. 3 × 3 panggilan, list + panggilan, atau list + panggilan + gambar/video), judul, isi layar (**Admisi**, **Poli**, dan/atau **Farmasi**), serta teks berjalan.

Fitur **Layar TV Kiosk** (`antrian_layar_kiosk`) menyediakan link layar tanpa login dari **Antrian › Layar › Link kiosk (TV)**. Link memuat kunci khusus per layar. Bila link bocor, **Buat Ulang Kunci** langsung membatalkan link lama. Di TV, ketuk layar sekali bila muncul tulisan **Ketuk layar untuk mengaktifkan suara**, atau pakai perintah Chrome yang disediakan agar suara aktif otomatis saat TV menyala.

### Anjungan Pasien Mandiri (APM)

Fitur **Anjungan Pasien Mandiri** (`antrian_apm`) menyediakan layar anjungan di **Antrian › APM**. Pasien memilih **Pasien JKN** atau **Pasien Non-JKN** untuk mengambil nomor dan mendaftar ke poli, **Checkin** untuk booking yang sudah ada, atau **Print** untuk mencetak ulang nomor antrean.

### Antrean Online BPJS (Mobile JKN)

Fitur **Antrean Online BPJS** (`antrian_online_bpjs`) menyinkronkan antrean dan *task id* ke BPJS serta menerima pengambilan antrean dari Mobile JKN. Fitur ini mati bawaan di semua segmen dan hanya bisa dinyalakan bila modul BPJS FKRTL atau BPJS FKTP aktif.

- Konfigurasi (mode simulasi/nyata, URL, kredensial terenkripsi) ada di **Setting › Konfigurasi Integrasi**. Pemetaan poli dan dokter memakai pemetaan BPJS yang sudah ada.
- **Antrian › Antrean Online BPJS** menampilkan dasbor booking terkirim/gagal/menunggu, *task id* 1–7 per booking, riwayat pengiriman, dan **Kirim Ulang**.
- Pengambilan antrean untuk pasien baru (belum terdaftar di OpenSIMRS) belum didukung. Pasien diarahkan mendaftar pertama kali di loket atau APM.

::: warning Kontrak belum disahkan
Kontrak resmi web service Antrean BPJS belum terkonfirmasi. Implementasinya perlu disahkan sebelum dipakai di produksi.
:::

## Laporan admisi

**Admisi › Laporan** menyediakan laporan **Kunjungan**, **Penjamin**, **Batal Kunjungan**, **Status Kamar**, **Keperawatan Inap Pasien**, **Bayi Baru Lahir**, dan **Rekap Kunjungan**, dengan saringan tanggal dan **Cetak**. Laporan kamar dan bayi baru lahir hanya tampil bila modul Rawat Inap atau fiturnya aktif.

## Fitur dan izin

| Kebutuhan | Modul/fitur katalog | Izin (modul › submodul › aksi) |
|---|---|---|
| Daftar rawat jalan, cetak, batal | `pendaftaran` | Admisi › Admisi RJ › READ, CREATE PASIEN RJ, UPDATE ADMISI RJ, CETAK KUNJUNGAN, CETAK LABEL, BATAL RJ |
| Daftar IGD | `igd` | Admisi › Admisi IGD › CREATE PASIEN IGD, UPDATE ADMISI IGD, BATAL IGD |
| Tetapkan kamar/bed, bayi baru lahir | `rawat_inap`, `ri_bayi_baru_lahir` | Admisi › Admisi RI › READ, CREATE PASIEN RI, UPDATE ADMISI RI, CREATE BAYI BARU LAHIR |
| Data pasien | `pendaftaran` | Admisi › Data Pasien › READ, CREATE PASIEN, UPDATE DATA PASIEN, IMPORT DATA PASIEN, CETAK KARTU PASIEN, UPLOAD BERKAS RM, DELETE PASIEN |
| General Consent | `daftar_general_consent` | Admisi › Admisi RJ/RI/IGD › CREATE GENERAL CONSENT |
| Monitoring kamar | `rawat_inap` | Admisi › Monitoring Kamar › READ, CREATE BAD, SETTING BAD, DELETE BAD |
| Panggil antrean loket | `antrian` | Admisi › Antrian › PANGGIL, LEWATI, PROSSES, SELESAI, CHECKIN |
| SEP | `bpjs_fkrtl` | Admisi › SEP › READ, CREATE SEP, DELETE |
| Rencana Kontrol & SPRI | `vclaim_rencana_kontrol` | Admisi › Rencana Kontrol & SPRI › READ, CREATE/UPDATE/DELETE RENCANA KONTROL, CREATE/UPDATE/DELETE SPRI, PILIH SURAT SEP |
| Jadwal dokter & layar | `antrian` | Antrian › Konfigurasi › READ, CREATE, UPDATE, DELETE; Antrian › Layar › READ |
| APM | `antrian_apm` | Antrian › Apm › CREATE PASIEN JKN, CREATE PASIEN NON-JKN, CHECKIN, PRINT |
| Antrean Online BPJS | `antrian_online_bpjs` | Antrian › Antrean Online BPJS › READ, KONFIGURASI, KIRIM ULANG |
| Laporan admisi | `pendaftaran` | Admisi › Laporan Admisi › (nama laporan) › READ, CETAK LAPORAN |

## Lihat juga

- [Rawat Jalan](/modul/rawat-jalan): pelayanan pasien setelah didaftarkan.
- [Rawat Inap](/modul/rawat-inap): SPRI, kamar, dan bed.
- [BPJS Kesehatan](/integrasi/bpjs): konfigurasi PCare, VClaim, dan Antrean Online.
- [Peta Modul](/modul/): status dan preset modul per segmen.
