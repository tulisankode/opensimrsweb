# Endpoint per Layanan

Halaman ini merangkum endpoint utama yang paling sering dipakai integrator: autentikasi, pasien dan pendaftaran, rawat jalan, kasir, laboratorium, laporan, serta integrasi. Daftar ini diambil dari berkas rute di kode, tetapi **tidak lengkap**. Sumber kebenaran tetap berkas `src/routes/*.js` (atau `src/routers/`, `src/rute.js`) di tiap layanan.

Semua path ditulis lengkap dari akar layanan. Kecuali disebut lain, endpoint wajib `Authorization: Bearer <token>` (lihat [Autentikasi](/api/autentikasi)) dan berlaku untuk faskes yang tertera di token. Kolom **Izin** hanya diisi bila pemeriksaan izinnya jelas di kode rute; endpoint lain tetap dapat memeriksa izin di dalam controller.

## Auth — `auth-service` (8083)

| Metode | Path | Keterangan | Izin |
|---|---|---|---|
| `POST` | `/api/v3/auth/login` | Login, menghasilkan token dan refresh token | Publik |
| `POST` | `/api/v3/auth/refresh-token` | Memperbarui token (body `refresh_token`, `token`) | Publik |
| `DELETE` | `/api/v3/auth/logout` | Logout, menghapus sesi | Login |
| `PUT` | `/api/v3/auth/token/:faskes` | Token baru untuk faskes lain | Peran `super admin` |
| `GET` | `/api/v3/auth/user` | Daftar pengguna | Login |
| `POST` | `/api/v3/auth/user` | Membuat pengguna | Login |
| `PUT` | `/api/v3/auth/user/:uuid` | Mengubah pengguna | Login |
| `PATCH` | `/api/v3/auth/user/:uuid` | Mengubah sandi pengguna | Login |
| `DELETE` | `/api/v3/auth/user/:uuid` | Menghapus pengguna (*soft delete*) | Login |
| `GET` | `/api/v3/auth/permission/katalog` | Katalog izin modul (editor Role) | Login |

## Admisi — `admisi-service` (8081)

### Pasien

| Metode | Path | Keterangan |
|---|---|---|
| `GET` | `/api/v3/admisi/patient` | Daftar pasien. Query: `page`, `limit`, `q` (nama, No. RM, NIK, alamat), `status` (`aktif`/`nonaktif`/`semua`) |
| `GET` | `/api/v3/admisi/patient/:uuid` | Detail pasien |
| `POST` | `/api/v3/admisi/patient` | Mendaftarkan pasien baru |
| `PUT` | `/api/v3/admisi/patient/:uuid` | Mengubah data pasien |
| `GET` | `/api/v3/admisi/patient/history/:uuid` | Riwayat pelayanan pasien |
| `GET` | `/api/v3/admisi/patient/internal/identity-check` | Cek nomor identitas |
| `POST` | `/api/v3/admisi/patient/import` | Impor pasien dari berkas |

### Kunjungan

| Metode | Path | Keterangan |
|---|---|---|
| `GET` | `/api/v3/admisi/rawat-jalan` | Daftar kunjungan rawat jalan |
| `GET` | `/api/v3/admisi/rawat-jalan/today` | Kunjungan rawat jalan hari ini |
| `POST` | `/api/v3/admisi/rawat-jalan` | Mendaftarkan kunjungan rawat jalan |
| `GET` | `/api/v3/admisi/rawat-jalan/:uuid` | Detail kunjungan |
| `PUT` | `/api/v3/admisi/rawat-jalan/:uuid` | Mengubah kunjungan |
| `DELETE` | `/api/v3/admisi/rawat-jalan/cancel` | Membatalkan kunjungan |
| `GET` | `/api/v3/admisi/rawat-jalan/jadwal-dokter` | Jadwal dokter untuk pendaftaran |
| `POST` | `/api/v3/admisi/igd` | Mendaftarkan kunjungan IGD |
| `GET` | `/api/v3/admisi/igd` | Daftar kunjungan IGD |
| `POST` | `/api/v3/admisi/rawat-inap` | Mendaftarkan rawat inap |
| `POST` | `/api/v3/admisi/rawat-inap/spri` | Mendaftarkan rawat inap dari SPRI |
| `GET` | `/api/v3/admisi/rawat-inap` | Daftar rawat inap |
| `GET` | `/api/v3/admisi/monitoring-rooms` | Status kamar dan tempat tidur |

### Rekap & laporan admisi

| Metode | Path | Keterangan |
|---|---|---|
| `GET` | `/api/v3/admisi/report/kunjungan` | Laporan kunjungan |
| `GET` | `/api/v3/admisi/rekap/jenis-kunjungan` | Rekap per jenis kunjungan |
| `GET` | `/api/v3/admisi/rekap/dokter` | Rekap per dokter |
| `GET` | `/api/v3/admisi/rekap/penjamin` | Rekap per penjamin |
| `GET` | `/api/v3/admisi/export/kunjungan` | Ekspor kunjungan |

### Mobile (kunci API, tanpa JWT)

Wajib header `x-api-key` dan `faskes-uuid` (kecuali `jadwal-pemeriksaan`, cukup `x-api-key`).

| Metode | Path | Keterangan |
|---|---|---|
| `POST` | `/api/v3/admisi/patient/check-patient` | Cek pasien terdaftar |
| `GET` | `/api/v3/admisi/rawat-jalan/mobile` | Daftar kunjungan |
| `GET` | `/api/v3/admisi/rawat-jalan/mobile/today` | Kunjungan hari ini |
| `POST` | `/api/v3/admisi/rawat-jalan/mobile` | Mendaftarkan kunjungan dari aplikasi mobile |
| `DELETE` | `/api/v3/admisi/rawat-jalan/mobile/cancel` | Membatalkan kunjungan |
| `GET` | `/api/v3/admisi/rawat-jalan/mobile/jadwal-pemeriksaan/:uuid` | Jadwal pemeriksaan |

## Antrian — `antrian-service` (8082)

| Metode | Path | Keterangan |
|---|---|---|
| `GET` | `/api/v3/antrian/jadwal-dokter/` | Daftar jadwal dokter |
| `POST` | `/api/v3/antrian/apm/register` | Pendaftaran lewat APM |
| `POST` | `/api/v3/antrian/apm/check-in` | Check-in pasien |
| `POST` | `/api/v3/antrian/apm/print-antrian` | Cetak nomor antrian |
| `GET` | `/api/v3/antrian/mobile/jadwal-dokter/` | Jadwal dokter (kunci API) |
| `GET` | `/api/v3/antrian/mobile/jadwal-dokter/available-kuota` | Sisa kuota (kunci API) |
| `POST` | `/api/v3/antrian/mobile/admisi-antrian/` | Membuat antrian dari mobile (kunci API) |
| `DELETE` | `/api/v3/antrian/mobile/report-antrian/cancel-booking` | Membatalkan booking (kunci API) |

## Rawat Jalan — `rawat-jalan-service` (8092)

Pendaftaran kunjungan rawat jalan ada di `admisi-service`, sedangkan isi pemeriksaan (asesmen, diagnosis, tindakan) ada di `rekamedis-service`. Layanan ini menangani panggilan antrian poli dan laporan.

| Metode | Path | Keterangan |
|---|---|---|
| `GET` | `/api/v3/rajal/antrian-call` | Daftar antrian poli |
| `GET` | `/api/v3/rajal/antrian-call/konteks` | Konteks petugas (poli/dokter) |
| `PUT` | `/api/v3/rajal/antrian-call/:uuid` | Mengubah status panggilan |
| `PUT` | `/api/v3/rajal/antrian-call/kunjungan/:rawatJalanUuid/periksa` | Mulai memeriksa pasien |
| `GET` | `/api/v3/rajal/report/kunjungan` | Laporan kunjungan rawat jalan |
| `GET` | `/api/v3/rajal/report/batal-kunjungan` | Laporan kunjungan batal |
| `GET` | `/api/v3/rajal/report/laporan-tindakan` | Laporan tindakan |

## Kasir — `payment-service` (8089)

Batas laju: 100 permintaan per 5 menit per IP.

| Metode | Path | Keterangan |
|---|---|---|
| `GET` | `/api/v3/payment/cashier/check` | Status kasir (shift terbuka/tertutup) |
| `POST` | `/api/v3/payment/cashier/open` | Membuka shift kasir |
| `POST` | `/api/v3/payment/cashier/close` | Menutup shift kasir |
| `POST` | `/api/v3/payment/cashier/close/day` | Tutup hari |
| `GET` | `/api/v3/payment/payment` | Mencari tagihan |
| `GET` | `/api/v3/payment/:uuid` | Detail tagihan |
| `GET` | `/api/v3/payment/:uuid/items` | Item tagihan |
| `POST` | `/api/v3/payment/:uuid/discount` | Memberi diskon |
| `POST` | `/api/v3/payment/:uuid/voucher` | Memakai voucher |
| `POST` | `/api/v3/payment/:uuid/close` | Menutup tagihan |
| `POST` | `/api/v3/payment/:uuid/payment` | Memproses pembayaran |
| `GET` | `/api/v3/payment/closed-bills` | Tagihan tertutup (termasuk piutang) |
| `POST` | `/api/v3/payment/closed-bills/:uuid/pay` | Membayar piutang |
| `GET` | `/api/v3/payment/report/cashier` | Laporan kasir |
| `GET` | `/api/v3/payment/report/payment` | Laporan pembayaran |
| `GET` | `/api/v3/payment/report/revenue` | Laporan pendapatan |
| `GET` | `/api/v3/payment/mobile-patient/bills` | Tagihan pasien untuk aplikasi mobile |

## Laboratorium — `lab-service` (8087)

| Metode | Path | Keterangan | Izin |
|---|---|---|---|
| `GET` | `/api/v3/lab/order-lab` | Daftar order lab | – |
| `POST` | `/api/v3/lab/order-lab` | Membuat order lab | – |
| `GET` | `/api/v3/lab/order-lab/:uuid` | Detail order | – |
| `PUT` | `/api/v3/lab/order-lab-validasi/:uuid` | Validasi order | – |
| `PUT` | `/api/v3/lab/order-lab-batal` | Membatalkan order | – |
| `POST` | `/api/v3/lab/hasil-pemeriksaan` | Menyimpan hasil | – |
| `GET` | `/api/v3/lab/hasil-pemeriksaan/:uuid` | Membaca hasil | – |
| `POST` | `/api/v3/lab/expertise/:uuid` | Expertise dokter | – |
| `GET` | `/api/v3/lab/laporan-tat` | Laporan TAT | – |
| `GET` | `/api/v3/lab/rekap-pemeriksaan` | Rekap pemeriksaan | – |
| `POST` | `/api/v3/lab/lis/kirim/:orderUuid` | Kirim order ke LIS | Laboratorium › Order Lab › VALIDASI ORDER |
| `GET` | `/api/v3/lab/lis/kirim/:orderUuid` | Status kirim order ke LIS | Order Lab/Hasil Pemeriksaan READ |
| `POST` | `/api/v3/lab/lis/tarik/:orderUuid` | Menarik hasil dari LIS | Laboratorium › Hasil Pemeriksaan › SIMPAN HASIL |
| `POST` | `/api/v3/lab/lis/batch` | Kirim/ambil hasil/cek status massal (asinkron, `202`) | Sesuai `sumber` (`lab` atau `mcu`) |
| `POST` | `/api/v3/lab/lis/hasil` | Titik masuk hasil dari LIS (kunci masuk, tanpa JWT) | Kunci masuk koneksi |

## Laporan & dashboard — `laporan-service` (8088)

| Metode | Path | Keterangan | Izin |
|---|---|---|---|
| `GET` | `/api/v3/laporan/dashboard/rekap` | Rekap dashboard lengkap | – |
| `GET` | `/api/v3/laporan/dashboard/rekap/rawat-jalan` | Total kunjungan rawat jalan | – |
| `GET` | `/api/v3/laporan/dashboard/rekap/pasien` | Total kunjungan pasien | – |
| `GET` | `/api/v3/laporan/dashboard/rekap/pendapatan` | Total pendapatan | – |
| `GET` | `/api/v3/laporan/dashboard/rekap/poli` | Poli teratas | – |
| `GET` | `/api/v3/laporan/dashboard/rekap/dpjp` | DPJP teratas | – |
| `GET` | `/api/v3/laporan/dashboard/eksekutif` | Ringkasan Dashboard Eksekutif | Dashboard › Eksekutif › READ |
| `GET` | `/api/v3/laporan/dashboard/eksekutif/rincian/:kode` | Rincian indikator | Dashboard › Eksekutif › RINCIAN |
| `POST` | `/api/v3/laporan/dashboard/eksekutif/ekspor` | Ekspor PDF | Dashboard › Eksekutif › EKSPOR PDF |
| `PUT` | `/api/v3/laporan/dashboard/eksekutif/target` | Menyimpan target KPI | Dashboard › Eksekutif › ATUR TARGET |
| `GET` | `/api/v3/laporan/rekap/status-rawat` | Rekap status rawat | – |
| `GET` | `/api/v3/laporan/rekap/tindakan` | Rekap tindakan | – |
| `GET` | `/api/v3/laporan/rekap/pemeriksaan-lab` | Rekap pemeriksaan lab | – |
| `GET` | `/api/v3/laporan/rekap/diagnosis` | Rekap diagnosis | – |

Setiap rekap punya varian ekspor dengan akhiran `/export`, misalnya `/api/v3/laporan/rekap/diagnosis/export`.

## Setting — `setting-service` (8094)

| Metode | Path | Keterangan |
|---|---|---|
| `GET` | `/api/v3/setting/profil-faskes` | Profil faskes aktif |
| `GET` | `/api/v3/setting/modul` | Modul dan fitur yang aktif untuk faskes |
| `GET` | `/api/v3/setting/integrasi` | Konfigurasi integrasi faskes (nilai rahasia tidak untuk integrator) |
| `PUT` | `/api/v3/setting/integrasi-satu-sehat` | Menyimpan kredensial SATUSEHAT |
| `GET` | `/api/v3/setting/bantuan/status` | Status asisten Bantuan (Helpdesk AI) |
| `GET` | `/api/v3/setting/bantuan/ringkasan` | Ringkasan pemakaian Bantuan (superadmin) |

## Integrasi BPJS — `bpjs-service` (8098)

| Metode | Path | Keterangan | Izin |
|---|---|---|---|
| `GET` | `/api/v3/bpjs/vclaim/peserta/:nomor` | Cek peserta (`?tgl=yyyy-mm-dd`) | Login |
| `GET` | `/api/v3/bpjs/vclaim/rujukan/:noKartu` | Rujukan aktif peserta | Login |
| `GET` | `/api/v3/bpjs/vclaim/sep` | Daftar SEP | Login |
| `POST` | `/api/v3/bpjs/vclaim/sep` | Membuat SEP | Login; memakai surat butuh Admisi › Rencana Kontrol & SPRI › PILIH SURAT SEP |
| `DELETE` | `/api/v3/bpjs/vclaim/sep/:noSep` | Menghapus SEP | Login |
| `GET`/`POST` | `/api/v3/bpjs/vclaim/rencana-kontrol` | Daftar / membuat Rencana Kontrol | Admisi › Rencana Kontrol & SPRI (READ / CREATE RENCANA KONTROL) |
| `GET`/`POST` | `/api/v3/bpjs/vclaim/spri` | Daftar / membuat SPRI | Admisi › Rencana Kontrol & SPRI (READ / CREATE SPRI) |
| `GET` | `/api/v3/bpjs/pcare/peserta/:nomor` | Cek peserta PCare | Login |
| `GET` | `/api/v3/bpjs/pcare/kunjungan` | Daftar kunjungan BPJS dan status kirim PCare | Login |
| `POST` | `/api/v3/bpjs/pcare/kunjungan/:uuid/kirim` | Kirim satu kunjungan ke PCare | Login |
| `GET` | `/api/v3/bpjs/antrean/monitoring` | Monitoring Antrean Online | Login |
| `POST` | `/api/v3/bpjs/antrean/ws/token` | Token WS Antrean untuk BPJS | Tanda tangan Cons ID |

Endpoint WS Antrean lengkap ada di [BPJS Kesehatan](/integrasi/bpjs#antrean-online-mobile-jkn).

## Integrasi SATUSEHAT — `satusehat-service` (8097)

| Metode | Path | Keterangan |
|---|---|---|
| `GET` | `/api/v3/satusehat/status` | Ringkasan konfigurasi dan jumlah catatan per status |
| `POST` | `/api/v3/satusehat/uji-koneksi` | Uji kredensial faskes |
| `GET` | `/api/v3/satusehat/sinkron` | Daftar kunjungan RJ selesai beserta status kirim (`page`, `limit`, `status`, `q`) |
| `POST` | `/api/v3/satusehat/sinkron/rawat-jalan/:uuid` | Kirim satu kunjungan |
| `POST` | `/api/v3/satusehat/pekerja/jalankan` | Jalankan pengiriman otomatis sekarang |

## Penunjang — `penunjang-service` (8099)

Layanan ini memuat banyak modul penunjang dengan awalan `/api/v3/penunjang/{fisioterapi|radiologi|mcu|patologi|mikrobiologi|cssd|bank-darah|utd|gizi|ambulans|hemodialisa}/...`. Titik masuk hasil dari sistem mitra (tanpa JWT, kunci masuk per koneksi):

| Metode | Path | Keterangan |
|---|---|---|
| `POST` | `/api/v3/penunjang/radiologi/pacs/hasil` | Hasil dari PACS/RIS (alias `/adam-pacs/bridging`) |
| `POST` | `/api/v3/penunjang/patologi/lis/hasil` | Hasil dari sistem PA (alias `/adam-pa-lis/bridging`) |
| `POST` | `/api/v3/penunjang/mikrobiologi/lis/hasil` | Hasil dari LIS Mikrobiologi (alias `/adam-lis/mikrobiologi/bridging`) |
| `POST` | `/api/v3/penunjang/hemodialisa/hdis/masuk` | Parameter mesin dari HDIS (alias `/adam-hdis/bridging`) |

Lihat [LIS & PACS](/integrasi/lis-pacs) dan [HDIS](/integrasi/hdis).

## Layanan lain

Endpoint `datamaster-service`, `rekamedis-service`, `farmasi-service`, `stok-farmasi-service`, `inventory-service`, `igd-service`, `rawat-inap-service`, `program-puskesmas-service`, dan `studio-service` dapat dibaca langsung di folder rute masing-masing. Dokumen `docs/API_DOCUMENTATION.md` di repo memuat ringkasan tambahan untuk 15 layanan inti, tetapi beberapa bagiannya sudah tidak sesuai kode; bila berbeda, **ikuti kode rute**.

## Lihat juga

- [Ringkasan API](/api/)
- [Autentikasi](/api/autentikasi)
- [Konvensi API](/arsitektur/konvensi-api)
- [Struktur Direktori](/memulai/struktur-direktori)
