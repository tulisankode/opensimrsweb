# BPJS Kesehatan

Halaman ini untuk tim IT faskes yang menyambungkan OpenSIMRS ke layanan BPJS Kesehatan: **VClaim** untuk rumah sakit/klinik utama (FKRTL), **PCare** untuk FKTP, dan **Antrean Online** (Mobile JKN). Setelah mengikuti halaman ini, Anda tahu modul mana yang perlu dinyalakan, kredensial apa yang harus diminta dari BPJS, cara mengisinya, dan batasan yang masih berlaku.

Semua integrasi BPJS dilayani `bpjs-service` (port `8098`, awalan `/api/v3/bpjs`).

## Gambaran

| Integrasi | Untuk | Modul / fitur katalog | Yang dikerjakan |
|---|---|---|---|
| **VClaim** | FKRTL (rumah sakit, klinik utama) | Modul `bpjs_fkrtl` | Cek peserta, rujukan, referensi, pembuatan & penghapusan SEP, pemetaan poli |
| **Rencana Kontrol & SPRI** | FKRTL | Fitur `vclaim_rencana_kontrol` (modul `bpjs_fkrtl`, mati bawaan) | Surat kontrol dan Surat Perintah Rawat Inap lewat VClaim |
| **PCare** | FKTP (praktik mandiri, klinik pratama, puskesmas) | Modul `bpjs_fktp` | Cek peserta, referensi, pengiriman pendaftaran & kunjungan rawat jalan BPJS |
| **MCU PCare** | FKTP dengan modul MCU | Fitur `mcu_pcare` (syarat modul `bpjs_fktp`) | Pelaporan hasil MCU peserta JKN |
| **Antrean Online** | FKRTL atau FKTP | Fitur `antrian_online_bpjs` (modul `antrian`, mati bawaan) | Web service antrean yang dipanggil Mobile JKN, pencatatan task id, monitoring |

Modul dan fitur dinyalakan superadmin di **Setting › Manajemen Modul**. Lihat [Manajemen Modul & Fitur](/arsitektur/manajemen-modul).

## Prasyarat dari BPJS

Sebelum mengisi apa pun di OpenSIMRS, siapkan hal berikut bersama kantor cabang BPJS Kesehatan:

- **Kredensial web service** faskes Anda:
  - VClaim: Cons ID, Secret Key, User Key VClaim, dan Kode PPK rumah sakit;
  - PCare: Cons ID, Secret Key, User Key PCare, username dan password PCare, Kode Provider (PPK), serta Kode Aplikasi;
  - Antrean Online: URL WS Antrean, Cons ID, Secret Key, dan User Key.
- **Akses sandbox** (lingkungan pengembangan BPJS) untuk uji coba sebelum produksi.
- **Koneksi keluar** dari server ke API BPJS. API BPJS hanya menerima koneksi dari IP Indonesia, jadi pastikan server keluar lewat IP publik Indonesia.
- Untuk Antrean Online: alamat publik `bpjs-service` yang bisa dijangkau BPJS (lihat [Antrean Online](#antrean-online-mobile-jkn)).

::: warning Kredensial tidak ditaruh di `.env`
Cons ID, Secret Key, User Key, dan sandi PCare diisi **per faskes** di aplikasi, bukan di berkas `.env`. Jangan pernah menuliskan nilainya di dokumentasi, tiket, atau tangkapan layar.
:::

## Mengisi kredensial

1. Masuk sebagai pengguna yang berhak mengatur integrasi.
2. Buka **Setting › Konfigurasi Integrasi**, lalu pilih bagian yang sesuai:
   - **BPJS › BPJS VClaim**;
   - **BPJS › BPJS PCare**;
   - **BPJS › Antrean Online (Mobile JKN)**.
3. Isi kolom kredensial, pilih **Status** aktif, lalu klik **Simpan**.
4. Klik **Uji Koneksi** (VClaim dan PCare) untuk memastikan kredensial diterima BPJS.

Perilaku penyimpanan:

- Rahasia (Secret Key, User Key, password PCare) disimpan **terenkripsi** di database. Kuncinya `BPJS_KUNCI_RAHASIA`, atau `SECRET_KEY` bila variabel itu kosong.
- Browser hanya menerima nilai tersamar (4 karakter terakhir).
- Kolom rahasia yang dikosongkan saat menyunting berarti **tidak diubah**.

::: danger Jangan mengganti kunci enkripsi
Setelah kredensial tersimpan, jangan mengganti `BPJS_KUNCI_RAHASIA` atau `SECRET_KEY`. Data lama tidak bisa dibaca lagi dan harus diisi ulang.
:::

### Variabel lingkungan `bpjs-service`

Variabel ini mengatur perilaku layanan, bukan kredensial faskes.

| Variabel | Bawaan | Fungsi |
|---|---|---|
| `BPJS_MODE` | `nyata` | `mock` = respons tiruan untuk pengujian tanpa BPJS |
| `BPJS_LINGKUNGAN` | `development` | `development` = sandbox BPJS, `production` = produksi |
| `BPJS_KUNCI_RAHASIA` | `SECRET_KEY` | Kunci enkripsi rahasia BPJS di database |
| `BPJS_PEKERJA` | aktif | `false` mematikan pengiriman otomatis PCare |
| `BPJS_INTERVAL_MENIT` | `10` | Jeda pengiriman otomatis PCare |
| `BPJS_RENTANG_HARI` | `3` | Rentang hari kunjungan yang diproses pekerja PCare |
| `BPJS_MAKS_PERCOBAAN` | `5` | Batas percobaan ulang PCare |
| `BPJS_ANTREAN_PEKERJA` | aktif | `false` mematikan pekerja Antrean Online |
| `BPJS_ANTREAN_INTERVAL_MENIT` | `2` | Jeda pekerja Antrean Online |
| `BPJS_TIMEOUT_MS` | `30000` | Batas waktu permintaan ke BPJS |

Ubah ke `BPJS_MODE=nyata` dan `BPJS_LINGKUNGAN=production` hanya di server produksi dan setelah uji di sandbox lulus.

## VClaim (FKRTL)

Setelah modul `bpjs_fkrtl` aktif dan kredensial VClaim tersimpan, petugas dapat:

- **Cek peserta** dengan nomor kartu (13 digit) atau NIK (16 digit) pada tanggal SEP;
- melihat **rujukan aktif** peserta dari FKTP maupun dari rumah sakit lain;
- mencari **referensi** diagnosa, poli, dan dokter;
- **membuat SEP** dan **menghapus SEP**, serta melihat daftar SEP;
- mengatur **pemetaan poli** OpenSIMRS ke kode poli VClaim di **Setting › Konfigurasi Integrasi › BPJS › BPJS VClaim**.

Lakukan pemetaan poli sebelum membuat SEP pertama.

### Rencana Kontrol & SPRI

Fitur **Rencana Kontrol & SPRI** (`vclaim_rencana_kontrol`) mati bawaan. Setelah diaktifkan, petugas dapat membuat, mengubah, menghapus, dan memeriksa status surat kontrol dan SPRI dari menu Admisi (`/admisi/rencana-kontrol`, `/admisi/spri`).

Hal yang perlu diketahui:

- Setiap aksi butuh izin **Admisi › Rencana Kontrol & SPRI** (READ, CREATE/UPDATE/DELETE RENCANA KONTROL, CREATE/UPDATE/DELETE SPRI). Memakai surat untuk SEP butuh aksi **PILIH SURAT SEP**.
- Nomor surat berasal dari VClaim. Surat baru tercatat bernomor setelah VClaim mengonfirmasinya.
- Bila koneksi terputus di tengah proses, status surat menjadi *tidak pasti*. Gunakan **Cek status di VClaim** untuk menyelaraskannya sebelum mencoba ulang.
- Fitur diperiksa secara *fail-closed*: bila status fitur tidak bisa dibaca dari `setting-service`, permintaan ditolak.

::: warning Belum diverifikasi ke spesifikasi resmi
Jalur dan isi permintaan Rencana Kontrol/SPRI belum diverifikasi ke katalog resmi VClaim. Di luar `BPJS_MODE=mock`, operasi ini **ditolak sebelum menghubungi BPJS** sampai administrator menyalakan `BPJS_VCLAIM_RENKON_DIKONFIRMASI=true` setelah jalur dan isi permintaan dipastikan di sandbox.
:::

## PCare (FKTP)

Setelah modul `bpjs_fktp` aktif dan kredensial PCare tersimpan:

1. Buka **Setting › Konfigurasi Integrasi › BPJS › BPJS PCare**.
2. Klik **Uji Koneksi**, lalu coba **Cek Peserta JKN** dengan nomor kartu atau NIK.
3. Petakan **poli dan dokter** OpenSIMRS ke kode BPJS di bagian pemetaan.
4. Pantau pengiriman di bagian sinkronisasi.

Pengiriman pendaftaran dan kunjungan rawat jalan BPJS berjalan dua cara:

- **otomatis**: pekerja di `bpjs-service` memproses kunjungan yang belum terkirim setiap `BPJS_INTERVAL_MENIT` menit, untuk kunjungan dalam `BPJS_RENTANG_HARI` hari terakhir, sampai `BPJS_MAKS_PERCOBAAN` kali;
- **manual**: tombol kirim per kunjungan, atau **jalankan sekarang** untuk faskes Anda.

Kunjungan yang gagal karena data atau konfigurasi belum lengkap menampilkan pesannya. Perbaiki datanya, lalu kirim ulang.

### Pelaporan MCU PCare

Fitur **MCU PCare (BPJS)** (`mcu_pcare`) melaporkan hasil MCU peserta JKN ke layanan MCU PCare: tambah, ubah, hapus, status, dan kirim ulang. Pelaporan dimulai dari modul MCU (`penunjang-service`), yang meneruskan permintaan ke `bpjs-service` dengan token pengguna.

::: warning Pemetaan masih draf
Pemetaan field MCU PCare belum dikonfirmasi ke spesifikasi resmi PCare. Di luar `BPJS_MODE=mock`, pengiriman ditolak sampai administrator menyalakan `BPJS_MCU_PCARE_DIKONFIRMASI=true` setelah pemetaan dipastikan.
:::

## Antrean Online (Mobile JKN)

Fitur **Antrean Online BPJS (Mobile JKN)** (`antrian_online_bpjs`) mati bawaan dan membutuhkan modul BPJS FKRTL atau BPJS FKTP aktif. Ada dua sisi:

**1. Web service yang dipanggil BPJS.** OpenSIMRS membuka endpoint di `/api/v3/bpjs/antrean/ws/`:

| Metode | Path | Keterangan |
|---|---|---|
| `POST` | `/api/v3/bpjs/antrean/ws/token` | Menerbitkan token WS. BPJS mengirim header `X-cons-id`, `X-timestamp`, `X-signature` |
| `POST` | `/api/v3/bpjs/antrean/ws/status-antrean` | Status antrean poli |
| `POST` | `/api/v3/bpjs/antrean/ws/ambil-antrean` | Mengambil antrean |
| `POST` | `/api/v3/bpjs/antrean/ws/sisa-antrean` | Sisa antrean |
| `POST` | `/api/v3/bpjs/antrean/ws/batal-antrean` | Membatalkan antrean |
| `POST` | `/api/v3/bpjs/antrean/ws/check-in` | Check-in pasien |
| `POST` | `/api/v3/bpjs/antrean/ws/pasien-baru` | Validasi pasien baru |
| `GET` | `/api/v3/bpjs/antrean/ws/jadwal-operasi` | Jadwal operasi (bila modul Kamar Operasi aktif) |

- Endpoint ini tidak memakai JWT login. Selain `/token`, semua wajib `Authorization: Bearer <token WS>` hasil `/token`.
- Faskes ditentukan dari Cons ID yang cocok di database, tidak pernah dari isi permintaan.
- Token WS berlaku `BPJS_ANTREAN_TOKEN_TTL` detik (bawaan 3600).

**2. Pekerja dan monitoring di OpenSIMRS.** Pekerja berkala:

- menjembatani pendaftaran JKN dari loket/APM ke catatan booking;
- mencatat **task id** dari kejadian yang sudah tersimpan (check-in, panggilan admisi, poli, dan farmasi);
- mengirim ulang data yang masih menunggu atau gagal.

Pantau hasilnya di menu **Antrian › Antrean Online BPJS** (`/antrian/monitoring-bpjs`, izin **Antrian › Antrean Online BPJS**). Kode booking yang gagal bisa dikirim ulang dari sana.

Konfigurasi Antrean punya pilihan **Mode** (simulasi atau nyata). Gunakan mode simulasi untuk uji coba.

::: warning Batasan Antrean Online
- **Ambil antrean hanya untuk pasien lama** yang datanya sudah terdaftar di OpenSIMRS. Pasien baru dari Mobile JKN diarahkan melengkapi pendaftaran di loket atau APM.
- Pemetaan task id masih sementara dan perlu disahkan terhadap kontrak WS Antrean resmi sebelum dipakai di produksi.
:::

## Pemecahan masalah

| Gejala | Penyebab / solusi |
|---|---|
| Semua permintaan ke BPJS habis waktu | Server tidak keluar lewat IP Indonesia, atau koneksi keluar diblokir firewall |
| **Uji Koneksi** gagal setelah server dipindah | `SECRET_KEY`/`BPJS_KUNCI_RAHASIA` berbeda dari saat kredensial disimpan. Isi ulang kredensial |
| "Konfigurasi belum lengkap" | Ada kolom kredensial yang masih kosong, termasuk Kode PPK/Provider |
| Rencana Kontrol/SPRI menjawab 403 | Fitur `vclaim_rencana_kontrol` belum aktif, `setting-service` tidak terjangkau, atau pengguna belum punya izin yang sesuai |
| Rencana Kontrol/SPRI atau MCU PCare ditolak sebelum terkirim | Flag `BPJS_VCLAIM_RENKON_DIKONFIRMASI` / `BPJS_MCU_PCARE_DIKONFIRMASI` belum dinyalakan |
| `/ws/token` menjawab 401 | Cons ID tidak terdaftar di faskes mana pun, konfigurasi Antrean nonaktif, atau tanda tangan salah |

## Lihat juga

- [SATUSEHAT](/integrasi/satusehat)
- [Pendaftaran & Antrian](/modul/pendaftaran-antrian)
- [Kasir & Penjamin](/modul/kasir-penjamin)
- [Konfigurasi](/memulai/konfigurasi)
- [Endpoint per Layanan](/api/layanan)
