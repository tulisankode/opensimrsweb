# Kasir & Penjamin

Halaman ini menjelaskan modul **Kasir & Pembayaran**: bagaimana tagihan terbentuk, cara menerima pembayaran tunai maupun asuransi, shift kasir, close bill, piutang, kuitansi, dan laporan kasir. Bacalah bila Anda menyiapkan alur kasir, data tarif dan penjamin, atau hak akses petugas keuangan.

| Modul | Kode katalog | Status | Menu |
|---|---|---|---|
| Kasir & Pembayaran | `pembayaran` | Inti (selalu aktif) | Pembayaran |

## Sumber tagihan

Tagihan pasien terbentuk otomatis dari layanan. Kasir tidak perlu mengetik ulang item.

| Sumber | Kapan masuk tagihan |
|---|---|
| Tindakan di RME | Saat kunjungan ditutup (discharge) |
| Obat dan alkes | Saat farmasi memverifikasi resep atau order alkes |
| Laboratorium | Saat order divalidasi; dihapus bila order dibatalkan |
| Radiologi, Patologi Anatomi, Mikrobiologi, Fisioterapi | Saat order divalidasi |
| Biaya kamar rawat inap | Saat discharge, dihitung dari tarif ruangan |
| Modul lain | Sesi hemodialisa, laporan operasi final (kamar operasi), biaya darah dan crossmatch (BDRS), biaya ambulans, dan order kelas training juga diteruskan ke Pembayaran |

Tarif diatur di **Datamaster › Tarif** dan **Datamaster › Komponen Tarif**, sedangkan daftar penjamin di **Datamaster › Penjamin**.

## Penjamin

Setiap kunjungan memiliki cara bayar yang dipilih saat pendaftaran:

| Cara bayar | Di kasir |
|---|---|
| **TUNAI** | Kasir mengisi **Jumlah Bayar** dan memilih metode pembayaran. **Kembalian** dihitung otomatis. |
| **ASURANSI** (asuransi swasta, perusahaan, BPJS) | Kasir mengisi nilai **Dijamin**. Cara bayar terisi otomatis sesuai penjamin kunjungan. |

Untuk pasien BPJS, dokumen penjaminan diurus di loket: SEP untuk FKRTL atau sinkron PCare untuk FKTP. Lihat [Pendaftaran & Antrian](/modul/pendaftaran-antrian#bpjs-di-loket). Penanda **Obat Kronis BPJS (23/7)** di farmasi memisahkan obat kronis yang masuk paket INA-CBG dari yang ditagihkan terpisah.

## Menerima pembayaran

1. Buka **Pembayaran › Kasir**, cari pasien lewat **Pencarian Transaksi** (nama, No. Transaksi, atau No. RM), lalu pilih tagihannya.
2. Periksa **List Tagihan Pelayanan** dan **Detail Tagihan Pelayanan** (kamar, penunjang, tindakan, obat, alkes).
3. Periksa **Total Pembayaran**: biaya administrasi, tindakan, penunjang, obat/alkes, retur obat/alkes, kamar, potongan, PPN, dan **Grand Total**.
4. Terapkan diskon atau voucher bila perlu.
5. Klik **Bayar**, isi jumlah dan metode, lalu **Bayar**.

Metode pembayaran yang tersedia:

| Metode | Keterangan |
|---|---|
| **Tunai** | Kembalian dihitung otomatis |
| **Transfer** | |
| **Debit/Kredit** | |
| **Dijamin** (asuransi) | Nilai yang ditanggung penjamin |

Bila jumlah bayar kurang dari Grand Total, aplikasi menanyakan apakah transaksi dilanjutkan dengan status **piutang**. Tarif PPN diatur di **Setting › System**.

### Diskon dan voucher

Fitur **Diskon & Voucher** (`bayar_diskon_voucher`) menampilkan isian diskon persen (**Pakai Diskon**) dan kode voucher (**Pakai Voucher**) di kasir. Voucher dikelola di **Datamaster › Voucher**. Kuitansi dan tagihan menampilkan rincian diskon dan voucher. Fitur ini mati bawaan di puskesmas.

## Kuitansi dan rincian

- **Cetak Tagihan**: rincian biaya, selalu tersedia.
- **Cetak Kuitansi**: bukti bayar, muncul setelah ada pembayaran.

Keduanya juga bisa dicetak dari **Pembayaran › Transaksi**.

## Close bill dan piutang

- **Close Bill** menutup tagihan setelah semua biaya tercantum. Setelah ditutup, tagihan tidak dapat diubah atau ditambah, dan tombolnya berubah menjadi **Bill Telah Ditutup**.
- **Pembayaran › Closed Bill** menampilkan tagihan yang sudah ditutup. Saring status **PIUTANG**, buka tagihan, lalu **Lunaskan › Pelunasan** dengan jumlah dan metode pembayaran. Status menjadi **LUNAS** dan kuitansi bisa dicetak.

Tidak ada tombol pembatalan (*void*) pembayaran di menu Pembayaran. Kesalahan input perlu ditangani lewat prosedur faskes bersama admin sistem.

## Transaksi pelayanan, APS, dan OTC

| Halaman | Isi |
|---|---|
| **Pembayaran › Transaksi › Pelayanan** | Tagihan pasien kunjungan, dengan saringan pelayanan, cara bayar, dan status **Menunggu**/**Lunas**. |
| **Pembayaran › Transaksi › APS & OTC** | Fitur **Transaksi APS & OTC** (`bayar_aps_otc`): tagihan pasien atas permintaan sendiri (misalnya lab tanpa kunjungan) dan penjualan obat bebas. Mati bawaan di praktik mandiri. |

Dari detail transaksi, kasir juga bisa **Bayar**, **Close Bill**, dan mencetak.

## Shift kasir

Fitur **Shift Kasir** (`bayar_shift_kasir`) mengatur buka-tutup kas per petugas. Tanpa fitur ini, kasir langsung bisa menerima pembayaran. Fitur ini mati bawaan di praktik mandiri, dan `payment-service` ikut memeriksa status fitur ini di sisi server.

| Langkah | Cara |
|---|---|
| **Buka kasir** | Di **Pembayaran › Kasir**, isi **Saldo Awal (kas)**, pilih shift (**Pagi**, **Siang**, **Malam**), lalu **Open Kasir**. |
| **Tutup shift** | **Close Kasir**, bandingkan **Pendapatan System** dengan uang di laci, isi **Pendapatan Aktual** tunai, lalu **Closing Kasir**. |
| **Tutup hari** | **Closing Harian** di akhir hari. |

Riwayat buka, tutup, dan tutup hari per petugas tercatat di **Laporan › Closing Kasir**.

## Laporan kasir

| Laporan | Isi |
|---|---|
| **Pembayaran Kunjungan** | Pembayaran per pasien: waktu bayar, cara bayar, total bayar, kasir; saringan shift dan tanggal. |
| **Closing Kasir** | Riwayat open, close, dan close harian per petugas. |
| **Pendapatan** | Pendapatan per periode, diekspor ke Excel. |

Rekap pendapatan lintas layanan juga tersedia di **Laporan › Rekapitulasi Pendapatan**, dan indikator pendapatan, kas diterima, serta piutang di [Dashboard Eksekutif](/modul/manajemen#dashboard-eksekutif).

## Fitur dan izin

| Kebutuhan | Fitur katalog | Izin (modul › submodul › aksi) |
|---|---|---|
| Menerima pembayaran, cetak | – | Pembayaran › Kasir › READ, BAYAR, CETAK INVOICE, CETAK RINCIAN BIAYA |
| Close bill | – | Pembayaran › Kasir › CLOSE BILL |
| Buka/tutup shift, tutup hari | `bayar_shift_kasir` | Pembayaran › Kasir › OPEN KASIR, CLOSE KASIR, CLOSE HARIAN |
| Daftar transaksi | `bayar_aps_otc` (untuk APS & OTC) | Pembayaran › Transaksi › READ, CETAK INVOICE, CETAK RINCIAN BIAYA |
| Pelunasan piutang | – | Pembayaran › Closed Bill › READ, LUNASKAN |
| Laporan | `bayar_shift_kasir` (untuk Closing Kasir) | Pembayaran › Laporan Pembayaran › Kunjungan, Closing Kasir › READ, CETAK LAPORAN |
| Voucher | `bayar_diskon_voucher` | Datamaster › Voucher |
| Penjamin dan tarif | – | Datamaster › Penjamin; Datamaster › Tarif |

## Lihat juga

- [Pendaftaran & Antrian](/modul/pendaftaran-antrian#penjamin): pemilihan penjamin saat pendaftaran.
- [Farmasi & Stok](/modul/farmasi-stok): biaya obat dan penjualan bebas.
- [BPJS Kesehatan](/integrasi/bpjs)
