# Penunjang Umum

Halaman ini menjelaskan modul penunjang nonmedis: Gudang & Pengadaan (logistik), Laundry & Linen, Sarana dan Prasarana (IPSRS), Manajemen Ambulans, dan Kelas Training. Bacalah bila Anda menyiapkan unit pendukung operasional faskes atau mengatur hak akses petugasnya.

| Modul | Kode katalog | Segmen bawaan | Menu |
|---|---|---|---|
| Gudang & Pengadaan | `inventory` | Semua kecuali praktik mandiri | Inventory |
| Laundry & Linen | `laundry` | Klinik utama, RS D, C, B, A | Laundry |
| Sarana dan Prasarana (IPSRS) | `sarpras` | Klinik utama, RS D, C, B, A | Sarana dan Prasarana (IPSRS) |
| Manajemen Ambulans | `ambulans` | Puskesmas, RS D, C, B, A | Manajemen Ambulans |
| Kelas Training | `training` | Tidak ada (aktifkan per faskes) | Training |

Semua modul di atas berstatus **tersedia** dan dilayani `penunjang-service`, kecuali Gudang & Pengadaan yang dilayani `inventory-service`.

## Gudang & Pengadaan

Modul logistik untuk pembelian ke supplier, penerimaan, distribusi ke depo dan unit, retur supplier, stok opname, dan pembelian via marketplace mitra. Karena alurnya menyatu dengan stok farmasi, penjelasan lengkapnya ada di [Farmasi & Stok](/modul/farmasi-stok#gudang-pengadaan).

Suku cadang yang dipakai saat perbaikan di modul Sarana dan Prasarana dapat mengurangi stok Gudang & Pengadaan.

## Laundry & Linen

Siklus linen kotor sampai bersih dengan stok per ruangan. Halaman: **Stok**, **Penerimaan**, **Batch**, **Distribusi**, **Koreksi**, **Master**, **Laporan**, serta **Unit Linen**, **Pemindaian Unit**, dan **Laporan Unit**.

### Alur linen

```
Ruangan ──serah terima kotor──▶ Laundry ──batch: cuci → kering → setrika/lipat──▶ stok bersih ──distribusi──▶ Ruangan
```

| Fitur | Kode | Isi |
|---|---|---|
| Serah Terima Linen Kotor | `laundry_penerimaan` | Per kategori (biasa, infeksius, bernoda berat), dikonfirmasi petugas laundry yang berbeda. Jumlah diterima dan alasan selisih disimpan tanpa menimpa jumlah diserahkan. |
| Pemrosesan Batch | `laundry_batch` | Batch per kategori (boleh lintas ruangan) dengan berat kg, tahap pencucian → pengeringan → setrika/lipat. Batch selesai menambah stok bersih. |
| Permintaan & Distribusi | `laundry_distribusi` | Permintaan linen bersih dari ruangan, distribusi dari stok bersih (boleh sebagian), konfirmasi penerimaan oleh ruangan. |
| Stok & Par Level | `laundry_stok` | Saldo linen per ruangan dari buku transaksi, par level, saldo awal, stok bersih laundry. |
| Koreksi Stok | `laundry_koreksi` | Linen hilang, rusak, dan afkir dengan alasan dan pelaku. |
| Master Jenis Linen | `laundry_master` | Jenis linen, kode, satuan hitung. |
| Laporan Laundry | `laundry_laporan` | Beban cucian kg per ruangan, perputaran, selisih, pemisahan kategori, rekonsiliasi, ekspor Excel. |

Stok dihitung dari buku transaksi dan dikunci per lokasi dan jenis linen, sehingga tidak pernah negatif walau transaksi berjalan bersamaan. Biaya cucian per kg belum disajikan.

### Pelacakan per unit dengan QR/barcode

Jenis linen tertentu bisa dilacak per unit, sementara jenis lain tetap dihitung per jumlah.

| Fitur | Kode | Isi |
|---|---|---|
| Unit Linen & Label | `laundry_unit` | Cara pencatatan per jenis (per jumlah/per unit), batas umur pakai, registrasi unit berkode unik, cetak label QR/barcode 50 × 25 mm dari peramban, koreksi status/lokasi, tautan ke bed/kamar. |
| Pemindaian Unit | `laundry_pemindaian_unit` | Pindai unit dengan kamera peramban atau scanner USB di setiap titik: serah terima kotor, masuk batch, selesai cuci, distribusi, penerimaan ruangan. Stok ikut dihitung dari hasil pindai. |
| Laporan Unit Linen | `laundry_laporan_unit` | Riwayat perjalanan per unit, unit hilang/rusak per ruangan, unit mendekati batas umur pakai, perputaran. |

Satu unit tidak bisa berada di dua tahap sekaligus, dan siklus cuci bertambah tepat sekali per batch selesai. Stok lama yang belum berlabel tampil terpisah dan perlu diregistrasi sebelum beredar.

**Izin:** Laundry › Stok & Par Level, Penerimaan (KONFIRMASI), Batch, Permintaan Linen, Distribusi (KONFIRMASI), Koreksi Stok, Datamaster › Jenis Linen, Laporan Laundry, Unit Linen (CETAK LABEL), Pemindaian Unit, Koreksi Unit, Laporan Unit.

## Sarana dan Prasarana (IPSRS)

Pengelolaan aset dan pemeliharaan untuk Instalasi Pemeliharaan Sarana Rumah Sakit. Halaman: **Aset**, **Laporan Kerusakan**, **Pemeliharaan**, **Kalibrasi**, **Utilitas**, **Pengaturan**, dan **Laporan**.

| Fitur | Kode | Isi |
|---|---|---|
| Register Aset & Laporan Kerusakan | `sarpras_aset` (wajib) | Aset alat medis, nonmedis, gedung/utilitas, dan kendaraan dengan kode inventaris unik, lokasi, nilai dan tahun perolehan, penanggung jawab, status, label QR, dan riwayat per aset. Laporan kerusakan dari ruangan sampai selesai. |
| Pemeliharaan Preventif | `sarpras_pemeliharaan` | Jadwal harian/mingguan/bulanan/tahunan dengan checklist, pelaksanaan, dan penanda terlambat. |
| Kalibrasi & Uji Fungsi Alat | `sarpras_kalibrasi` | Rencana dan hasil kalibrasi, lembaga penguji, sertifikat, masa berlaku, peringatan jatuh tempo (ambang per faskes, bawaan 30 hari). |
| Pencatatan Utilitas | `sarpras_utilitas` | Meter listrik/air, genset, dan oksigen sentral per lokasi. |
| Laporan Sarpras | `sarpras_laporan` (wajib) | Daftar dan riwayat aset, kepatuhan pemeliharaan dan kalibrasi, waktu respons perbaikan, biaya pemeliharaan; ekspor Excel. |

### Work order perbaikan

```
Baru ──tugaskan teknisi──▶ Diproses ⇄ Menunggu suku cadang ──▶ Selesai / Tidak dapat diperbaiki
```

Waktu respons dihitung sejak laporan dibuat sampai teknisi ditugaskan. Laporan bisa dilampiri foto kerusakan. Suku cadang dicatat manual atau mengurangi stok Gudang & Pengadaan. Transisi status yang tidak sah ditolak. Hasil kalibrasi yang tidak lulus tidak mengubah status aset secara otomatis.

**Izin:** Sarana dan Prasarana (IPSRS) › Aset (PINDAH LOKASI, UBAH STATUS, CETAK QR), Laporan Kerusakan (TUGASKAN, UPDATE STATUS, TUTUP), Suku Cadang (CATAT PEMAKAIAN), Pemeliharaan (CREATE JADWAL, CATAT PELAKSANAAN), Kalibrasi (UNGGAH SERTIFIKAT), Berkas, Utilitas, Laporan Sarpras (EKSPOR), Pengaturan.

## Manajemen Ambulans

Permintaan dan penugasan ambulans sampai penagihan biayanya. Halaman: **Permintaan**, **Penugasan**, **Perjalanan**, **Master Armada**, **Master Kru**, **Tarif**, **Kuitansi**, dan **Laporan**.

### Alur layanan

```
Permintaan ──penugasan armada + kru──▶ Perjalanan (berangkat → tiba lokasi → berangkat tujuan → tiba tujuan → kembali)
                                              └─▶ biaya dihitung ──▶ tagihan kunjungan pasien / kuitansi umum
```

| Fitur | Kode | Isi |
|---|---|---|
| Permintaan Layanan | `ambulans_permintaan` | Sumber (IGD, ruangan, telepon masyarakat, rujukan), jenis layanan (gawat darurat, rujukan, pemulangan, jenazah), pasien dan kunjungan opsional, lokasi jemput, tujuan, prioritas. Bisa dibatalkan dengan alasan sebelum penugasan. |
| Penugasan Armada & Kru | `ambulans_penugasan` | Koordinator menugaskan armada dan kru (sopir wajib, perawat pendamping opsional) sesuai jenis armada, status siap, dan jadwal jaga. |
| Perjalanan | `ambulans_perjalanan` | Tahap perjalanan, kilometer awal-akhir (jarak dihitung server), BBM, dan catatan pendamping yang aksesnya terbatas. |
| Master Armada & Servis | `ambulans_armada` | Nomor polisi, jenis (transport, gawat darurat, jenazah), kelengkapan, status (siap, bertugas, servis), jadwal servis dan pajak/STNK, riwayat servis. |
| Master Kru & Jadwal Jaga | `ambulans_kru` | Sopir dan perawat pendamping beserta jadwal jaga, dengan validasi benturan jadwal. |
| Tarif | `ambulans_tarif` | Tarif per jenis layanan, kilometer, atau zona, dengan masa berlaku. |
| Biaya & Kuitansi | `ambulans_pembiayaan` | Biaya dihitung saat perjalanan selesai, diteruskan ke tagihan kunjungan pasien, atau diterbitkan sebagai kuitansi untuk layanan umum tanpa pasien. |
| Laporan Ambulans | `ambulans_laporan` | Jumlah layanan per jenis, waktu respons, jarak dan BBM per armada, pendapatan; ekspor CSV. |

Bila tarif tidak ditemukan, biaya ditandai belum dihitung, bukan diisi nilai karangan. Riwayat servis armada bisa ditautkan ke work order Sarana dan Prasarana bila modul itu aktif.

**Izin:** Manajemen Ambulans › Permintaan, Penugasan, Perjalanan (CATAT TAHAP, SELESAIKAN), Catatan Pendamping, Armada (UBAH STATUS), Servis Armada, Kru & Jadwal Jaga, Tarif, Biaya & Kuitansi (TERUSKAN), Laporan Ambulans (EKSPOR).

## Kelas Training

Kelas olahraga atau edukasi berbayar, misalnya yoga, pilates, zumba, dan senam hamil. Halaman: **Daftar Kelas**, **Booking Kelas**, **Datamaster › Kelas**, dan **Laporan › Rekapitulasi**.

- **Datamaster Kelas**: instruktur, kuota, sesi opsional, dan tarif; mendukung impor Excel.
- **Booking Kelas**: cari jadwal dan sisa slot per kelas, tanggal, dan sesi; pilih pasien terdaftar; ubah atau batalkan booking. Slot dikunci agar aman dari booking bersamaan.
- **Daftar Kelas**: booking dilanjutkan menjadi pendaftaran dengan pemilihan metode pembayaran, atau pendaftaran langsung. Pembatalan wajib beralasan, dan slotnya kembali tersedia.
- **Rekapitulasi**: kunjungan kelas per periode dan per kelas, dengan ekspor Excel.

Pendaftaran kelas membentuk tagihan di Pembayaran, tetapi tidak membuat kunjungan klinis atau rekam medis. Peserta diambil dari data pasien di Admisi. Modul ini tidak masuk preset segmen mana pun, sehingga superadmin perlu menyalakannya per faskes.

**Izin:** Training › Daftar Kelas (CREATE DAFTAR KELAS, BATAL DAFTAR), Booking Kelas (CREATE BOOKING, UPDATE BOOKING, BATAL BOOKING, DAFTAR), Datamaster › Kelas, Laporan.

## Lihat juga

- [Farmasi & Stok](/modul/farmasi-stok): stok depo dan gudang.
- [Penunjang Medis](/modul/penunjang-medis): CSSD dan unit penunjang klinis lain.
- [Kasir & Penjamin](/modul/kasir-penjamin): tagihan ambulans dan kelas training.
- [Peta Modul](/modul/)
