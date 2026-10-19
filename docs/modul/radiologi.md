# Radiologi

Halaman ini menjelaskan modul **Radiologi**: order, validasi dan tagihan, penjadwalan ruang dan alat, pemeriksaan oleh radiografer, expertise dokter radiologi, serta bridging ke PACS/RIS. Bacalah bila Anda menyiapkan instalasi radiologi, data master pemeriksaan, atau integrasi dengan PACS.

| Modul | Kode katalog | Status | Menu |
|---|---|---|---|
| Radiologi | `radiologi` | Tersedia | Penunjang › Radiologi |

Modul ini aktif bawaan di klinik utama dan RS kelas D, C, B, dan A.

## Alur dan status

```
Order ──Validasi & Kirim Tagihan──▶ Valid ──Jadwalkan (opsional)──▶ Periksa ──▶ Input Hasil (expertise) ──▶ Selesai
```

| Tingkat | Status |
|---|---|
| Order | **Order** → **Valid** (sudah divalidasi, tagihan terkirim) → **Diperiksa** → **Selesai**, atau **Batal** |
| Tiap pemeriksaan | **Menunggu** → **Menunggu Expertise** → **Selesai** |

## Order

Order radiologi datang dari tiga sumber:

| Sumber | Cara |
|---|---|
| **RME** | Tab **Penunjang › Order Radiologi** di rawat jalan, rawat inap, atau IGD. |
| **APS** | **Order Radiologi › Order APS** untuk pasien yang datang sendiri atau membawa rujukan luar. Pasien harus sudah terdaftar di Admisi. |
| **MCU** | Pemeriksaan radiologi di paket MCU otomatis menjadi order. |

Daftar **Order Radiologi** bisa disaring menurut status, sumber (RME/APS/MCU), modalitas, dan tanggal. Order segera ditandai **CITO**.

## Validasi dan tagihan

Buka order berstatus **Order**, periksa pemeriksaan dan tarifnya, lalu klik **Validasi & Kirim Tagihan**. Status menjadi **Valid** dan tagihan masuk ke modul Pembayaran. **Cetak Bukti Order** tersedia untuk pasien.

Order berstatus **Order** atau **Valid** bisa dibatalkan dengan alasan. Item tagihannya ikut dihapus. Order yang pemeriksaannya sudah dikerjakan tidak bisa dibatalkan.

## Penjadwalan

Penjadwalan bersifat opsional, tetapi membantu mengatur antrean ruang dan alat:

- **Jadwalkan** dari detail order atau dari **Radiologi › Penjadwalan**: pilih ruang/alat, tanggal, dan slot jam kosong. Pasien CITO bisa memakai **Segera (slot terdekat hari ini)**.
- Papan **Penjadwalan Pemeriksaan** menampilkan jadwal per tanggal dengan nomor antrean ruang. Dari sini petugas bisa **Pasien Hadir**, **Cetak Slip** (memuat persiapan pasien), **Ubah**, **Batalkan** (order tidak ikut batal), dan **Ke Worklist**.
- **Cetak Jadwal** mencetak daftar jadwal harian.

## Pemeriksaan dan expertise

Halaman **Pemeriksaan & Hasil** adalah worklist radiografer dan dokter radiologi. Saringan tersedia untuk CITO, jadwal hari ini, ruang, dan status.

1. **Periksa**: radiografer mencatat ruang/alat, nama radiografer, dan waktu pemeriksaan. Status pemeriksaan menjadi **Menunggu Expertise**, dan kehadiran pasien tercatat otomatis bila belum ditandai.
2. **Input Hasil**: dokter radiologi (Sp.Rad) memilih template bacaan normal bila ada, mengisi **Hasil / Uraian** dan **Kesan**, serta melampirkan gambar (PNG/JPG, maksimal 1 MB per berkas, 5 berkas). **Simpan Expertise** mengubah status menjadi **Selesai**.
3. **Cetak** hasil dari baris pemeriksaan atau **Cetak Hasil** di detail order. **Ubah Hasil** dipakai untuk koreksi.

Hasil radiologi juga tampil di riwayat penunjang RME dan di **Cetak Hasil & Surat**.

## Data master

| Data | Isi |
|---|---|
| **Pemeriksaan Radiologi** | Kode, modalitas, nama, bagian tubuh, kode ICD-9-CM, tarif, persiapan pasien (dicetak di slip), status |
| **Paket Radiologi** | Gabungan pemeriksaan dengan harga paket, dibagi proporsional ke tiap pemeriksaan saat diorder |
| **Ruang & Alat** | Kode dan nama ruang, merk/tipe alat, modalitas yang dilayani, jam buka-tutup, durasi slot, hari operasional |
| **Template Expertise** | Teks bacaan normal per pemeriksaan, per modalitas, atau umum |
| **Petugas Radiologi** | Dokter radiologi dan radiografer dari Datamaster Praktisi |

## Bridging PACS/RIS

Fitur **Bridging PACS/RIS** (`rad_bridging_pacs`) mengirim order ke PACS/RIS dan menerima status, expertise, serta tautan citra. Fitur ini mati bawaan di semua segmen yang memakai Radiologi, sehingga perlu dinyalakan superadmin di **Setting › Manajemen Modul**.

1. **Koneksi**: **Setting › Konfigurasi Integrasi › Konfigurasi PACS**. Koneksi bisa lebih dari satu dengan satu koneksi bawaan. API key dan kunci masuk disimpan terenkripsi. Tersedia **Uji Koneksi**.
2. **Pemetaan**: **Radiologi › Mapping PACS** untuk tindakan → kode prosedur dan modalitas PACS; unit asal, dokter pengirim, dan penjamin → kode PACS; ruang/alat → **AE Title**. AE Title adalah data referensi yang dikirim bersama order; OpenSIMRS tidak membentuk worklist DICOM sendiri.
3. **Validasi & Kirim ke PACS**: setiap pemeriksaan mendapat **Accession Number** unik yang menjadi kunci agar pengiriman ulang tidak menggandakan order. **Validasi Saja** tetap tersedia sebagai jalur darurat.
4. **Pemantauan**: **Setting › Konfigurasi Integrasi › Pengiriman PACS** menampilkan status kiriman (Terkirim, Gagal, Sedang dikirim, Tidak pasti, Hasil diterima, Hasil sebagian) dengan **Kirim Ulang**, **Kirim Lagi**, dan **Cek Status**.
5. **Hasil**: masuk otomatis dari PACS atau ditarik manual dengan **Ambil Hasil PACS**. Tombol **Buka Citra** membuka viewer PACS. Expertise yang sudah diisi manual tidak ditimpa otomatis.

Untuk pengujian tanpa PACS sungguhan, repo menyediakan `scripts/pacs-tiruan.mjs`. Kontrak integrasinya dijelaskan di [LIS & PACS](/integrasi/lis-pacs).

## Laporan

**Radiologi › Laporan › Kunjungan Radiologi** menampilkan ringkasan order, pasien, pendapatan, dan rerata waktu tunggu, dengan rincian per modalitas, ruang/alat, pelayanan, pemeriksaan, dan hari. Laporan bisa diunduh sebagai Excel.

## Fitur dan izin

| Kebutuhan | Izin (modul › submodul › aksi) |
|---|---|
| Order, validasi, batal, cetak bukti | Radiologi › Order Radiologi › READ, CREATE, VALIDASI, BATAL, CETAK |
| Penjadwalan | Radiologi › Penjadwalan › READ, CREATE, UPDATE, BATAL, CETAK |
| Periksa, expertise, cetak hasil | Radiologi › Pemeriksaan › READ, PERIKSA, INPUT HASIL, CETAK HASIL |
| Data master | Radiologi › Datamaster › Pemeriksaan Radiologi, Paket Radiologi, Ruang & Alat, Template Expertise, Petugas Radiologi |
| Pemetaan PACS | Radiologi › Datamaster › Mapping PACS |
| Laporan | Radiologi › Laporan Radiologi › Kunjungan › READ, CETAK LAPORAN |

::: warning Izin per tombol
Pembatasan per tombol (misalnya VALIDASI dan INPUT HASIL) belum ditegakkan menyeluruh di halaman radiologi. Atur akses menu radiologi hanya untuk peran yang memang bertugas di instalasi ini.
:::

## Lihat juga

- [LIS & PACS](/integrasi/lis-pacs)
- [Laboratorium](/modul/laboratorium)
- [Kasir & Penjamin](/modul/kasir-penjamin): tagihan pemeriksaan radiologi.
