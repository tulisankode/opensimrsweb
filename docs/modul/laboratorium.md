# Laboratorium

Halaman ini menjelaskan tiga modul di bawah Instalasi Laboratorium: **Laboratorium** (patologi klinik), **Patologi Anatomi**, dan **Mikrobiologi**. Isinya meliputi alur order sampai hasil, nilai rujukan, expertise, lab rujukan, dan bridging ke LIS. Bacalah bila Anda menyiapkan laboratorium, data master pemeriksaan, atau integrasi dengan alat dan LIS.

| Modul | Kode katalog | Status | Menu |
|---|---|---|---|
| Laboratorium (Patologi Klinik) | `laboratorium` | Tersedia | Penunjang › Laboratorium |
| Patologi Anatomi | `patologi_anatomi` | Tersedia | Penunjang › Patologi Anatomi |
| Mikrobiologi | `mikrobiologi` | Tersedia | Penunjang › Mikrobiologi |

Laboratorium aktif bawaan di semua segmen kecuali praktik mandiri. Patologi Anatomi aktif bawaan di RS kelas C, B, dan A; Mikrobiologi di RS kelas B dan A.

## Sumber order

Ketiga modul menerima order dari:

- **RME**: tab **Penunjang** di rawat jalan, rawat inap, dan IGD (fitur `rme_penunjang`), dengan **Order Lab**, **Order Patologi Anatomi**, dan **Order Mikrobiologi**. Isian order lab mencakup dokter pengirim, unit asal, penjamin, diagnosis/indikasi, dan catatan untuk lab.
- **APS** (atas permintaan sendiri): pasien datang langsung atau membawa rujukan luar. Pasien harus sudah terdaftar di Admisi.
- **MCU**: pemeriksaan dalam paket MCU otomatis menjadi order penunjang (fitur `mcu_order_penunjang`). Order MCU diberi tanda **MCU**.

## Patologi klinik

### Alur dan status

```
Order ──Validasi Order──▶ Diperiksa ──isi hasil, Simpan Hasil──▶ Selesai
  └──Batal Order (dengan alasan)            ◀──Batal Validasi──┘
```

| Langkah | Keterangan |
|---|---|
| **Order Lab** | Daftar order aktif dan batal, saringan status/tanggal/cara bayar. Order APS dibuat dengan tombol **Order**, termasuk tanda **CITO** dan **Status Puasa**. |
| **Validasi Order** | Pastikan dokter pengirim dan spesimen, ubah pemeriksaan bila perlu (hanya sebelum validasi), lalu **Validasi Saja** atau **Validasi & Kirim ke LIS**. Pemeriksaan lab ditagihkan saat validasi dan dihapus dari tagihan bila dibatalkan. |
| **Hasil Pemeriksaan** | Isi hasil per item; flag, metode, satuan, dan nilai rujukan diambil dari data master. **Simpan Hasil** masih bisa diubah. |
| **Selesai** | Aktif setelah semua item terisi. Setelah **Iya, Selesai**, hasil tidak bisa diubah lagi. |
| **Cetak Hasil** | Hasil berkop logo faskes dengan flag H/L/kritis, legenda, dokter penanggung jawab, dan QR. |

Order yang sudah divalidasi dibatalkan dengan **Batal Validasi** di Hasil Pemeriksaan, sehingga kembali ke Order Lab untuk dikoreksi atau dibatalkan.

### Nilai rujukan

Nilai rujukan diatur per item pemeriksaan di **Datamaster › Item Pemeriksaan**. Nyalakan sakelar **Nilai Rujukan**, lalu isi per jenis kelamin dan rentang umur: **Batas Bawah**, **Batas Atas**, **Kritis Bawah**, **Kritis Atas**, dan teks **Tampilan**. Flag tinggi/rendah/kritis hanya dihitung bila item memakai nilai rujukan yang sesuai jenis kelamin dan umur pasien.

Data master lain disusun berurutan: **Kategori Pemeriksaan** → **Item Pemeriksaan** (jenis input angka, teks, teks panjang, atau pilihan) → **Kelompok Pemeriksaan** (mis. darah lengkap) → **Spesimen** → **Tarif Lab** (per pelayanan dan metode pembayaran, dengan komponen tarif). Semua halaman mendukung impor dan ekspor Excel. Kode **LOINC** dikelola di **Datamaster › LOINC**.

### Expertise dokter lab

Fitur **Expertise Dokter Lab** (`lab_expertise`) membuka **Laboratorium › Expertise** untuk interpretasi hasil oleh dokter spesialis patologi klinik. Expertise hanya bisa disimpan setelah semua item selesai, dan bisa dibatalkan. Fitur ini mati bawaan di praktik mandiri, klinik pratama, dan puskesmas.

### Lab rujukan

Fitur **Lab Rujukan** (`lab_rujukan`) mencatat pemeriksaan yang dirujuk ke laboratorium luar:

- Data laboratorium rujukan dikelola di **Datamaster › Laboratorium Rujukan**.
- Pada order berstatus pemeriksaan, item tertentu ditandai **Dirujuk** (boleh bercampur dengan item internal) dengan status **Belum Dikirim → Terkirim → Hasil Diterima**.
- Hasil dimasukkan lewat alur input hasil biasa, dengan lampiran berkas opsional. Flag tetap dihitung dari nilai rujukan internal faskes.
- Surat pengantar rujukan dan cetak hasil gabungan berlabel rujukan tersedia dari Hasil Pemeriksaan.

### Bridging LIS

Fitur **Bridging LIS (adamLIS)** (`lab_bridging_lis`) mengirim order ke LIS/alat dan menerima hasil otomatis. Fitur ini mati bawaan di praktik mandiri dan klinik pratama.

1. Admin menyiapkan koneksi di **Setting › Konfigurasi Integrasi › Konfigurasi LIS**. Koneksi bisa lebih dari satu.
2. Kode dipetakan di **Laboratorium › Mapping LIS**: **Tindakan (Registrasi)**, **Unit, Dokter & Penjamin**, dan **Hasil Pemeriksaan**.
3. Saat validasi, pilih **Validasi & Kirim ke LIS**. Bila pengiriman gagal, validasi ikut dibatalkan sehingga order tetap berstatus order dan belum ditagih.
4. Hasil masuk otomatis, atau ditarik dengan **Ambil Hasil LIS** di Hasil Pemeriksaan. **No. Lab LIS** menjadi kunci pencocokan hasil.
5. Status pengiriman dipantau di **Setting › Konfigurasi Integrasi › Pengiriman LIS**.

Peserta MCU juga bisa dikirim massal ke LIS. Untuk pengujian tanpa LIS sungguhan, repo menyediakan server tiruan `scripts/lis-tiruan.mjs`. Rincian protokolnya ada di [LIS & PACS](/integrasi/lis-pacs).

### Laporan

**Laboratorium › Laporan** menyediakan **Kunjungan**, **Waktu Tunggu (TAT)**, dan **Rekap Jumlah Pemeriksaan**, dengan saringan jenis pelayanan (rawat jalan, rawat inap, IGD, APS) dan ekspor Excel. Rekap lintas modul tersedia di **Laporan › Rekapitulasi Pemeriksaan Lab**.

## Patologi Anatomi

Modul **Patologi Anatomi** mencatat pemeriksaan histopatologi, sitologi, potong beku (*frozen section*), dan imunohistokimia (IHK).

| Status order | Status kasus |
|---|---|
| Order → Valid → Diproses → Selesai, atau Spesimen Ditolak / Batal | Menunggu Jaringan → Diterima → Diproses → Menunggu Verifikasi → Selesai, atau Ditolak |

Alurnya:

1. **Order PA**: order dari RME, APS, atau rujukan luar. Validasi mengirim tagihan.
2. **Penerimaan Jaringan**: terima jaringan dan beri **Nomor PA** (penomoran terpisah untuk histopatologi, sitologi, potong beku, dan IHK), atau tolak spesimen yang tidak layak.
3. **Pemeriksaan & Diagnosis**: makroskopis, mikroskopis, dan diagnosis dengan kode **ICD-O**, memakai template laporan.
4. **Verifikasi** oleh dokter Sp.PA, lalu cetak laporan resmi. Revisi disimpan sebagai **addendum** berversi tanpa menimpa laporan lama.
5. **Arsip Blok & Slide**: penyimpanan blok parafin dan slide, termasuk peminjaman.

Jaringan dari Kamar Operasi bisa dikirim ke Patologi Anatomi bila kedua modul aktif.

**Bridging LIS Patologi Anatomi** (`pa_bridging_lis`) mengirim kasus ke sistem informasi patologi dan menerima diagnosis, laporan, addendum, serta status kasus. Koneksi diatur di **Setting › Konfigurasi Integrasi › Konfigurasi LIS PA**, pemetaan di **Patologi Anatomi › Mapping LIS PA**, dan pada order tersedia **Validasi Saja** atau **Validasi & Kirim ke LIS PA**. Hasil bisa ditarik dengan **Ambil Hasil LIS PA**.

## Mikrobiologi

Modul **Mikrobiologi** mencatat pewarnaan, kultur, identifikasi kuman, dan uji kepekaan antibiotik.

| Status order | Status pemeriksaan |
|---|---|
| Order → Valid → Diproses → Selesai, atau Batal | Menunggu Spesimen → Spesimen Diterima → Diproses → Laporan Sementara → Final, atau Spesimen Ditolak |

Alurnya:

1. **Order Mikrobiologi**: order dari RME, APS, atau rujukan luar. Validasi mengirim tagihan.
2. **Pemeriksaan & Hasil**: terima atau tolak spesimen, catat pewarnaan dan kultur, lalu isolat dan uji kepekaan antibiotik **S/I/R** (panel otomatis). Satu spesimen boleh memiliki beberapa isolat.
3. **Laporan sementara** dapat diterbitkan sebelum hasil final.
4. **Verifikasi** hasil final oleh dokter Sp.MK, lalu cetak.

Data master mencakup **Pemeriksaan Mikrobiologi**, **Organisme**, dan **Antibiotik** (dengan kode WHONET). **Laporan › Antibiogram** merekap pola kepekaan antibiotik, di samping **Laporan › Kunjungan**.

**Bridging LIS Mikrobiologi** (`mikro_bridging_lis`) mengirim order ke LIS mikrobiologi dan menerima hasil identifikasi serta uji kepekaan. Koneksi diatur di **Setting › Konfigurasi Integrasi › Konfigurasi LIS Mikrobiologi**, pemetaan kode (pemeriksaan, spesimen, organisme, antibiotik, unit, dokter, penjamin) di **Mikrobiologi › Mapping LIS**. Organisme atau antibiotik yang belum dipetakan tetap disimpan sebagai *tidak cocok dengan item*, dan hasil final tetap menunggu verifikasi Sp.MK.

## Fitur dan izin

| Kebutuhan | Fitur katalog | Izin (modul › submodul › aksi) |
|---|---|---|
| Order, validasi, batal order lab | – | Laboratorium › Order Lab › READ, CREATE, VALIDASI ORDER, BATAL ORDER |
| Input hasil, selesai, cetak | – | Laboratorium › Hasil Pemeriksaan › READ, SIMPAN HASIL, SELESAI, CETAK HASIL |
| Lab rujukan | `lab_rujukan` | Laboratorium › Order Lab › TANDAI RUJUKAN, KIRIM RUJUKAN, BATAL RUJUKAN; Hasil Pemeriksaan › UNGGAH BERKAS RUJUKAN |
| Expertise | `lab_expertise` | Laboratorium › Expertise › READ, SIMPAN EXPERTISE, CETAK HASIL |
| Nilai rujukan | – | Laboratorium › Datamaster › Item Pemeriksaan › NILAI RUJUKAN, UPDATE NILAI RUJUKAN |
| Laporan lab | – | Laboratorium › Laporan › Kunjungan, Waktu Tunggu TAT, Rekap Jumlah Pemeriksaan |
| Order PA | `patologi_anatomi` | Patologi Anatomi › Order PA › READ, CREATE, VALIDASI, BATAL, CETAK |
| Penerimaan jaringan | `patologi_anatomi` | Patologi Anatomi › Penerimaan Jaringan › READ, TERIMA, TOLAK |
| Diagnosis dan verifikasi PA | `patologi_anatomi` | Patologi Anatomi › Pemeriksaan › MAKROSKOPIS, MIKROSKOPIS, DIAGNOSIS, VERIFIKASI, CETAK HASIL |
| Arsip PA | `patologi_anatomi` | Patologi Anatomi › Arsip Blok & Slide › READ, UPDATE, PINJAM |
| Order mikrobiologi | `mikrobiologi` | Mikrobiologi › Order Mikrobiologi › READ, CREATE, VALIDASI, BATAL, CETAK |
| Hasil mikrobiologi | `mikrobiologi` | Mikrobiologi › Pemeriksaan › INPUT HASIL, LAPORAN SEMENTARA, VERIFIKASI, CETAK HASIL |
| Bridging LIS mikrobiologi | `mikro_bridging_lis` | Mikrobiologi › Konfigurasi/Mapping LIS Mikrobiologi › LIHAT, KELOLA; Pengiriman LIS Mikrobiologi › LIHAT, KIRIM ULANG, CEK STATUS |

## Lihat juga

- [LIS & PACS](/integrasi/lis-pacs): kontrak bridging dan server tiruan.
- [Rawat Jalan](/modul/rawat-jalan#order-penunjang): order dari RME.
- [Penunjang Medis](/modul/penunjang-medis#medical-check-up-mcu): MCU dan pengiriman massal ke LIS.
- [Radiologi](/modul/radiologi).
