# Manajemen & Mutu

Halaman ini menjelaskan modul untuk pimpinan, komite mutu, dan bagian SDM: Dashboard dan Dashboard Eksekutif, Laporan, Mutu & Akreditasi, HR/SDM, serta Akuntansi & Remunerasi. Bacalah bila Anda menyiapkan pemantauan kinerja faskes, persiapan akreditasi, atau pengelolaan kepegawaian.

| Modul | Kode katalog | Status | Segmen bawaan | Menu |
|---|---|---|---|---|
| Dashboard | `dashboard` | Inti | Semua | Dashboard |
| Laporan | `laporan` | Inti | Semua | Laporan |
| Mutu & Akreditasi | `mutu` | Tersedia | Klinik pratama, klinik utama, puskesmas, RS D, C, B, A | Mutu & Akreditasi |
| HR / SDM | `sdm` | Tersedia (sebagian fitur dalam pengembangan) | Klinik utama, RS D, C, B, A | HR / SDM |
| Akuntansi & Remunerasi | `akuntansi` | **Dalam pengembangan** | RS C, B, A | – |
| Audit Trail | `audit_trail` | Inti | Semua | Setting › Audit Trail |

## Dashboard

Dashboard tampil otomatis setelah login dan menampilkan ringkasan kegiatan faskes, bawaannya untuk 30 hari terakhir:

- kartu **Total Kunjungan** (rawat jalan, rawat inap, IGD), **Pasien Baru**, **Total Penjualan Obat**, dan **Total Pendapatan**;
- grafik kunjungan per tanggal, status pelayanan rawat jalan, kunjungan per status rawat, kunjungan per jenis kelamin, serta lima poli dan lima DPJP teratas;
- grafik **Pemasukan dan Pengeluaran** (tagihan pasien dan pembelian ke pemasok).

Data hanya milik faskes tempat pengguna masuk. Superadmin bisa berpindah faskes untuk melihat dashboard faskes lain. Dashboard adalah ringkasan cepat; angka resmi diambil dari menu Laporan.

Fitur **Asisten Bantuan (Helpdesk AI)** (`helpdesk_ai`) juga berada di modul ini. Tombol **Bantuan** di header membuka jendela tanya-jawab cara pemakaian OpenSIMRS, bila Gateway helpdesk sudah dikonfigurasi. Lihat [Helpdesk (OpenClaw)](/integrasi/helpdesk).

### Dashboard Eksekutif

Fitur **Dashboard Eksekutif** (`dashboard_eksekutif`) membuka **Dashboard › Eksekutif** dengan indikator agregat lintas modul untuk pimpinan. Indikator dikelompokkan dalam tab:

| Tab | Indikator |
|---|---|
| **Layanan** | Kunjungan rawat jalan, pasien masuk rawat inap, kunjungan IGD, BOR, ALOS, TOI, BTO, GDR, NDR, waktu tunggu rawat jalan |
| **Keuangan** | Pendapatan (tagihan), kas diterima, piutang, SEP BPJS terbit |
| **Mutu** | Kesiapan akreditasi, kredensial staf kedaluwarsa (dari modul Mutu) |
| **SDM** | Pegawai aktif, rasio tenaga kesehatan per tempat tidur |

Fitur pendukungnya:

- filter periode (maksimal 366 hari) dan pembanding periode sebelumnya;
- **target KPI per faskes** dengan warna hijau/kuning/merah dan toleransi;
- grafik sesuai konteks (gauge, tren, batang nilai vs target, batang periode lalu vs kini), keterangan berbahasa awam, dan rumus lengkap di tooltip;
- rincian agregat per poli, dokter, ruang, penjamin, unit, atau bulan;
- **ekspor PDF** ringkasan rapat yang tercatat di audit trail.

Ringkasan, rincian, dan PDF tidak memuat identitas pasien. Pembagi nol (misalnya jumlah tempat tidur belum diisi) ditampilkan sebagai "belum dapat dihitung", bukan nol. Indikator yang sumbernya belum ada, seperti status klaim BPJS, realisasi anggaran, kepuasan pasien, dan kehadiran pegawai, ditampilkan "belum tersedia". Indikator INM dan insiden keselamatan pasien saat ini juga masih ditampilkan "belum tersedia" di Dashboard Eksekutif, meskipun pencatatannya sudah ada di modul Mutu & Akreditasi.

**Izin:** Dashboard › Eksekutif › READ, RINCIAN, EKSPOR PDF, ATUR TARGET. Hanya super admin yang mendapat izin ini secara otomatis.

## Laporan

Menu **Laporan** berisi rekapitulasi lintas layanan dengan saringan periode (bawaan 30 hari terakhir), jenis kunjungan, dan metode bayar, serta ekspor Excel:

| Laporan | Isi |
|---|---|
| Jumlah Kunjungan Berdasarkan Status Rawat | Total kunjungan per jenis kunjungan, metode bayar, dan dokter |
| Rekapitulasi Tindakan | Jumlah tindakan per jenis kunjungan dan metode bayar |
| Rekapitulasi Pemeriksaan Lab | Jumlah pemeriksaan lab |
| Rekapitulasi Pendapatan | Pendapatan lintas layanan |
| Rekapitulasi Diagnosis berdasarkan Umur Pasien | Kode dan diagnosis ICD-10 per kelompok umur dan jenis kelamin |

Laporan khusus modul ada di menu masing-masing, misalnya **Farmasi › Laporan**, **Pembayaran › Laporan**, dan **Inventory › Laporan**. Laporan tambahan yang dirakit di SIMRS Studio dipasang sebagai **Ekstensi** (laporan, template cetak, atau formulir) di menu atas tersendiri.

**Izin:** Laporan › (nama laporan) › READ, CETAK LAPORAN.

## Mutu & Akreditasi

Modul **Mutu & Akreditasi** mendukung manajemen mutu dan persiapan akreditasi faskes. Modul ini punya tiga fitur yang masing-masing bisa diaktifkan terpisah.

### Dokumen akreditasi dan kredensial staf

Fitur **Dokumen Akreditasi & Kredensial Staf** (`mutu_dokumen_kredensial`). Halaman: **Dasbor**, **Instrumen**, **Dokumen**, **Kredensial**, dan **Surveior**.

- **Instrumen akreditasi** milik faskes (bab → standar → elemen penilaian), diisi manual atau impor CSV. OpenSIMRS tidak menyediakan isi instrumen.
- **Dokumen akreditasi** (kebijakan, pedoman, SPO, program, bukti) dengan berkas PDF, status draf → disahkan → kedaluwarsa/dicabut, revisi berversi, pemetaan ke elemen penilaian, catatan tinjauan, dan pengingat tinjau ulang.
- **Kredensial staf** (STR, SIP, sertifikat pelatihan, RKK, SPK) tertaut pegawai atau praktisi di Data Master, dengan berkas, verifikasi, pencabutan beralasan, dan peringatan 90 dan 30 hari sebelum kedaluwarsa.
- **Dasbor kesiapan**: persentase elemen yang sudah terbukti per instrumen, bab, dan standar; dokumen yang perlu ditinjau; kredensial yang mendekati atau melewati masa berlaku.
- **Akses surveior**: akun surveior hanya bisa membaca dokumen disahkan yang dibagikan dan belum lewat batas waktunya.

### Indikator mutu (INM, IMP-RS, IMPU)

Fitur **Indikator Mutu** (`mutu_indikator`). Halaman: **Capaian**, **Master**, **Data**, dan **Tindak Lanjut**.

- **Master indikator**: definisi operasional, numerator/denominator, kriteria, target dan arah (≥/≤), satuan, frekuensi, unit penanggung jawab, dan sumber data. Set 13 INM rumah sakit bawaan dipasang lewat tombol **Pasang INM Bawaan**; definisi dan targetnya wajib disahkan Komite Mutu. IMP-RS dan IMPU dibuat sendiri oleh faskes.
- **Pengumpulan data** per tanggal dan unit dengan alur draf → diajukan → tervalidasi/dikembalikan. Validator tidak boleh orang yang mengisi atau mengajukan data, dan data tervalidasi terkunci.
- **Hitung otomatis** baru tersedia untuk waktu tunggu rawat jalan (per poli) dan hasilnya masuk sebagai draf. Indikator lain diisi manual.
- **Capaian** dihitung dari data tervalidasi, dengan dasbor bulanan/triwulanan, kelengkapan data, tren dan rincian per unit, **tindak lanjut** (analisis dan rencana, misalnya PDSA), serta ekspor Excel.

### Insiden keselamatan pasien dan register risiko

Fitur **Insiden Keselamatan Pasien & Manajemen Risiko** (`mutu_ikp`). Halaman: **Daftar IKP**, **Lapor**, **Dasbor**, **Risiko**, dan **Pengaturan**.

```
Lapor (≤ 2 × 24 jam) ──▶ diterima kepala unit ──▶ grading ──▶ investigasi sederhana / RCA ──▶ rekomendasi & tindak lanjut ──▶ ditutup
```

- **Pelaporan** KTD, KNC, KTC, KPC, dan sentinel oleh semua petugas berizin, dengan opsi **anonim**. Identitas pelapor anonim tidak tampil di mana pun, tetapi pelapor tetap bisa melihat laporannya di **Laporan Saya**. Laporan melewati batas 2 × 24 jam ditandai terlambat.
- **Data pasien minimal**: rujukan pasien hanya tampil sebagai No. RM dan inisial bagi pemegang izin **LIHAT PASIEN**. Laporan IKP terpisah dari rekam medis.
- **Grading** dengan matriks dampak × probabilitas (biru, hijau, kuning, merah), termasuk riwayat grading ulang beralasan.
- **Investigasi**: sederhana untuk biru/hijau, RCA untuk kuning/merah/sentinel, dengan batas waktu per grade.
- **Rekomendasi dan tindak lanjut** dengan PIC, tenggat, progres, dan verifikasi. Laporan hanya bisa ditutup bila syaratnya terpenuhi, dan bisa dibuka kembali dengan alasan.
- **Register risiko unit**: skor dan grade dari matriks faskes, mitigasi, PIC, tenggat, status, dan tautan opsional ke laporan insiden.
- **Dasbor dan tren** per jenis, grade, unit, dan status; ketepatan waktu pelaporan; daftar "Perlu Perhatian"; ekspor Excel rekap internal tanpa identitas pelapor, data pasien, atau kronologi.

Nilai bawaan matriks dan batas waktu mengacu pedoman pelaporan IKP dan perlu disahkan Tim Keselamatan Pasien. Pengingat otomatis dan ekspor format pelaporan nasional **belum tersedia**.

### Izin Mutu & Akreditasi

| Submodul | Aksi |
|---|---|
| Dasbor Kesiapan | READ |
| Instrumen Akreditasi | READ, CREATE, UPDATE, DELETE, IMPORT |
| Dokumen Akreditasi | READ, CREATE, UPDATE, REVISI, UBAH STATUS, TINJAU, PETAKAN ELEMEN, BAGIKAN SURVEIOR, DELETE |
| Kredensial Staf | READ, CREATE, UPDATE, VERIFIKASI, CABUT, DELETE |
| Akses Surveior | READ |
| Indikator Mutu | READ, CREATE, UPDATE, DELETE, INPUT DATA, VALIDASI, TINDAK LANJUT, EKSPOR |
| Insiden Keselamatan Pasien | LAPOR, READ, LIHAT PASIEN, TERIMA, GRADING, INVESTIGASI, TINDAK LANJUT, VERIFIKASI, TUTUP, DASBOR, EKSPOR, PENGATURAN |
| Register Risiko | READ, CREATE, UPDATE, DELETE |

## HR / SDM

Modul **HR / SDM** mengelola kepegawaian yang tertaut ke data pegawai di Data Master. Halaman: **Kepegawaian** dan **Kredensial**.

| Fitur | Kode | Status | Isi |
|---|---|---|---|
| Kepegawaian | `sdm_kepegawaian` | Tersedia (wajib) | Status, unit kerja, jabatan, golongan, pendidikan, riwayat perubahan bertanggal berlaku (riwayat lama tidak ditimpa), dan tautan akun login |
| Kredensial Pegawai | `sdm_kredensial` | Tersedia | STR, SIP, sertifikat pelatihan/kompetensi, RKK, SPK dengan berkas, verifikasi, pencabutan, peringatan 90/30 hari. **Satu sumber data** dengan Kredensial Staf di Mutu & Akreditasi |
| Jadwal Dinas | `sdm_jadwal_dinas` | Dalam pengembangan | Pola shift, jadwal dinas unit, persetujuan, tukar dinas |
| Kehadiran, Cuti & Izin | `sdm_kehadiran` | Dalam pengembangan | Pencatatan kehadiran, pengajuan cuti dan izin berjenjang |
| Pelatihan | `sdm_pelatihan` | Dalam pengembangan | Riwayat pelatihan dan jam diklat |
| Penggajian | `sdm_penggajian` | Dalam pengembangan | Komponen gaji, penggajian per periode, slip gaji, integrasi jasa pelayanan |

**Izin:** HR / SDM › Kepegawaian › READ, CREATE, UPDATE, DELETE, TAUTKAN AKUN; HR / SDM › Kredensial › READ, CREATE, UPDATE, UNGGAH DOKUMEN, VERIFIKASI, CABUT, DELETE.

## Akuntansi & Remunerasi

Modul **Akuntansi & Remunerasi** (`akuntansi`) direncanakan mencakup jurnal, laporan keuangan, dan jasa pelayanan. Modul ini masih **dalam pengembangan**: sudah terdaftar di katalog dan masuk preset RS kelas C, B, dan A, tetapi belum dibangun. Di menu aplikasi, modul ini tampil berlabel **Segera** dan tidak bisa dibuka.

Sampai modul ini tersedia, data keuangan dapat dipantau lewat laporan Pembayaran, Laporan › Rekapitulasi Pendapatan, dan tab Keuangan di Dashboard Eksekutif. Ingin ikut membangunnya? Lihat [Roadmap](/pendahuluan/roadmap) dan [Panduan Kontribusi](/pendahuluan/kontribusi).

## Audit Trail

Modul inti **Audit Trail** selalu aktif. Modul ini mencatat login/logout, akses baca rekam medis, perubahan data, ekspor, dan perubahan izin lintas layanan dengan rantai hash. Akses lihat dan ekspor diberikan lewat izin **Setting › Audit Trail** (LIHAT, EKSPOR). Penjelasan lengkapnya ada di [Audit Trail](/arsitektur/audit-trail).

## Lihat juga

- [Peta Modul](/modul/)
- [Kasir & Penjamin](/modul/kasir-penjamin): laporan kasir dan pendapatan.
- [Audit Trail](/arsitektur/audit-trail)
- [Roadmap](/pendahuluan/roadmap): fitur SDM dan akuntansi yang sedang dikembangkan.
