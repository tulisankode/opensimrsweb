# Kebijakan Keamanan

OpenSIMRS mengelola data kesehatan, sehingga keamanan data pasien adalah prioritas utama proyek ini. Halaman ini menjelaskan versi yang didukung, cara melaporkan kerentanan secara privat, dan praktik keamanan untuk kontributor serta implementator yang memasang OpenSIMRS di faskes.

## Versi yang didukung

| Versi | Didukung |
|---|---|
| Rilis terbaru (`1.0.0-alpha.x`) dan branch `main` | Ya |
| Versi sebelumnya | Tidak |

Selama status alfa, perbaikan keamanan hanya dirilis untuk versi terbaru. Perbarui instalasi Anda secara berkala; caranya ada di [Pembaruan & Cadangan](/memulai/pembaruan-cadangan).

## Melaporkan kerentanan

::: danger Jangan laporkan di tempat publik
**Jangan** melaporkan kerentanan lewat GitHub Issues, Pull Request publik, atau kanal komunitas (Telegram, Discord, WhatsApp). Kerentanan yang diumumkan sebelum diperbaiki bisa dimanfaatkan untuk menyerang faskes yang sedang memakai OpenSIMRS.
:::

Kirim laporan secara privat ke **[dev@opensimrs.com](mailto:dev@opensimrs.com)** dengan isi:

- deskripsi singkat kerentanan;
- langkah reproduksi, memakai [data demo](/memulai/data-demo), **bukan** data pasien nyata;
- versi/commit OpenSIMRS dan cara instalasi;
- potensi dampak;
- bukti pendukung bila ada, tanpa kredensial dan data pasien.

### Waktu tanggapan

| Tahap | Target |
|---|---|
| Tanda terima | Paling lambat 48 jam |
| Penilaian awal | Paling lambat 5 hari kerja |
| Perbaikan/mitigasi | Sesuai tingkat keparahan; pelapor dikabari perkembangannya |

Setelah perbaikan dirilis, kerentanan dicatat di [CHANGELOG](/pendahuluan/catatan-rilis) bagian **Keamanan**. Perbaikan celah keamanan tidak dikerjakan di PR publik sebelum dirilis; maintainer memakai *GitHub Security Advisory* (private fork).

### Pengungkapan bertanggung jawab

Kami menghargai pelapor keamanan dan akan mencantumkan kredit di catatan rilis bila pelapor mengizinkan. Mohon beri kami waktu memperbaiki sebelum kerentanan diungkapkan ke publik.

## Praktik keamanan saat deploy

Daftar berikut berlaku untuk implementator yang memasang OpenSIMRS di server faskes, dan juga untuk kontributor di lingkungan pengembangan.

### Rahasia dan kunci

- Simpan kredensial hanya di berkas `.env` (yang tidak pernah di-commit) atau di secret manager.
- Buat `SECRET_KEY` dan kunci API internal secara acak, berbeda di setiap lingkungan (development, staging, production):

  ```bash
  openssl rand -hex 32
  ```

- `SECRET_KEY` dipakai untuk JWT HS256 dan **harus sama di semua layanan** dalam satu instalasi. Lihat [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin).
- Kredensial integrasi per faskes (SATUSEHAT, BPJS, LIS) diisi lewat menu **Setting**, bukan ditulis di kode.
- Bila rahasia bocor atau terlanjur di-commit, **rotasi** segera lalu kabari maintainer secara privat. Menghapusnya di commit berikutnya tidak cukup.

### Jaringan

- Pakai **HTTPS** untuk akses aplikasi. Lihat [Akses Lewat Domain](/memulai/akses-domain).
- **Jangan membuka port database ke luar server**: PostgreSQL (5432), MongoDB (27017), dan Redis (6379).

### Data

- Jangan menyimpan atau memakai data pasien nyata untuk pengujian; gunakan data demo.
- Jangan menjalankan `npm run db:demo:seed` atau `npm run db:demo:reset` di server yang berisi data nyata. `db:demo:reset` menghapus seluruh data faskes dan pasien.
- Buat cadangan PostgreSQL dan MongoDB secara rutin dan uji pemulihannya. Lihat [Pembaruan & Cadangan](/memulai/pembaruan-cadangan) dan [Spesifikasi Hardware](/memulai/spesifikasi-hardware#cadangan-3-2-1).

### Dependensi

- Periksa dependensi secara berkala dan perbarui bila ada kerentanan yang diketahui.

::: tip Daftar periksa singkat sebelum go-live
- [ ] Semua `.env` berisi rahasia acak baru, bukan nilai contoh.
- [ ] `SECRET_KEY` sama di semua layanan dan berbeda dari lingkungan lain.
- [ ] Port 5432, 27017, dan 6379 tidak terbuka ke luar server.
- [ ] Aplikasi hanya diakses lewat HTTPS.
- [ ] Data demo tidak ada di server produksi.
- [ ] Cadangan harian berjalan dan pernah diuji pulihkan.
:::

## Kepatuhan

OpenSIMRS dirancang untuk membantu faskes memenuhi ketentuan Kementerian Kesehatan (termasuk ketentuan rekam medis dan SATUSEHAT), BPJS Kesehatan, dan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.

::: warning Tanggung jawab penyelenggara faskes
OpenSIMRS menyediakan alat. Kepatuhan di setiap faskes (persetujuan pasien, pengamanan server, cadangan, dan pengaturan akses) tetap menjadi tanggung jawab penyelenggara faskes.
:::

## Lihat juga

- [Panduan Kontribusi › Aturan data dan keamanan](/pendahuluan/kontribusi#aturan-data-dan-keamanan)
- [Kode Etik](/komunitas/kode-etik)
- [Deployment](/memulai/deployment)
- [Audit Trail](/arsitektur/audit-trail)
