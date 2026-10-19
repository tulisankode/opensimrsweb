# Rawat Inap

Halaman ini menjelaskan modul **Rawat Inap**: bagaimana kunjungan rawat inap terbentuk dari SPRI, pengelolaan kamar dan bed, rekam medis harian, catatan perawat, instruksi medis, perpindahan bangsal, sampai pasien pulang. Bacalah bila Anda menyiapkan alur bangsal, data ruangan, atau hak akses perawat ruangan dan DPJP.

| Modul | Kode katalog | Status | Menu |
|---|---|---|---|
| Rawat Inap | `rawat_inap` | Tersedia | Rawat Inap › Ruang Rawatan, Perpindahan Bangsal, Laporan |

Modul ini aktif bawaan untuk klinik utama dan RS kelas D, C, B, dan A. Selain menu **Rawat Inap**, modul ini juga membuka **Admisi › Rawat Inap**, **Admisi › Monitoring Kamar**, **Datamaster › Ruangan**, **Datamaster › Kategori Ruangan**, serta laporan admisi **Status Kamar** dan **Keperawatan Inap Pasien**.

## Alur pasien

```
RME poli / IGD ──SPRI──▶ WAITING ──admisi tetapkan bed──▶ DIRAWAT
                                                           │  RME harian (tanggal × sesi),
                                                           │  FPO, order, pindah bed ⇄ TRANSFER
                                                           ▼
                                               Resume & Discharge ──▶ DISCHARGE
                                                 ├─▶ bed dikosongkan
                                                 └─▶ biaya kamar + tindakan ke Kasir
```

Status kunjungan rawat inap:

| Status | Arti |
|---|---|
| **WAITING** | SPRI sudah dibuat, menunggu admisi menetapkan bed |
| **DIRAWAT** | Pasien menempati bed |
| **TRANSFER** | Ada permintaan pindah bed/ruangan yang belum diputuskan |
| **DISCHARGE** | Pasien sudah pulang |
| **DIBATALKAN** | Kunjungan dibatalkan (hanya dari status WAITING) |

## Kunjungan dari SPRI

Kunjungan rawat inap biasa berasal dari **Surat Permohonan Rawat Inap (SPRI)** yang dibuat dokter di RME rawat jalan atau IGD (tab **Cetak Hasil & Surat › Surat Keterangan**). Isian SPRI mencakup tanggal rencana rawat inap, dokter, tujuan ruangan, dan catatan. Begitu SPRI disimpan, pasien otomatis terdaftar di rawat inap dengan status **WAITING**.

Petugas admisi lalu menetapkan kategori ruangan, kelas, ruangan, dan bed di **Admisi › Rawat Inap**. Opsi tambahan yang tersedia: **Pasien Titipan**, **Naik Kelas**, dan **Gabung Tagihan Sebelumnya**. Langkah lengkapnya ada di [Pendaftaran & Antrian](/modul/pendaftaran-antrian#admisi-rawat-inap).

Untuk pasien BPJS di rumah sakit, SEP rawat inap memerlukan nomor SPRI. Bila fitur **Rencana Kontrol & SPRI** VClaim aktif, SPRI juga bisa diterbitkan ke VClaim lewat tombol **SPRI BPJS** di RME.

Bayi yang lahir dari ibu yang sedang dirawat didaftarkan lewat tombol **Bayi Baru Lahir** di **Admisi › Rawat Inap** (fitur `ri_bayi_baru_lahir`).

## Kamar dan bed

| Tempat | Fungsi |
|---|---|
| **Datamaster › Kategori Ruangan** dan **Datamaster › Ruangan** | Daftar ruangan, kelas, dan bed |
| **Datamaster › Tarif** | Tarif ruangan. Tanpa tarif, biaya kamar tidak tertagih saat discharge |
| **Admisi › Monitoring Kamar** | Ketersediaan bed terkini; penambahan dan pengaturan bed |
| **Admisi › Laporan › Status Kamar** | Laporan status kamar |
| **Rawat Inap › Ruang Rawatan** | Daftar pasien per ruangan, dengan saringan dokter, tanggal, cara bayar, dan status |

## Rekam medis harian

RME rawat inap memakai komponen yang sama dengan [Rawat Jalan](/modul/rawat-jalan#rekam-medis-elektronik), dengan susunan **tanggal × sesi**:

- Pilih tanggal rekam medis di kiri atas, atau tekan **+** untuk membuat catatan hari ini.
- Di tab **Asesmen** dan **S.O.A.P**, pilih **Sesi 1**, **Sesi 2**, dan seterusnya, atau tambah sesi baru untuk pemeriksaan ulang di hari yang sama. Sesi baru hanya bisa ditambahkan pada tanggal hari ini.
- Tab **Rekam Medis** menampilkan ringkasan per sesi dan **Non-Sesi**.
- Sesi yang salah bisa dihapus dengan alasan, selama belum memiliki order farmasi.

Tidak ada menu khusus visite. Pemeriksaan harian dokter dicatat sebagai sesi pada tanggal hari itu.

### Catatan perawat dan instruksi medis

Bagian **Catatan Perawat** dan **Instruksi Medis** di tab Asesmen menyimpan catatan keperawatan dan instruksi dokter per sesi. Bagian **Asuhan Keperawatan** tersedia untuk dokumentasi askep. Ketiganya aktif bawaan di klinik utama dan semua kelas RS; preset praktik mandiri mematikan ketiganya, sedangkan preset klinik pratama dan puskesmas mematikan Instruksi Medis.

### Resep, tindakan, alkes, dan penunjang

Caranya sama dengan rawat jalan: **S.O.A.P › Plan › Order Obat** untuk resep (dengan opsi **Obat Pulang**), bagian **Pemeriksaan dan Tindakan** untuk tindakan, tab **Alkes** untuk BMHP, dan tab **Penunjang** untuk order laboratorium, radiologi, dan penunjang lain yang aktif. Permintaan obat dan alkes oleh ruangan juga dilayani lewat **Farmasi Ruangan**. Lihat [Farmasi & Stok](/modul/farmasi-stok#farmasi-ruangan).

### Form Pemberian Obat (FPO)

Fitur **Form Pemberian Obat** (`rme_fpo`) menambah tab **FPO** di RME rawat inap dan IGD. Petugas memilih tanggal, lalu mencatat jam pemberian dan catatan untuk setiap obat. Pemberian ditolak bila stok depo tidak mencukupi.

## Perpindahan bed dan bangsal

Fitur **Perpindahan Bed & Bangsal** (`ri_perpindahan`) menambah tab **Perpindahan** di RME rawat inap:

1. Perawat memilih tipe **Bed** (dalam ruangan yang sama) atau **Ruangan** (kelas, kategori, ruangan tujuan), memilih bed tujuan, mengisi keterangan, lalu **Simpan**. Status pasien menjadi **TRANSFER**.
2. Petugas berwenang membuka **Rawat Inap › Perpindahan Bangsal**, memeriksa asal dan tujuan, lalu memilih **Setuju & Terima** atau **Tolak Permintaan**.
3. Bila disetujui, pasien pindah ke bed tujuan dan kembali **DIRAWAT**. Bila ditolak, pasien tetap di bed asal.

Transfer masuk dan keluar ICU memakai alur perpindahan ini, dilengkapi serah terima terstruktur di modul ICU. Lihat [Penunjang Medis](/modul/penunjang-medis#icu-intensif).

## Pulang

Tab **Resume & Discharge** dipakai seperti di rawat jalan: lengkapi edukasi, keadaan waktu pulang, status pulang (termasuk tanggal discharge dan data rujukan), **Simpan Resume Medis**, lalu **Discharge**. Hasilnya:

- status menjadi **DISCHARGE** dan bed dikosongkan;
- **biaya kamar dihitung otomatis** berdasarkan tarif ruangan dan ditagihkan ke kasir bersama tindakan, obat, dan penunjang;
- untuk pasien BPJS, tombol **Rencana Kontrol BPJS** tersedia saat discharge bila fitur VClaim terkait aktif.

Bila tarif ruangan belum diatur, aplikasi memperingatkan bahwa biaya kamar belum tertagih. Atur tarifnya, lalu tekan **Discharge** lagi.

Kunjungan yang masih **WAITING** bisa dibatalkan dengan **Batal Kunjungan** beserta alasannya. Pasien yang sudah mendapat bed tidak bisa dibatalkan dan harus dipulangkan lewat discharge.

## Laporan

**Rawat Inap › Laporan** menyediakan **Kunjungan Rawat Inap**, **Perpindahan Pasien**, **Pembatalan Dirawat**, dan **Rekap Tindakan Pasien**. Laporan admisi **Status Kamar**, **Keperawatan Inap Pasien**, dan **Bayi Baru Lahir** ada di **Admisi › Laporan**.

## Fitur dan izin

| Kebutuhan | Fitur katalog | Izin (modul › submodul › aksi) |
|---|---|---|
| Melihat pasien per ruangan, membatalkan | – | Rawat Inap › Rawat Inap › READ, BATAL DIRAWAT |
| Menyetujui/menolak perpindahan | `ri_perpindahan` | Rawat Inap › Perpindahan Bangsal › READ, SETUJU DAN TERIMA, BATAL TERIMA |
| Mengajukan pindah dari RME | `ri_perpindahan` | Rawat Inap › Detail Pasien › Perpindahan › PINDAHKAN PASIEN |
| Asesmen, catatan perawat, instruksi medis | `rme_asesmen` | Rawat Inap › Detail Pasien › Asesmen (CREATE CATATAN PERAWAT, CREATE INTRUKSI MEDIS, dan lainnya) |
| Resep | – | Rawat Inap › Detail Pasien › SOAP Dokter |
| Alkes dan penunjang | `rme_alkes`, `rme_penunjang` | Rawat Inap › Detail Pasien › Alkes Dan Penunjang |
| FPO | `rme_fpo` | Rawat Inap › Detail Pasien › FPO |
| Resume & discharge | `rme_resume` | Rawat Inap › Detail Pasien › Resume Dan Dishcarge |
| Laporan | – | Rawat Inap › Laporan › (nama laporan) › READ, CETAK LAPORAN |

## Lihat juga

- [Pendaftaran & Antrian](/modul/pendaftaran-antrian): penetapan kamar dan bed di admisi.
- [IGD](/modul/igd): asal SPRI dari gawat darurat.
- [Penunjang Medis](/modul/penunjang-medis): ICU, Kamar Operasi, Gizi, dan Bank Darah yang terhubung dengan pasien rawat inap.
- [Kasir & Penjamin](/modul/kasir-penjamin): tagihan biaya kamar.
