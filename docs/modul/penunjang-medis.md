# Penunjang Medis

Halaman ini merangkum modul penunjang dan pelayanan khusus yang tidak dibahas di halaman tersendiri: ICU, Kamar Operasi, Gizi, Koding Rekam Medis, CSSD, Bank Darah RS, UTD, Fisioterapi, Medical Check Up, Hemodialisa, dan Program Puskesmas. Setiap modul dijelaskan fungsinya, fitur utamanya, segmen yang mengaktifkannya secara bawaan, dan izin terkaitnya. Laboratorium, Patologi Anatomi, Mikrobiologi, dan Radiologi dibahas di [Laboratorium](/modul/laboratorium) dan [Radiologi](/modul/radiologi).

Sebagian besar modul di halaman ini dilayani `penunjang-service`. ICU dilayani `rawat-inap-service`, sedangkan Program Puskesmas dilayani `program-puskesmas-service`.

## Ringkasan

| Modul | Kode katalog | Segmen bawaan | Menu |
|---|---|---|---|
| ICU / Intensif | `icu` | RS B, RS A | ICU |
| Kamar Operasi | `kamar_operasi` | RS C, B, A | Kamar Operasi |
| Gizi | `gizi` | RS C, B, A | Gizi |
| Koding & Rekam Medis | `koding_rm` | RS C, B, A | Koding Rekam Medis |
| CSSD | `cssd` | RS B, RS A | CSSD |
| Bank Darah RS (BDRS) | `bank_darah` | RS B, RS A | Bank Darah RS (BDRS) |
| UTD / UPTD Produksi Darah | `utd` | RS A | UTD |
| Fisioterapi / Rehabilitasi Medik | `fisioterapi` | Klinik utama, RS C, B, A | Fisioterapi |
| Medical Check Up (MCU) | `mcu` | Klinik pratama, klinik utama, RS D, C, B, A | MCU |
| Unit Hemodialisa | `hemodialisa` | RS C, B, A | Hemodialisa |
| Program Puskesmas | `program_puskesmas` | Puskesmas | Program Puskesmas |

Semua modul di atas berstatus **tersedia** dan bisa dinyalakan superadmin untuk segmen lain lewat **Setting › Manajemen Modul**.

## ICU / Intensif

Pemantauan pasien di ruang intensif dengan flowsheet elektronik. Halaman: **Dasbor**, **Perawatan**, dan **Laporan**.

| Fitur | Kode | Isi |
|---|---|---|
| Dasbor ICU | `icu_dashboard` (wajib) | Kartu per bed terisi: diagnosis, hari rawat, status ventilator, peringatan nilai kritis |
| Serah Terima ICU | `icu_serah_terima` (wajib) | Kriteria masuk/keluar dan serah terima terstruktur, tertaut ke perpindahan bangsal rawat inap |
| Flowsheet Observasi | `icu_flowsheet` (wajib) | Observasi per jam/interval: tanda vital, SpO2, GCS, nyeri, parameter ventilator, obat drip, grafik tren. Koreksi tidak menimpa nilai lama |
| Balance Cairan | `icu_balance_cairan` | Intake-output dan balance otomatis per shift dan 24 jam |
| Skor SOFA | `icu_skor_sofa` | Skor saat masuk dan harian; ditandai belum lengkap bila parameter wajib kosong |
| Laporan ICU | `icu_laporan` | BOR, ALOS, angka kematian, hari ventilator |

Transfer masuk dan keluar ICU memakai fitur perpindahan bangsal rawat inap (`ri_perpindahan`). Definisi operasional laporan ICU masih perlu disahkan pemilik klinis sebelum dipakai untuk evaluasi resmi. Integrasi otomatis dengan bedside monitor atau ventilator belum tersedia.

**Izin:** ICU › Dasbor, Perawatan, Serah Terima (KELOLA), Flowsheet Observasi (CREATE, KOREKSI), Balance Cairan, Skor SOFA, Laporan ICU.

## Kamar Operasi

Order dan jadwal operasi sampai laporan operasi dan anestesi. Halaman: **Daftar Tunggu**, **Jadwal**, **Datamaster › Ruang OK**, dan **Laporan › Rekap**.

- **Order operasi**: diagnosis, rencana tindakan ICD-9-CM, jenis elektif/CITO, perkiraan durasi. Daftar tunggu memprioritaskan CITO, dan petugas OK bisa meminta klarifikasi ke dokter pemesan.
- **Jadwal**: penjadwalan ke ruang OK, waktu, dan tim; bentrok ruang atau operator ditolak.
- **Pra-operasi**: asesmen pra-bedah dan pra-anestesi, penandaan lokasi, referensi persetujuan tindakan.
- **Checklist Keselamatan Bedah WHO** (`ok_checklist_keselamatan`, **wajib**): *sign in*, *time out*, dan *sign out* berurutan. Laporan operasi baru bisa difinalkan setelah checklist lengkap.
- **Laporan operasi** (draf/final dengan revisi beraudit) dan **laporan anestesi** (skor Aldrete, serah terima).
- **Pemakaian BHP/obat** depo OK lewat alur order alkes farmasi.
- **Tagihan otomatis** (tindakan, sewa ruang, jasa tim) saat laporan operasi difinalkan. Bila tarif belum dikonfigurasi, tagihan ditandai menunggu tarif.
- Jaringan operasi bisa dikirim ke Patologi Anatomi bila modul itu aktif.

Fitur **Order Operasi dari RME** (`rme_order_operasi`) tercatat tersedia di katalog, tetapi tab order operasi di RME belum ada. Untuk sementara, order dibuat dari menu Kamar Operasi (**Buat Order**) dengan No. Reg kunjungan rawat jalan, rawat inap, atau IGD.

**Izin:** Kamar Operasi › Order Operasi (CREATE, KLARIFIKASI, BATAL), Jadwal OK (VALIDASI), Pra-Operasi, Checklist Keselamatan, Laporan Operasi (FINALISASI), Laporan Anestesi, Pemakaian BHP, Datamaster › Ruang OK, Laporan Rekap.

## Gizi

Pelayanan gizi untuk pasien rawat inap. Halaman: **Skrining**, **Asuhan**, **Order Diet**, **Distribusi**, **Master** (Diet, Bentuk Makanan, Standar Porsi), dan **Laporan**.

- **Skrining gizi** MST/NRS-2002 dengan skor dihitung server, serta daftar kerja ahli gizi untuk pasien berisiko.
- **Asuhan gizi (PAGT)**: asesmen, diagnosis gizi, intervensi, monitoring-evaluasi.
- **Order diet** DPJP: jenis diet, bentuk makanan, kalori, rute, pantangan. Alergi dari RME tampil di form; data kosong ditampilkan sebagai belum tercatat, bukan "tidak ada alergi".
- **Distribusi makan** dan rekap porsi per ruangan dan waktu makan, selalu mengikuti lokasi dan status pulang terkini pasien rawat inap.
- **Laporan** jumlah pasien per diet dan cakupan skrining.

**Izin:** Gizi › Skrining, Asesmen Gizi, Order Diet (BATAL), Distribusi (CETAK), Datamaster, Laporan Gizi.

## Koding Rekam Medis

Verifikasi diagnosis dan tindakan oleh koder sebelum kunjungan rawat jalan, rawat inap, atau IGD yang sudah pulang dinyatakan siap klaim. Halaman: **Worklist**, **Checklist & Rekap DPJP**, **Peminjaman Berkas**, **Retensi & Pemusnahan**, dan **Laporan**.

- **Worklist**: kunjungan selesai yang belum/sudah dikoding, disaring per jenis kunjungan, penjamin, ruangan, dan tanggal pulang.
- **Koding kunjungan**: diagnosis utama dan sekunder (ICD-10) serta tindakan (ICD-9-CM), disimpan sebagai riwayat berversi. Diagnosis dokter tetap tampil sebagai pembanding, dan alasan wajib diisi bila kode koder berbeda.
- **Klarifikasi ke DPJP** dengan penanda "menghalangi".
- **Checklist kelengkapan rekam medis** per kunjungan dan rekap per DPJP.
- **Finalisasi siap klaim** hanya bila diagnosis utama terisi, checklist wajib lengkap, dan tidak ada klarifikasi menghalangi yang terbuka.
- **Peminjaman dan retensi berkas fisik**: pinjam-kembali per No. RM, pengingat keterlambatan, masa retensi, usulan pemusnahan.
- **Laporan**: indeks diagnosis/tindakan, 10 besar penyakit, data RL, produktivitas koder, dan target waktu koding rawat inap (≤ 2 × 24 jam).

**Izin:** Koding Rekam Medis › Worklist, Koding, Klarifikasi, Checklist, Peminjaman, Retensi, Laporan Koding.

## CSSD

Sterilisasi alat dan pelacakan set instrumen. Halaman: **Dashboard**, **Penerimaan**, **Pemrosesan**, **Load**, **Distribusi**, **Recall**, **Datamaster** (Master Set, Mesin), dan **Laporan**.

- **Master set** instrumen (komposisi, metode, masa berlaku steril, label barcode/QR) dan **master mesin** dengan uji **Bowie-Dick** harian.
- **Penerimaan dan dekontaminasi** alat kotor dari unit, pemeriksaan kelengkapan, pengemasan dengan input barcode.
- **Load sterilisasi**: satu hasil indikator kimia/biologi gagal otomatis menjadikan seluruh set dalam load itu tidak layak; hasil lulus menetapkan status steril beserta tanggal kedaluwarsa.
- **Penyimpanan, distribusi, dan pemakaian pada pasien**. Set yang tidak layak atau kedaluwarsa ditolak.
- **Recall**: daftar set terdampak dari load gagal, lokasi terakhir, dan pasien yang memakainya.
- **Laporan** volume sterilisasi, kegagalan indikator, dan set hilang/rusak.

**Izin:** CSSD › Master Set & Mesin, Penerimaan & Dekontaminasi, Siklus Sterilisasi (INPUT HASIL, BOWIE DICK), Penyimpanan & Distribusi, Pemakaian Pasien, Recall, Laporan CSSD.

## Bank Darah RS (BDRS)

Pelayanan darah untuk transfusi di rumah sakit. Halaman: **Permintaan**, **Crossmatch**, **Stok**, **Serah Terima**, **Transfusi**, **Datamaster › Komponen**, **Pengaturan**, **Laporan**, dan **Mapping UTD**.

| Fitur | Kode | Isi |
|---|---|---|
| Permintaan Darah | `bdrs_permintaan` | Permintaan dari rawat jalan, rawat inap, IGD, atau OK pada kunjungan aktif: golongan, komponen, jumlah kantong, indikasi, cito/biasa |
| Uji Silang Serasi | `bdrs_crossmatch` | Golongan ABO/Rhesus dan skrining antibodi per permintaan, crossmatch mayor/minor per kantong. Kantong inkompatibel atau kedaluwarsa tidak bisa diserahkan |
| Stok & Serah Terima Darah | `bdrs_stok` | Penerimaan kantong dari UTD, stok per golongan/komponen dengan peringatan kedaluwarsa, pengembalian/pemusnahan, serah terima dengan konfirmasi dua akun berbeda, pemantauan transfusi dan laporan reaksi (hemovigilans) |
| Bridging Bank Darah (UTD) | `bdrs_bridging` | Kirim permintaan ke UTD mitra dan terima status, data kantong, serta hasil IMLTD. Mati bawaan |

Biaya pengolahan darah dan crossmatch masuk ke tagihan kunjungan. Laporan BDRS mencakup pemakaian darah, rasio crossmatch-transfusi (C/T), stok keluar, dan rekap reaksi. Kantong dari bridging UTD tetap harus diterima manual oleh petugas berizin; tidak ada penerimaan otomatis.

**Izin:** Bank Darah RS (BDRS) › Permintaan Darah, Uji Silang Serasi (OVERRIDE DARURAT), Stok & Penerimaan (TERIMA KANTONG, MUSNAHKAN, KEMBALIKAN), Serah Terima (KONFIRMASI PENYERAH, KONFIRMASI PENERIMA), Pemantauan Transfusi (LAPOR REAKSI), Pengaturan, Datamaster, Laporan BDRS.

## UTD / UPTD Produksi Darah

Unit Transfusi Darah untuk RS provinsi atau UPTD Dinkes, dari donor sampai distribusi. Halaman: **Donor**, **Aftap**, **IMLTD**, **Komponen**, **Distribusi**, **Pengaturan**, dan **Laporan**.

| Fitur | Kode | Isi |
|---|---|---|
| Rekrutmen & Seleksi Donor | `utd_donor` | Pendaftaran donor, kuesioner, Hb/tekanan darah, riwayat dan kartu donor. Interval minimal antar-donor dihitung sistem |
| Pengambilan Darah (Aftap) | `utd_aftap` | Nomor kantong unik, reaksi donor, donor mobile/kegiatan. Kantong baru berstatus karantina |
| Uji Saring IMLTD | `utd_imltd` | HIV, HBsAg, HCV, sifilis, dan konfirmasi. Hasil reaktif mengarantina kantong dan seluruh komponen turunannya |
| Pengolahan Komponen | `utd_komponen` | Pemisahan menjadi PRC, TC, FFP, cryo; pelabelan dan karantina |
| Penyimpanan & Distribusi | `utd_distribusi` | Stok per golongan/komponen, distribusi ke BDRS/RS lain, pemusnahan |
| Pelaporan UTD | `utd_pelaporan` | Laporan produksi, donor, dan distribusi untuk Dinkes/Kemenkes |

Hasil IMLTD reaktif dan identitas donor terkait hanya bisa dilihat pemegang izin khusus **UTD › Lihat Hasil Reaktif**.

**Izin:** UTD › Donor (SELEKSI, CETAK KARTU), Aftap, IMLTD (INPUT HASIL, PELEPASAN), Lihat Hasil Reaktif, Komponen, Distribusi (Permintaan, Distribusi, Pemusnahan), Laporan UTD.

## Fisioterapi / Rehabilitasi Medik

Program terapi dari order sampai evaluasi tiap sesi. Halaman: **Order Fisioterapi**, **Penjadwalan Terapi**, **Evaluasi Terapi**, **Booking Terapi**, **Datamaster** (Bed Ruangan, Tindakan, Paket), dan **Laporan**.

- Order datang dari RME (**Order Fisio** di tab Penunjang), APS, atau booking.
- Status order: **Order Baru** → **Tervalidasi** → **Terjadwal** → **Selesai**, atau **Batal**. Validasi dokter membentuk tagihan.
- Sesi dijadwalkan ke bed dan jam terapi. Status sesi: Booking, Terjadwal, Hadir, Selesai, atau Batal.
- Setiap sesi dievaluasi dengan format SOAP, termasuk fase rehabilitasi dan persetujuan tindakan.
- Laporan: kunjungan, rekap kunjungan per jenis fisioterapi, rekap terapi, dan rekap pendapatan fisioterapi.

**Izin:** Fisioterapi › Order Fisioterapi (CREATE ORDER, VALIDASI DOKTER, BATAL ORDER), Penjadwalan Terapi (SIMPAN DAN MULAI TERAPI), Evaluasi Terapi (EVALUASI), Booking Terapi, Datamaster, Laporan Fisio, RME.

## Medical Check Up (MCU)

Pemeriksaan kesehatan perorangan dan rombongan perusahaan. Halaman: **Peserta**, **Pemeriksaan** (stasiun), **Datamaster** (Paket MCU, Perusahaan), **Tagihan Korporasi**, **Laporan**, dan **Rekap HRD**.

| Fitur | Kode | Isi |
|---|---|---|
| Paket MCU | `mcu_paket` | Gabungan tindakan, laboratorium, radiologi, dan EKG dengan satu harga, untuk perorangan dan/atau korporasi |
| Pendaftaran Perorangan & Korporasi | `mcu_pendaftaran` | Peserta satu per satu atau rombongan, termasuk impor Excel dari HRD (pasien baru otomatis didaftarkan) |
| Alur Stasiun Pemeriksaan | `mcu_stasiun` | Anamnesis, fisik, visus, gigi, lab, radiologi, EKG, dan lainnya per stasiun dengan progres tiap peserta |
| Order Penunjang Otomatis | `mcu_order_penunjang` | Pemeriksaan lab/radiologi dalam paket langsung menjadi order penunjang |
| Kesimpulan & Sertifikat | `mcu_kesimpulan` | Kesimpulan dokter **Fit**, **Fit dengan Catatan**, atau **Unfit**, saran, laporan, dan sertifikat |
| Rekap & Tagihan Korporasi | `mcu_korporasi` | Invoice per perusahaan, pencatatan pembayaran, rekap hasil peserta |
| MCU PCare (BPJS) | `mcu_pcare` | Pelaporan hasil MCU peserta JKN ke PCare. Mensyaratkan modul BPJS FKTP; mati bawaan |

**MCU PCare** mengirim, memperbarui, atau menghapus laporan MCU peserta berpenjamin BPJS yang sudah berkesimpulan final. Nilai hanya diambil dari stasiun tanda vital dan hasil laboratorium yang tersimpan; pemeriksaan yang tidak dilakukan dikirim kosong. Pemetaan field ke spesifikasi PCare masih draf, sehingga pengiriman di luar mode simulasi ditolak sampai `BPJS_MCU_PCARE_DIKONFIRMASI=true` diaktifkan setelah kontraknya dipastikan.

**Izin:** MCU › Peserta (IMPOR, KIRIM LIS, KESIMPULAN, CETAK), Pemeriksaan (INPUT HASIL), Datamaster (Paket MCU, Perusahaan), Tagihan Korporasi (PEMBAYARAN), Laporan MCU, MCU PCare (KIRIM, UBAH, HAPUS).

## Unit Hemodialisa

Pelayanan hemodialisa akut dan kronis. Halaman: **Jadwal**, **Registrasi**, **Resep**, **Sesi**, **Dializer**, **Datamaster** (Mesin & Shift, Aturan Reuse, Mapping HDIS), dan **Laporan**.

- **Registrasi** HD akut/kronis dan **jadwal** per mesin × shift (sekali atau rutin); bentrok mesin atau pasien ditolak.
- **Resep HD**: draf, lalu disahkan dokter.
- **Sesi HD**: asesmen pra-HD, lembar intradialitik (manual atau dari HDIS, koreksi beraudit), catatan pasca-HD.
- **Kt/V dan URR** dengan formula bawaan, ditandai perlu disahkan tenaga klinis.
- **Dializer** per pasien dengan batas *reuse* sesuai kebijakan faskes, dan **pemakaian BHP** lewat order alkes farmasi.
- **Tagihan tindakan** per sesi ke Pembayaran, tanpa duplikasi bila diulang.
- **Laporan**: tindakan, utilisasi mesin, komplikasi, adekuasi.

Fitur **Bridging HDIS** (`hd_bridging_hdis`) mengirim jadwal dan data pasien minimum ke HDIS serta menerima parameter mesin per sesi. Koneksi diatur di **Setting › Konfigurasi Integrasi**, pemetaan mesin di **Hemodialisa › Datamaster › Mapping HDIS**. Lihat [HDIS (Hemodialisa)](/integrasi/hdis).

**Izin:** Hemodialisa › Registrasi & Jadwal, Resep HD (SAHKAN), Sesi HD (ASESMEN, MULAI, OBSERVASI, TUTUP, KOREKSI, BATAL), Pemakaian BHP, Datamaster, Laporan Hemodialisa.

## Program Puskesmas

Program kesehatan masyarakat untuk puskesmas. Halaman: **KIA**, **KB**, **Imunisasi**, **MTBS**, **Sasaran**, **UKM**, **Laporan**, dan **Datamaster** (Jenis Vaksin, Format Laporan).

- **KIA**: pelayanan ANC (K1–K6, usia kehamilan, penanda risiko tinggi) tertaut ke kunjungan rawat jalan kebidanan, persalinan, dan nifas. Kohort ibu diturunkan otomatis dari pelayanan tersimpan.
- **KB**: metode, tanggal pelayanan, rencana kunjungan ulang, efek samping; kohort menandai kunjungan ulang yang terlewat.
- **Imunisasi**: datamaster jenis vaksin dan jadwal (urutan dosis, interval), pencatatan pemberian dengan peringatan dosis berulang, status imunisasi dasar lengkap, dan jadwal berikutnya.
- **MTBS/MTBM**: pencatatan temuan dan klasifikasi per kunjungan balita sakit atau bayi muda.
- **Sasaran Program**: sasaran ibu hamil/bayi/balita per kelurahan dan periode, dengan cakupan pelayanan.
- **Kegiatan UKM**: posyandu, penyuluhan, dan kesehatan lingkungan.
- **Laporan Dinkes**: LB1 bulanan dari diagnosis rekam medis per ICD-10, kelompok umur, dan jenis kelamin; laporan KIA, imunisasi, dan program; ekspor Excel.

Fitur **Kirim Imunisasi ke SATUSEHAT** (`program_puskesmas_satusehat`, mensyaratkan modul SATUSEHAT) mengirim data imunisasi setiap kali pelayanan tersimpan, dengan status kirim dan kirim ulang manual.

**Izin:** Program Puskesmas › KIA, KB, Imunisasi (KIRIM SATUSEHAT), MTBS/MTBM, Sasaran Program, Kegiatan UKM, Datamaster, Laporan Dinkes (EKSPOR EXCEL).

## Lihat juga

- [Peta Modul](/modul/): status dan preset semua modul.
- [Laboratorium](/modul/laboratorium) dan [Radiologi](/modul/radiologi).
- [Penunjang Umum](/modul/penunjang-umum): laundry, sarpras, ambulans, dan kelas training.
- [Manajemen Modul & Fitur](/arsitektur/manajemen-modul).
