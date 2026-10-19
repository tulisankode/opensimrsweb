# IGD

Halaman ini menjelaskan modul **IGD** (Instalasi Gawat Darurat): pendaftaran pasien gawat darurat, triase, rekam medis, pemberian obat, dan kelanjutan ke rawat inap lewat SPRI. Bacalah bila Anda menyiapkan alur IGD atau hak akses dokter dan perawat jaga.

| Modul | Kode katalog | Status | Menu |
|---|---|---|---|
| IGD | `igd` | Tersedia | IGD › Pasien IGD, Laporan; Admisi › IGD |

Modul ini aktif bawaan untuk RS kelas D, C, B, dan A. Syaratnya, data master harus memiliki lokasi bertipe IGD (**Datamaster › Lokasi**).

## Alur pasien

```
Admisi › IGD (daftar, boleh tanpa identitas) ──▶ DIRAWAT di IGD
     │   triase, asesmen, SOAP, tindakan, resep, FPO, order penunjang
     ├─▶ SPRI ──▶ Rawat Inap (WAITING ──▶ admisi tetapkan bed)
     └─▶ Resume & Discharge ──▶ DISCHARGE ──▶ tagihan ke Kasir
```

## Pendaftaran

Pasien IGD didaftarkan di **Admisi › IGD**, bukan di menu IGD. Selain pasien lama dan baru, formulir ini mendukung:

- **Tanpa Identitas** untuk pasien yang belum bisa diidentifikasi. Datanya dilengkapi kemudian, dan di menu IGD pasien ini bisa disaring dengan **Data Pasien › DATA TIDAK LENGKAP**.
- **Bayi Baru Lahir** dengan nomor KTP ibu dan jam lahir. Ibu harus sudah terdaftar sebagai pasien.

Untuk pasien BPJS di rumah sakit, SEP IGD dibuat di **Admisi › SEP › IGD** tanpa rujukan. Lihat [Pendaftaran & Antrian](/modul/pendaftaran-antrian#sep-rencana-kontrol-dan-spri-vclaim).

## Daftar pasien IGD

**IGD › Pasien IGD** menampilkan No. RM, No. Registrasi, dokter, tanggal daftar dan pulang, serta status **DIRAWAT**, **DISCHARGE**, atau **DIBATALKAN** beserta status bayar. Saringan tersedia untuk nama/alamat/No. RM, dokter, tanggal, kelengkapan data pasien, dan cara bayar.

## Triase dan asesmen

RME IGD memakai susunan **tanggal × sesi** seperti rawat inap. Bagian **Triase** di tab **Asesmen** hanya tersedia bila modul IGD aktif (bagian katalog `asm_triase`). Isiannya mencakup cara datang, kendaraan, asal rujukan, kasus, keadaan umum, tanda vital, skor GCS, dan kesimpulan triase.

Bagian asesmen lain yang biasa dipakai di IGD: Alergi, Anamnesis, Tanda Vital, Pemeriksaan Fisik, **Derajat Luka Bakar (RON)**, Diagnosis Dokter, Catatan Perawat, dan Instruksi Medis.

## Tindakan, resep, dan penunjang

Caranya sama dengan [Rawat Jalan](/modul/rawat-jalan#rekam-medis-elektronik):

- tab **S.O.A.P** untuk catatan dokter dan **Plan › Order Obat** untuk resep;
- bagian **Pemeriksaan dan Tindakan** untuk tindakan, yang ditagihkan saat pasien dipulangkan;
- tab **Penunjang** untuk order laboratorium dan penunjang lain yang aktif;
- tab **Alkes** untuk permintaan alkes/BMHP.

Bila fitur **Form Pemberian Obat** (`rme_fpo`) aktif, tab **FPO** mencatat jam pemberian obat per tanggal. Tanggal setelah hari ini tidak bisa dipilih.

## Lanjut ke rawat inap

Bila pasien perlu dirawat:

1. Buka **Cetak Hasil & Surat › Surat Keterangan › Buat Surat**, pilih **Surat Permohonan Rawat Inap (SPRI)**.
2. Isi tanggal rencana rawat inap, dokter, tujuan ruangan, dan catatan, lalu **Simpan**.
3. Pasien otomatis terdaftar di rawat inap dengan status **WAITING**. Petugas admisi menetapkan bed di **Admisi › Rawat Inap**.

Untuk pasien BPJS, bila fitur **Rencana Kontrol & SPRI** VClaim aktif, tombol **SPRI BPJS** di RME menerbitkan SPRI ke VClaim. Nomor SPRI diperlukan untuk SEP rawat inap. Kelanjutannya dijelaskan di [Rawat Inap](/modul/rawat-inap).

## Pulang dan pembatalan

Tab **Resume & Discharge** dipakai seperti di rawat jalan. Discharge mengubah status menjadi **DISCHARGE** dan meneruskan tagihan ke kasir. Kunjungan bisa dibatalkan dengan **Batal Kunjungan** beserta alasannya, selama pasien belum dipulangkan.

## Laporan

**IGD › Laporan** menyediakan **Kunjungan IGD**, **Pembatalan Dirawat**, dan **Rekap Tindakan Pasien**.

::: info Halaman monitoring BPJS
Menu **IGD › BPJS › Monitoring** (kunjungan, riwayat kunjungan, obat kunjungan) masih dalam pengembangan dan belum menampilkan data sungguhan.
:::

## Fitur dan izin

| Kebutuhan | Izin (modul › submodul › aksi) |
|---|---|
| Mendaftarkan pasien IGD | Admisi › Admisi IGD › CREATE PASIEN IGD, UPDATE ADMISI IGD, BATAL IGD |
| Melihat daftar pasien, membatalkan | IGD › IGD › READ, BATAL IGD |
| Triase dan asesmen | IGD › Detail Pasien › Asesmen (termasuk CREATE TRIASE) |
| SOAP dan resep | IGD › Detail Pasien › SOAP Dokter |
| Alkes dan penunjang | IGD › Detail Pasien › Alkes Dan Penunjang |
| FPO | IGD › Detail Pasien › FPO |
| Resume & discharge | IGD › Detail Pasien › Resume Dan Dishcarge |
| Surat, termasuk SPRI | IGD › Detail Pasien › Cetak Hasil Dan Surat |
| Laporan | IGD › Laporan IGD › (nama laporan) › READ, CETAK LAPORAN |

## Lihat juga

- [Pendaftaran & Antrian](/modul/pendaftaran-antrian#admisi-igd): formulir pendaftaran IGD.
- [Rawat Inap](/modul/rawat-inap): kelanjutan pasien setelah SPRI.
- [Penunjang Medis](/modul/penunjang-medis): Kamar Operasi dan Bank Darah yang sering terkait dengan IGD.
- [Penunjang Umum](/modul/penunjang-umum#manajemen-ambulans): permintaan ambulans dari IGD.
