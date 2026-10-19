# Rawat Jalan

Halaman ini menjelaskan modul **RME Rawat Jalan**: alur pasien di poli dari antrean sampai pulang, isi rekam medis elektronik (RME), dan hal-hal yang terpicu saat kunjungan ditutup. Bacalah bila Anda menyiapkan alur poli, mengatur tab RME per segmen, atau memberi hak akses dokter dan perawat.

| Modul | Kode katalog | Status | Menu |
|---|---|---|---|
| RME Rawat Jalan | `rawat_jalan` | Inti (selalu aktif) | Rawat Jalan › Poli |

RME yang sama juga dipakai di [Rawat Inap](/modul/rawat-inap) dan [IGD](/modul/igd), dengan beberapa tab tambahan. Isi klinis RME disimpan di MongoDB, sedangkan data kunjungan dan tagihan di PostgreSQL.

## Alur poli

```
Admisi (daftar) ──▶ ANTRI ──Panggil──▶ DIPERIKSA (RME dibuka)
                                          │  asesmen / SOAP, diagnosis, tindakan,
                                          │  resep, order penunjang, surat
                                          ▼
                                     Resume & Discharge ──▶ DISCHARGE
                                          ├─▶ tagihan diteruskan ke Kasir
                                          └─▶ resep masuk antrean Farmasi
```

Status kunjungan di daftar poli: **ANTRI**, **DIPERIKSA**, **DISCHARGE**, atau **DIBATALKAN**, disertai status bayar (**Lunas**, **Belum Lunas**, **Belum Ada Tagihan**).

## Antrean poli

1. Buka **Rawat Jalan › Poli**, pilih **Semua Poli** atau poli tertentu di panel kiri.
2. Saring dengan **Cari Pasien**, **Dokter**, rentang tanggal, dan **TUNAI**/**ASURANSI**. Dokter yang login otomatis hanya melihat pasiennya sendiri.
3. Bila modul **Antrian** aktif, tekan **Panggil** atau **Panggil Ulang** pada pasien berstatus **ANTRI**. Nomor pasien tampil dan diumumkan di layar antrean. Panel antrean poli (ikon megafon) menyediakan **Panggil Berikutnya** serta tab **Antrian Aktif**, **Terlewat**, dan **Selesai**.
4. Klik baris pasien untuk membuka RME. Bila pasien belum dipanggil, aplikasi menawarkan **Panggil Sekarang** atau **Buka Tanpa Memanggil**.

Tanpa modul Antrian, misalnya di praktik mandiri, RME langsung bisa dibuka. Kunjungan yang belum diperiksa dapat dibatalkan dengan **Batal Kunjungan** beserta alasannya.

## Rekam medis elektronik

Jendela RME menampilkan identitas pasien, **Cetak Label**, **Riwayat** kunjungan sebelumnya (mode baca), dan deretan tab. Tab yang tampil bergantung pada fitur yang aktif di faskes:

| Tab | Fitur katalog | Isi |
|---|---|---|
| **Rekam Medis** | – | Ringkasan semua isian kunjungan ini |
| **Asesmen** | `rme_asesmen` | Form terstruktur per bagian (lihat di bawah) |
| **S.O.A.P** | – | Form dikelompokkan menurut Subjective, Objective, Assesment, Plan |
| **SOAP Ringkas** | `rme_soap_ringkas` | Satu layar S-O-A-P + tanda vital + resep + selesai. Bila aktif, tab S.O.A.P disembunyikan |
| **Penunjang** | `rme_penunjang` | Order laboratorium, radiologi, fisioterapi, patologi anatomi, mikrobiologi (sesuai modul aktif) |
| **Alkes** | `rme_alkes` | Permintaan alat kesehatan dan BMHP ke farmasi |
| **Inform Consent** | `rme_inform_consent` | Persetujuan tindakan kedokteran |
| **Unggah Berkas** | `rme_unggah_berkas` | Lampiran foto atau dokumen, mis. hasil luar atau foto luka |
| **Resume & Discharge** | `rme_resume` (wajib) | Resume medis dan penutupan kunjungan |
| **Cetak Hasil & Surat** | `rme_cetak_surat` | Cetak hasil penunjang dan surat keterangan |

### Asesmen dan SOAP

Tab **Asesmen** terdiri atas bagian yang bisa diatur per segmen dan per jenis poli. Bagian bertanda wajib tidak bisa dimatikan.

| Bagian | Wajib | Catatan |
|---|---|---|
| Alergi, Anamnesis, Tanda Vital, Pemeriksaan Fisik | Ya | |
| Diagnosis Dokter (ICD-10) | Ya | |
| Pemeriksaan dan Tindakan | Ya | |
| Antropometri (BB/TB), Asesmen Nyeri, Kesadaran (GCS) | Tidak | |
| Pemeriksaan Gigi (odontogram) | Tidak | Hanya poli gigi |
| Pemeriksaan Mata | Tidak | Hanya poli mata |
| Derajat Luka Bakar (RON), Catatan Hasil Penunjang | Tidak | |
| Asuhan Keperawatan, Catatan Perawat, Instruksi Medis | Tidak | |
| Triase | Tidak | Hanya bila modul IGD aktif |

Tab **S.O.A.P** memakai form yang sama, dikelompokkan menurut huruf SOAP dengan pintasan **Lompat Ke Form**. Tidak ada tab bernama CPPT; catatan terintegrasi diisi di tab S.O.A.P, sedangkan catatan perawat dan instruksi medis diisi di bagiannya masing-masing.

### SOAP Ringkas untuk praktik mandiri

Fitur **SOAP Ringkas** (`rme_soap_ringkas`), aktif bawaan hanya di segmen praktik mandiri, menyatukan keluhan utama dan alergi, tanda vital dan pemeriksaan fisik, diagnosis primer dan sekunder (ICD-10), status pulang, serta resep dan tindakan dalam satu layar. **Simpan & Selesai** menutup kunjungan sekaligus; keluhan utama dan diagnosis primer wajib diisi. Layar ringkas menyimpan ke struktur data yang sama dengan layar lengkap, sehingga resume, SATUSEHAT, tagihan, dan laporan tetap konsisten.

### Tindakan

Bagian **Pemeriksaan dan Tindakan** mencatat tindakan satu per satu (**Tambah Tindakan**) atau sekaligus (**Tambah Tindakan Multiple**), dengan jumlah dan petugas pelaksana. Tindakan tampil beserta harganya dan ikut ditagihkan saat kunjungan ditutup.

### Resep

Resep ditulis di **S.O.A.P › Plan › Order Obat › Tambah Order**:

- Pilih **Lokasi Tujuan Order** (depo farmasi). Aktifkan **Obat Pulang** bila perlu.
- Isi obat, jumlah, satuan dosis, aturan pakai, cara pakai, rute pemberian, dan catatan.
- Tab **Obat Racikan** tersedia bila fitur **Obat Racikan** (`farmasi_racikan`) aktif.
- **Simpan & Order Resep**. Resep masuk antrean farmasi setelah kunjungan ditutup. Proses telaah sampai penyerahan dijelaskan di [Farmasi & Stok](/modul/farmasi-stok).

### Order penunjang

Tab **Penunjang** memuat **Order Lab**, **Order Radiologi**, **Order Fisio**, **Order Patologi Anatomi**, dan **Order Mikrobiologi**; hanya order untuk modul yang aktif yang tampil. Riwayat order menampilkan status, dan hasil yang sudah keluar bisa dicetak dari sini. Lihat [Laboratorium](/modul/laboratorium) dan [Radiologi](/modul/radiologi).

### Surat keterangan, SPRI, dan rujukan

**Cetak Hasil & Surat › Surat Keterangan › Buat Surat** menyediakan jenis surat seperti:

- Surat Kontrol Rawat Jalan;
- **Surat Permohonan Rawat Inap (SPRI)**: begitu disimpan, pasien otomatis terdaftar di rawat inap dengan status **WAITING** dan menunggu admisi menetapkan bed (lihat [Rawat Inap](/modul/rawat-inap));
- Surat Keterangan Sakit dan Surat Keterangan Sehat;
- **Surat Rujukan**;
- Surat Keterangan Meninggal;
- Surat Resep Kacamata (bagian `srt_resep_kacamata`, khusus poli mata).

Untuk pasien BPJS di rumah sakit, bila fitur **Rencana Kontrol & SPRI** VClaim aktif, RME juga menampilkan tombol **Rencana Kontrol BPJS** (dari resume) dan **SPRI BPJS**. Lihat [Pendaftaran & Antrian](/modul/pendaftaran-antrian#sep-rencana-kontrol-dan-spri-vclaim).

## Resume dan discharge

Tab **Resume & Discharge** menutup kunjungan. Bagian resume:

| Bagian | Wajib |
|---|---|
| Tanda Vital Saat Masuk, Ringkasan Riwayat Penyakit, Pemeriksaan Fisik | Ya |
| Diagnosis, Tindakan, Obat | Ya |
| Status Pulang (termasuk tanggal discharge dan data rujukan bila pasien dirujuk) | Ya |
| Edukasi, Keadaan Waktu Pulang | Tidak |

Urutannya: **Simpan Resume Medis**, lalu **Discharge**, lalu **Cetak Resume Medis** bila perlu. Discharge mengubah status menjadi **DISCHARGE**, meneruskan tagihan ke kasir, dan memasukkan resep ke antrean farmasi.

Untuk FKTP dengan modul BPJS FKTP, kunjungan BPJS yang selesai dan berdiagnosis dikirim otomatis ke PCare. Kunjungan rawat jalan yang selesai juga disinkronkan ke SATUSEHAT.

## Laporan rawat jalan

Menu **Rawat Jalan › Laporan** menyediakan **Kunjungan Rawat Jalan**, **Pembatalan Poli**, dan **Rekap Tindakan Pasien**.

## Fitur dan izin

| Kebutuhan | Izin (modul › submodul › aksi) |
|---|---|
| Melihat daftar pasien poli, membatalkan kunjungan | Rawat Jalan › Poli › READ, BATAL KUNJUNGAN |
| Memanggil pasien | Rawat Jalan › Antrian › PANGGIL, LEWATI, PROSSES, SELESAI |
| Ringkasan RM, odontogram, pemeriksaan mata/fisik, tindakan | Rawat Jalan › RME › Rekap Medis |
| Asesmen | Rawat Jalan › RME › Asesmen |
| Resep (termasuk racikan) | Rawat Jalan › RME › SOAP |
| Alkes, order penunjang, tindakan | Rawat Jalan › RME › Akses Dan Penunjang |
| Inform consent, unggah berkas | Rawat Jalan › RME › Inform Consent, Unggah Berkas |
| Resume & discharge | Rawat Jalan › RME › Resume Dan DISHCARGE |
| Cetak hasil dan surat | Rawat Jalan › RME › Cetak Hasil Dan Surat |
| Laporan | Rawat Jalan › Laporan Rawat Jalan › (nama laporan) › READ, CETAK LAPORAN |

::: info Izin RME menentukan menu
Izin rinci di **Rawat Jalan › RME** terutama menentukan menu dan tab yang tampil. Penyembunyian tombol per izin di dalam RME belum menyeluruh.
:::

## Lihat juga

- [Pendaftaran & Antrian](/modul/pendaftaran-antrian): asal pasien poli.
- [Farmasi & Stok](/modul/farmasi-stok): kelanjutan resep.
- [Kasir & Penjamin](/modul/kasir-penjamin): kelanjutan tagihan.
- [SATUSEHAT](/integrasi/satusehat) dan [BPJS Kesehatan](/integrasi/bpjs).
