# Farmasi & Stok

Halaman ini menjelaskan modul **Farmasi** (pelayanan resep, penjualan bebas, retur, farmasi ruangan) dan modul **Gudang & Pengadaan** (inventory: pembelian ke supplier, penerimaan, distribusi ke depo, opname). Bacalah bila Anda menyiapkan alur apotek dan gudang, data obat, atau hak akses apoteker, TTK, dan petugas gudang.

| Modul | Kode katalog | Status | Menu |
|---|---|---|---|
| Farmasi | `farmasi` | Tersedia | Farmasi |
| Gudang & Pengadaan | `inventory` | Tersedia | Inventory |

Farmasi aktif bawaan di semua segmen. Gudang & Pengadaan aktif bawaan di semua segmen kecuali praktik mandiri.

## Alur resep

Resep dibuat dokter di RME (**S.O.A.P › Plan › Order Obat**) dan dikirim ke depo yang dipilih sebagai **Lokasi Tujuan Order**. Setelah kunjungan ditutup, resep tampil di papan kerja **Farmasi › Resep Dokter** yang terdiri atas tiga kolom:

```
Resep Masuk ──telaah + Verifikasi──▶ Obat Disiapkan ──Obat Siap Diserahkan──▶ Penyerahan Obat ──Serahkan Obat──▶ Riwayat Transaksi
```

| Tahap | Yang dikerjakan |
|---|---|
| **Resep Masuk** | Periksa asesmen medis dan daftar obat, pilih stok obat (sisa stok terlihat), ubah obat bila perlu. Isi **Telaah Resep** (aspek farmasetik, administratif, dan klinik), pilih petugas telaah, **Simpan Telaah**, lalu **Verifikasi**. Resep juga bisa dibatalkan (dengan alasan) atau dipindah ke depo lain. |
| **Obat Disiapkan** | Siapkan obat, cetak **E-Tiket**, **E-Resep**, atau **Salinan E-Resep**, lalu **Obat Siap Diserahkan**. |
| **Penyerahan Obat** | Centang butir edukasi pemberian obat, isi penerima dan nomor HP penerima, pilih petugas edukasi, lalu **Serahkan Obat**. **Batal Penyerahan** mengembalikan resep ke kolom sebelumnya. |

Saat resep diverifikasi, stok depo berkurang dan biaya obat masuk ke tagihan pasien di Kasir. Aplikasi tidak menahan penyerahan obat sampai tagihan lunas; ikuti kebijakan pembayaran faskes.

### Fitur pelayanan resep

| Fitur | Kode | Keterangan |
|---|---|---|
| Telaah & Validasi Resep | `farmasi_telaah` | **Wajib**, tidak bisa dimatikan. Tombol Verifikasi baru aktif setelah telaah disimpan. |
| Obat Racikan | `farmasi_racikan` | Order puyer, kapsul, atau salep dari RME. Tarif racik diatur di **Datamaster › Konfigurasi Harga**. |
| Substitusi Obat | `farmasi_substitusi` | Apoteker mengganti obat dengan padanannya (generik/merek lain) saat telaah. |
| Obat Kronis BPJS (23/7) | `farmasi_obat_kronis` | Penandaan obat kronis: 7 hari masuk paket INA-CBG, 23 hari ditagihkan terpisah. Mensyaratkan modul BPJS FKRTL. |
| Laporan Farmasi Lanjutan | `farmasi_laporan_lanjutan` | Waktu tunggu pelayanan resep dan rekap pendapatan per apotek. |

## Penjualan obat bebas

Fitur **Penjualan Obat Bebas (OTC)** (`farmasi_penjualan_bebas`) membuka **Farmasi › Penjualan Obat** untuk menjual obat tanpa resep kepada pembeli umum. Petugas mengisi lokasi farmasi, nama dan HP pembeli, item, jenis stok, jumlah, dan diskon. Transaksi berstatus **Belum Bayar**, **Lunas**, atau **Dibatalkan**, dan penjualan yang belum dibayar bisa dibatalkan dengan alasan. Di kasir, transaksi ini tampil di **Pembayaran › Transaksi › APS & OTC** (fitur `bayar_aps_otc`).

## Retur obat dan material

Fitur **Retur Obat & Material** (`farmasi_retur`) membuka **Farmasi › Retur Obat & Material** untuk menerima pengembalian obat atau BMHP dari pasien maupun ruangan. Petugas memilih item, mengisi alasan retur, lalu **Retur**. Nilai retur dihitung sebagai **Total Retur** dan tampil di kasir pada baris **Retur Obat/Alkes**.

## Farmasi ruangan

Fitur **Farmasi Ruangan** (`farmasi_ruangan`) melayani permintaan obat dan alkes dari ruangan rawat inap dan IGD, termasuk order **Alkes** dari RME (`rme_alkes`). Papan kerjanya juga tiga kolom: **Order Masuk** (verifikasi, batal, atau pindah lokasi) → **Sedang Disiapkan** (**Alkes Siap Diserahkan**) → **Penyerahan Alkes** (diberikan oleh dan diterima oleh).

## Stok per lokasi dan depo

Setiap depo farmasi dan gudang adalah **lokasi stok** (**Farmasi › Datamaster › Lokasi Stok**). Stok dicatat per item, per jenis stok, dan per batch (tanggal kedaluwarsa). Metode pengeluaran stok (FIFO, LIFO, atau FEFO), margin, dan PPN diatur di **Farmasi › Datamaster › Konfigurasi Harga**.

Tombol **Stok** di bagian bawah sidebar membuka jendela pengelolaan stok untuk lokasi yang dipilih:

| Menu | Fungsi |
|---|---|
| **Permintaan Barang** | Depo/unit meminta barang ke gudang (boleh **Cito**). |
| **Penerimaan Unit** | Melihat barang kiriman gudang. |
| **Retur Unit** | Mengembalikan barang ke gudang. |
| **Kartu Stok & Mutasi** | Riwayat keluar-masuk per item dan per lokasi. |
| **Stok Opname** | Penghitungan fisik stok depo. |
| **Stok Adjustment** | Koreksi stok di luar opname. |

Tombol **Stok** tampil bila modul Farmasi atau Gudang & Pengadaan aktif, dan menunya diatur lewat modul izin **STOK**.

## Gudang & pengadaan

Modul **Gudang & Pengadaan** mengelola stok di gudang. Petugas memilih gudang yang dikerjakan di **Pilih Lokasi Stok** pada sidebar Inventory.

### Pembelian ke supplier (PO)

Fitur **Pembelian ke Supplier** (`inv_pengadaan_po`):

1. **Pengadaan Barang › Pembelian Barang Supplier**: buat surat pesanan berisi lokasi penerima, supplier, tanggal PO, cara bayar, item, diskon, dan PPN. Status **PENGAJUAN**; masih bisa diubah atau dibatalkan.
2. **Pengadaan Barang › Verifikasi Pembelian Barang Supplier**: periksa lalu **Verifikasi**. Status **DIVERIFIKASI**.
3. **Penerimaan Barang › Penerimaan Pembelian**: isi tanggal penerimaan, nomor faktur, nomor surat jalan, dan tanggal kedaluwarsa per barang, lalu **Terima Pembelian**. Stok gudang baru bertambah di langkah ini. Faktur bisa dicetak.

### Distribusi ke depo dan unit

| Halaman | Fungsi |
|---|---|
| **Pengeluaran Barang › Verifikasi & Pengiriman Unit** | Memproses permintaan depo/unit: isi jumlah kirim, **Verifikasi**, lalu **Kirim Barang** atau **Tolak Permintaan**. Stok gudang berkurang; unit melihatnya di **Stok › Penerimaan Unit**. |
| **Pengeluaran Barang › Pengeluaran Unit** | Pengeluaran tanpa permintaan, pemakaian unit, atau pemusnahan barang (kedaluwarsa/rusak). |
| **Penerimaan Barang › Penerimaan Retur Unit** | Barang yang dikembalikan unit ke gudang. |

### Retur ke supplier

Fitur **Retur & Penggantian Supplier** (`inv_retur_supplier`): retur barang rusak atau kedaluwarsa berdasarkan faktur penerimaan (status **RETUR**), lalu catat penggantiannya berupa barang atau nominal (status **DITERIMA**).

### Opname dan koreksi stok

- **Stok Opname** (`inv_stok_opname`): judul, jenis stok, kategori, tanggal *cut off*, rekonsiliasi dari master item atau stok item, unduh lembar kerja, impor hasil hitung fisik dari Excel, lalu **Simpan (Draft)** atau **Simpan & Akhiri SO**.
- **Penyesuaian Stok** (`inv_stok_adjustment`): koreksi satu batch di luar opname, misalnya karena rusak, hilang, atau selisih.

### Data dan laporan gudang

**Datamaster › Supplier** (dengan impor Excel), **Riwayat Tarif** per barang, **Kartu Stok & Mutasi**, serta **Laporan › Obat Expired** dan **Laporan › Persediaan**.

### Pembelian via marketplace

Fitur **Pembelian via Marketplace** (`inv_marketplace`) menyediakan pengadaan BMHP lewat marketplace mitra. Fitur ini mati bawaan di semua segmen.

- Konfigurasi koneksi per faskes, pencarian penawaran, serta pemetaan produk dan satuan.
- Pengajuan dan persetujuan permintaan, lalu checkout. Status pesanan diperbarui dari mitra.
- Penerimaan barang tetap memakai PO dan alur **Penerimaan Pembelian** yang sudah ada.

Halamannya ada di **Inventory › Marketplace** (Pencarian, Pemetaan, Permintaan). Aksi berisiko seperti konfigurasi koneksi, pemetaan, persetujuan, dan checkout tidak diberikan otomatis ke peran yang sudah ada.

## Data master farmasi

**Farmasi › Datamaster** memuat **Item Medis** (kode, nama, jenis item, satuan, jenis stok, manufaktur, bentuk sediaan, kategori, komposisi, dan konversi satuan beli), **Aturan Pakai**, **Cara Pakai**, **Satuan**, **Bentuk Sediaan**, **Kategori Obat**, **Manufaktur**, **Jenis Stok**, **Lokasi Stok**, **Komposisi**, dan **Konfigurasi Harga**. Item medis yang sama dipakai di resep, penjualan, dan pengadaan.

## Laporan farmasi

**Farmasi › Laporan** menyediakan **Pendapatan**. Bila fitur Laporan Farmasi Lanjutan aktif, tersedia juga **Waktu Tunggu** (indikator mutu pelayanan resep) dan **Rekap Pendapatan Dokter Resep per Apotik**. **Farmasi › Riwayat Transaksi** memuat resep yang sudah diserahkan.

## Fitur dan izin

| Kebutuhan | Izin (modul › submodul › aksi) |
|---|---|
| Telaah, verifikasi, siapkan, serahkan resep | Farmasi › Resep Dokter › READ, RESEP MASUK SIMPAN TELAAH, RESEP MASUK VERIFIKASI, OBAT DISIAPKAN … OBAT SIAP DISERAHKAN, PENYERAHAN OBAT SERAHKAN OBAT |
| Ubah obat, ubah menjadi racikan | Farmasi › Resep Dokter › EDIT OBAT, SIMPAN EDIT, SIMPAN DAN UBAH MENJADI RACIK |
| Penjualan bebas | Farmasi › Penjualan Obat › READ, CREATE BELI OBAT, BATAL PEMBELIAN |
| Retur | Farmasi › Retur Obat dan Material › READ, RETUR |
| Farmasi ruangan | Farmasi › Farmasi Ruangan › ORDER MASUK VERIFIKASI, SEDANG DISIAPKAN ALKES SIAP DISERAHKAN, PENYERAHAN SERAHKAN |
| Data master dan laporan farmasi | Farmasi › Datamaster › (nama data); Farmasi › Laporan › (nama laporan) |
| Permintaan, penerimaan, opname di depo | STOK › Permintaan Barang, Penerimaan Barang, Kartu Stok dan Mutasi, Stok Opname, Stok Adjustment |
| Pembelian dan verifikasi PO | Inventory › Pengadaan Barang; Inventory › Verifikasi Pembelian Barang Supplier › READ, VERIFIKASI |
| Penerimaan pembelian | Inventory › Penerimaan Barang › Penerimaan Pembelian › READ, TERIMA PEMBELIAN |
| Kirim ke unit | Inventory › Pengeluaran Barang › Verifikasi dan Penerimaan Barang Unit › VERIFIKASI, KIRIM BARANG |
| Retur supplier | Inventory › Retur dan Penggantian Supplier |
| Opname dan adjustment gudang | Inventory › Stok Opname; Inventory › Stok Adjustment |
| Marketplace | Inventory › Pembelian Marketplace › READ, KONFIGURASI KONEKSI, CARI PENAWARAN, KELOLA PEMETAAN, AJUKAN PERMINTAAN, PERSETUJUAN, CHECKOUT, SINKRON STATUS, LIHAT LAPORAN |

## Lihat juga

- [Rawat Jalan](/modul/rawat-jalan#resep): penulisan resep di RME.
- [Kasir & Penjamin](/modul/kasir-penjamin): biaya obat dan transaksi OTC.
- [Penunjang Umum](/modul/penunjang-umum): logistik nonfarmasi (laundry, sarpras).
