# Catatan Rilis

Halaman ini merangkum perubahan penting OpenSIMRS per versi, terbaru di atas. Rincian lengkap setiap perubahan, termasuk daftar migrasi database, ada di [CHANGELOG.md di GitHub](https://github.com/tulisankode/opensimrs/blob/main/CHANGELOG.md).

::: tip Setiap kali memperbarui
Setiap migrasi database baru selalu disebut di catatan rilis. Jalankan `npm run db:migrate` setiap kali memperbarui OpenSIMRS.
:::

## Skema versi

OpenSIMRS memakai [Semantic Versioning](https://semver.org/lang/id/) `MAYOR.MINOR.PATCH`. Satu nomor versi berlaku untuk seluruh monorepo: semua layanan, frontend, SDK, dan migrasi dirilis bersama.

| Bagian | Naik bila | Contoh |
|---|---|---|
| **MAYOR** | Ada perubahan tidak kompatibel: struktur data, kontrak API antar-layanan, atau langkah instalasi yang wajib diubah | `1.x` → `2.0.0` |
| **MINOR** | Ada modul/fitur baru yang kompatibel ke belakang | `1.0.0` → `1.1.0` |
| **PATCH** | Hanya perbaikan bug dan keamanan | `1.1.0` → `1.1.1` |

Sumber versi hanya satu: field `version` di `package.json` root, tag git `vX.Y.Z`, dan judul bagian di `CHANGELOG.md` selalu sama. Versi hanya dinaikkan oleh Core Maintainer saat rilis; kontributor tidak mengubah nomor versi di PR biasa.

### Tahap pra-rilis

| Tahap | Contoh | Arti | Perubahan tidak kompatibel |
|---|---|---|---|
| **alpha** | `1.0.0-alpha.1`, `-alpha.2` | Fitur masih bertambah. Belum disarankan untuk produksi tanpa uji paralel. Dirilis kira-kira tiap 2–4 minggu atau tiap tonggak roadmap. | Boleh, asalkan dicatat di kategori *Diubah* dengan awalan **⚠ Tidak kompatibel** beserta langkah pembaruan |
| **beta** | `1.0.0-beta.1` | Fitur untuk segmen sasaran sudah lengkap. Fokus stabilisasi dan uji di faskes percontohan. | Hanya bila tidak ada jalan lain, dengan persetujuan Core Maintainer |
| **rc** | `1.0.0-rc.1` | Kandidat rilis. Hanya perbaikan bug P1/P2 dan keamanan. | Tidak boleh |
| **stabil** | `1.0.0`, `1.1.0` | SemVer penuh | Hanya di rilis MAYOR |

Perpindahan tahap diputuskan Core Maintainer dan diumumkan di [kanal komunitas](/komunitas/).

### Versi SDK dan API

- SDK di `packages/*` (`@opensimrs/model-sdk`, `authorization-sdk`, `permission-sdk`) punya versi SemVer sendiri dan dinaikkan di PR yang mengubah SDK. SDK ini tidak diterbitkan ke npm.
- Semua layanan memakai awalan `/api/v3`. Awalan ini hanya naik (`/api/v4`) pada rilis MAYOR.
- Endpoint yang dipakai pihak luar (aplikasi mobile, integrasi, LIS) tidak diubah secara tidak kompatibel tanpa masa transisi: field atau endpoint baru ditambahkan, yang lama ditandai *Usang*, lalu dihapus paling cepat satu rilis MINOR kemudian (atau satu rilis alpha/beta pada fase pengembangan).

### Branch dan tag

| Branch | Fungsi |
|---|---|
| `main` | Garis pengembangan utama dan selalu sehat. Rilis alpha ditandai langsung dari sini. |
| `release/X.Y` | Dibuat saat masuk tahap **beta** untuk stabilisasi dan rilis PATCH. |

Selama tahap alpha **tidak ada** branch `release/*`. Branch `develop`, `staging`, atau `production` tidak dipakai, karena lingkungan staging dan production memasang **tag rilis**, bukan branch. Tag tidak pernah dipindah atau dihapus setelah di-push; bila ada kesalahan, versi berikutnya yang dirilis.

### Kategori perubahan

Format catatan mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/) dengan kategori berbahasa Indonesia: **Ditambahkan**, **Diubah**, **Usang**, **Dihapus**, **Diperbaiki**, dan **Keamanan**.

## Belum dirilis

Perubahan yang sudah masuk `main` tetapi belum ditandai versi. Sorotan:

- **Modul rumah sakit baru**: Kamar Operasi, ICU / Intensif, Gizi, CSSD (sterilisasi & pelacakan set instrumen), Bank Darah RS (BDRS) beserta bridging ke UTD, UTD / UPTD Produksi Darah, Koding & Rekam Medis, Unit Hemodialisa beserta bridging HDIS.
- **Program Puskesmas** (layanan baru `program-puskesmas-service`): KIA/KB, imunisasi, MTBS/MTBM, sasaran program, kegiatan UKM, dan laporan dinkes.
- **Penunjang umum dan manajemen**: Laundry & Linen (termasuk pelacakan per unit dengan QR/barcode), Sarana dan Prasarana (IPSRS), Manajemen Ambulans, HR / SDM (kepegawaian dan kredensial), Mutu & Akreditasi, serta Kelas Training.
- **Integrasi**: bridging PACS/RIS untuk radiologi, bridging LIS untuk Mikrobiologi dan Patologi Anatomi, Lab Rujukan, Rencana Kontrol & SPRI via VClaim, Antrean Online BPJS (Mobile JKN), MCU PCare, dan pembelian BMHP via marketplace mitra.
- **Audit Trail terpusat** (Setting › Audit Trail) dengan rantai hash per faskes.
- **SIMRS Studio**: mode pengembang berbasis AI (layanan `studio-service`), mati secara bawaan.
- **Helpdesk asisten pengguna** (tombol Bantuan) yang terhubung ke agen OpenClaw.
- **Ekstensi tanpa kode**: laporan, template cetak, dan formulir tambahan.
- **Installer**: bilah kemajuan, opsi Podman (`install.sh --podman`), alat AI untuk SIMRS Studio, dan skrip `uninstall.sh` / `uninstall.cmd`.
- **Fragmen CHANGELOG** di `changelog.d/` sehingga PR yang berjalan bersamaan tidak lagi konflik di `CHANGELOG.md`.
- **Keamanan**: perbaikan isolasi data antar-faskes pada konteks permintaan di beberapa layanan, serta hak akses per rute untuk bridging LIS, PACS/RIS, LIS Patologi Anatomi, dan UTD.

Sebagian modul baru di atas tidak aktif di preset segmen mana pun dan perlu dinyalakan per faskes lewat **Setting › Manajemen Modul**. Periksa catatan tiap modul di CHANGELOG sebelum mengaktifkannya.

## 1.0.0-alpha.1 — 15 Oktober 2026

Rilis publik pertama sebagai **OpenSIMRS**, sebelumnya dikembangkan secara internal.

- **Satu monorepo**: frontend, layanan backend, migrasi, skrip, dan dokumen dipindah ke satu repo (sebelumnya git submodule). Riwayat commit lama tidak dibawa karena memuat berkas rahasia.
- **Rebranding identifier teknis** ke `opensimrs`: paket SDK `@opensimrs/*`, database bawaan `opensimrs`, image dan kontainer `opensimrs-*`, token warna Tailwind `opensimrs`.
- **SDK masuk monorepo** di `packages/`; JWT memakai **HS256** dengan `SECRET_KEY` bersama di semua layanan.
- **Installer** `install.sh` (macOS, Ubuntu/Debian) dan `install.cmd` (Windows 10/11) untuk instalasi lokal tanpa Docker.
- **Skrip npm root** baru: `dev`, `dev:<layanan>`, `dev:core`, `install:all`, `sdk:refresh`, `infra:up`, `stack:up`, `docs:katalog`.
- **Deploy generik** di `deploy/server/` dan CI yang menguji sintaks, uji unit, `schema.sql` + migrasi dua kali, katalog, serta build frontend.
- **`schema.sql` tanpa data pribadi**: hanya struktur dan data referensi nasional.
- **Dokumentasi komunitas**: README, Petunjuk Instalasi, Manajemen Modul, Roadmap, Panduan Kontribusi, aturan versi/branch/merge, panduan per peran kontributor, Spesifikasi Hardware, dan kanal komunitas.
- **Lisensi MIT** dan kontak resmi `dev@opensimrs.id`.
- **Keamanan**: nilai rahasia di semua `.env.example` dikosongkan, skrip berkredensial tertanam dihapus, dan dokumen tidak lagi menyebut alamat server internal.

## Versi 0.x (sebelum kode dibuka)

Versi `0.x` adalah rekonstruksi tonggak pengembangan sebelum kode dibuka, disusun dari riwayat commit. Versi ini tidak pernah dirilis sebagai paket.

| Versi | Tanggal | Sorotan |
|---|---|---|
| **0.6.0** | 14 Oktober 2026 | Layanan `penunjang-service` (Fisioterapi, Radiologi, MCU, Patologi Anatomi, Mikrobiologi), bridging LIS lanjutan dan LIS tiruan, SOAP Ringkas dan Pendaftaran Ringkas untuk praktik mandiri, data demo 8 faskes, tema warna & logo per faskes |
| **0.5.0** | 13 Oktober 2026 | Layanan `satusehat-service` dan `bpjs-service` (PCare & VClaim), Manajemen Modul berbasis segmen, antrian poli terintegrasi dengan layar TV, bridging LIS, tagihan otomatis |
| **0.4.0** | 12 Oktober 2026 | Migrasi database terpusat, CI, contoh deploy staging, cetak resep farmasi, rencana uji kesiapan rilis rumah sakit |
| **0.3.0** | 9 Februari 2026 | Dokumentasi awal: README, panduan instalasi, dokumentasi API, kode etik, tata kelola, kebijakan keamanan, manifesto |
| **0.2.0** | 31 Desember 2025 | Antrian & APM, laboratorium, laporan, farmasi lengkap, monitoring kamar & SPRI, fitur pendukung aplikasi mobile pasien, orkestrasi Docker Compose |
| **0.1.0** | 31 Desember 2024 | Fondasi: arsitektur microservice Node.js + Express dan Vue 3, layanan inti (auth, admisi, datamaster, setting, rawat jalan, rekam medis, IGD, rawat inap, pembayaran, farmasi, inventory, stok farmasi) |

## Proses rilis singkat

Rilis dilakukan oleh Core Maintainer:

1. Mengumumkan masa beku (*freeze*) 3 hari sebelum rilis alpha/beta. Selama freeze, `main` hanya menerima perbaikan bug, dokumen, dan uji.
2. Membuat PR rilis `chore(rilis): vX.Y.Z[-tahap.N]` yang menggabungkan fragmen `changelog.d/` dengan `node scripts/gabung-changelog.mjs` dan menaikkan versi di `package.json` root.
3. Membuat tag beranotasi pada commit hasil merge, lalu GitHub Release (ditandai *pre-release* untuk alpha, beta, dan rc).
4. Memasang tag di staging, menjalankan migrasi, dan menguji skenario prioritas.
5. Mengumumkan rilis di kanal komunitas beserta langkah pembaruan dan migrasi baru.

## Lihat juga

- [CHANGELOG lengkap di GitHub](https://github.com/tulisankode/opensimrs/blob/main/CHANGELOG.md)
- [Rilis di GitHub](https://github.com/tulisankode/opensimrs/releases)
- [Roadmap](/pendahuluan/roadmap)
- [Panduan Kontribusi](/pendahuluan/kontribusi): cara menulis fragmen changelog
- [Pembaruan & Cadangan](/memulai/pembaruan-cadangan)
