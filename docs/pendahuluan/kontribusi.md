# Panduan Kontribusi

Terima kasih ingin ikut membangun OpenSIMRS. Halaman ini menjelaskan cara mengirim perubahan ke repo [tulisankode/opensimrs](https://github.com/tulisankode/opensimrs): alur fork → branch → Pull Request, konvensi commit, fragmen changelog, aturan migrasi, cara menguji, dan aturan data. Aturan ini berlaku untuk semua kontributor, termasuk perubahan dokumen.

Dengan berkontribusi, Anda setuju mengikuti [Kode Etik](/komunitas/kode-etik) dan bahwa kontribusi Anda dirilis di bawah lisensi proyek (MIT).

## Siapa saja bisa berkontribusi

Semua peran adalah **Contributor**. Tidak ada kontribusi "kelas dua": memasang OpenSIMRS di puskesmas, menulis skenario uji, memvalidasi alur resep sebagai apoteker, dan menulis kode sama-sama memajukan proyek.

| Bidang | Siapa | Panduan di repo |
|---|---|---|
| **Implementator** | IT rumah sakit/faskes, mahasiswa, atau mitra yang memasang dan mendampingi OpenSIMRS di faskes | [IMPLEMENTATOR.md](https://github.com/tulisankode/opensimrs/blob/main/docs/kontributor/IMPLEMENTATOR.md) |
| **Developer** | Pengembang backend/frontend, mahasiswa informatika | [DEVELOPER.md](https://github.com/tulisankode/opensimrs/blob/main/docs/kontributor/DEVELOPER.md) |
| **Tester/QA** | Penguji manual/otomatis, mahasiswa, staf faskes yang teliti | [TESTER-QA.md](https://github.com/tulisankode/opensimrs/blob/main/docs/kontributor/TESTER-QA.md) |
| **Product development** | Analis kebutuhan, tenaga medis/klinis, desainer UX | [PRODUCT-DEV.md](https://github.com/tulisankode/opensimrs/blob/main/docs/kontributor/PRODUCT-DEV.md) |

Tenaga medis dan klinis (dokter, perawat, apoteker, analis, perekam medis) sangat dibutuhkan untuk memvalidasi alur, meski tanpa menulis kode. Cari issue berlabel `butuh tenaga medis/klinis`.

## Sebelum mulai

1. Pasang OpenSIMRS di komputer Anda dengan [Instalasi](/memulai/instalasi) dan pastikan bisa login dengan [akun demo](/memulai/data-demo).
2. Pahami arsitektur dan konvensinya di [Gambaran Sistem](/arsitektur/gambaran) dan [Konvensi API](/arsitektur/konvensi-api).
3. Bila pekerjaan Anda menyentuh menu atau fitur, baca [Manajemen Modul & Fitur](/arsitektur/manajemen-modul).
4. Pilih pekerjaan dari [Roadmap](/pendahuluan/roadmap) dan **klaim** dulu di issue-nya.
5. Untuk perubahan besar (arsitektur, struktur data, kontrak API, alur klinis), buat issue berlabel `RFC` terlebih dahulu. Lihat [Tata Kelola](/komunitas/tata-kelola#rfc-request-for-comments).

## Alur kontribusi: fork → branch → PR

Prinsip utamanya:

- **`main` selalu sehat.** Setiap commit di `main` lulus CI.
- **Semua perubahan lewat Pull Request**, termasuk dari maintainer. Tidak ada push langsung ke `main`.
- **Branch berumur pendek.** Usahakan di-merge dalam 2 minggu; pekerjaan besar dipecah menjadi beberapa PR kecil.
- Repo tidak memakai branch `develop`.

```bash
# 1. Fork repo di GitHub (tombol "Fork"), lalu clone fork Anda
git clone https://github.com/<akun-anda>/opensimrs.git
cd opensimrs
git remote add upstream https://github.com/tulisankode/opensimrs.git

# 2. Selalu mulai dari main terbaru
git checkout main
git pull upstream main

# 3. Buat branch kerja
git checkout -b fix/b-22-kode-status-dirujuk

# 4. Kerjakan, uji, lalu commit
git add <berkas-yang-diubah>
git commit -m "fix(rme): B-22 samakan kode status pulang dirujuk ke other-hcf"

# 5. Kirim ke fork Anda, lalu buka Pull Request ke tulisankode/opensimrs branch main
git push origin fix/b-22-kode-status-dirujuk
```

### Nama branch

Format: `<jenis>/<id>-<ringkasan>`, huruf kecil, kata dipisah tanda hubung, maksimal ±50 karakter. `<id>` diisi ID backlog (`b-17`) atau nomor issue (`123`). Untuk perubahan kecil tanpa ID, cukup ringkasannya.

| Jenis | Untuk | Contoh |
|---|---|---|
| `feat` | Fitur baru | `feat/b-17-program-kia` |
| `fix` | Perbaikan bug | `fix/b-45-batal-order-lab`, `fix/123-kuitansi-diskon` |
| `docs` | Dokumen | `docs/panduan-satusehat` |
| `refactor`, `test`, `perf`, `chore`, `ci` | Sesuai jenis commit | `chore/naikkan-vite` |
| `hotfix` | Perbaikan darurat untuk rilis stabil | `hotfix/1.0.1-login-gagal` |

### Menjaga branch tetap mutakhir

```bash
git fetch upstream
git rebase upstream/main          # sebelum review dimulai
git push --force-with-lease       # perbarui branch di fork Anda
```

- **Sebelum review dimulai:** rebase ke `upstream/main`. Pakai `--force-with-lease`, jangan `--force`.
- **Setelah review dimulai:** jangan force-push kecuali diminta reviewer. Gunakan `git merge upstream/main` untuk mengejar `main`; riwayat tetap bersih karena PR akan di-squash.
- **Konflik diselesaikan oleh penulis PR.** Jalankan ulang uji yang relevan setelahnya.
- **Konflik `package-lock.json`:** ambil versi dari `main`, lalu jalankan `npm install` di folder terkait. Jangan menyunting lock file secara manual.

## Konvensi commit

Pesan commit memakai **Bahasa Indonesia** dengan format [Conventional Commits](https://www.conventionalcommits.org/id/v1.0.0/):

```
<jenis>(<cakupan>): <ringkasan singkat, huruf kecil, tanpa titik>

<penjelasan opsional: apa & mengapa, bukan bagaimana>
```

| Jenis | Kapan dipakai |
|---|---|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `docs` | Dokumentasi saja |
| `refactor` | Perubahan struktur kode tanpa mengubah perilaku |
| `test` | Menambah/memperbaiki uji |
| `chore` | Pemeliharaan (dependensi, skrip, konfigurasi) |
| `perf` | Peningkatan performa |
| `ci` | Perubahan CI/CD |

**Cakupan** memakai nama modul/area, mis. `rme`, `farmasi`, `lab`, `lis`, `kasir`, `admisi`, `mcu`, `radiologi`, `modul`, `demo`, `deploy`. Sebut ID backlog (`B-xx`) bila ada.

```
feat(mcu): impor Excel peserta korporasi
fix(kuitansi): tampilkan tanggal discharge
fix(lab): B-45 pembuatan order lab dalam satu transaksi
docs: panduan integrasi SATUSEHAT
```

## Isi Pull Request

Repo menyediakan templat PR. Isi deskripsinya dengan:

- **Apa dan mengapa**, termasuk ID backlog atau issue (mis. `B-22`, `Menutup #123`).
- **Cara menguji**: akun demo dan segmen yang dipakai, langkah, hasil yang diharapkan.
- **Tangkapan layar** untuk perubahan tampilan, hanya dengan data demo.
- **Migrasi baru** (bila ada) dan dampaknya ke data lama.
- **Fragmen CHANGELOG** `changelog.d/<nama-branch>.md`.

Aturan PR:

- Satu PR = satu tujuan. Pisahkan perbaikan yang tidak berhubungan.
- Satu fitur yang menyentuh beberapa layanan cukup **satu PR** (kode layanan + migrasi + katalog + dokumen), karena repo ini monorepo.
- Buka **draft PR** lebih awal untuk pekerjaan besar.
- Tanggapi masukan reviewer dengan commit baru.
- Bagian fitur yang belum siap dipakai pengguna disembunyikan lewat Manajemen Modul (status *Segera* atau fitur dimatikan di preset segmen), bukan ditahan di branch panjang.

## Fragmen changelog

Setiap PR yang mengubah perilaku untuk pengguna atau implementator menulis catatan perubahan di **berkas fragmen sendiri**, bukan di `CHANGELOG.md`. Dengan begitu, PR yang dikerjakan bersamaan tidak saling konflik.

| Asal perubahan | Nama berkas | Contoh |
|---|---|---|
| PR kontributor | nama branch, `/` diganti `-` | `changelog.d/feat-123-filter-ruangan.md` |
| Item SIMRS Studio | `STD-<nomor 4 digit>.md` | `changelog.d/STD-0031.md` |

Nama berkas hanya boleh berisi huruf, angka, titik, minus, dan garis bawah. Isinya memakai judul `### <Kategori>` dengan kategori **Ditambahkan**, **Diubah**, **Usang**, **Dihapus**, **Diperbaiki**, atau **Keamanan**:

```markdown
### Diperbaiki
- Kasir: rincian tagihan menampilkan biaya penunjang (B-44).
  - **Migrasi baru:** `20261019090000-tagihan_penunjang`.
```

Tulis dari sudut pandang pengguna dan sebut migrasi baru bila ada. Format fragmen diperiksa `node scripts/cek-integritas.mjs`, yang juga dijalankan CI. Saat rilis, maintainer menggabungkan semua fragmen ke `CHANGELOG.md`.

## Konvensi kode

- **Tulis kode yang mirip kode di sekitarnya.** Istilah domain memakai Bahasa Indonesia (`pasien`, `kunjungan`, `penjamin`, `tagihan`).
- Komentar seperlunya, terutama untuk menjelaskan **mengapa** sebuah aturan ada.
- Jangan menambah dependensi baru tanpa alasan kuat; sebutkan di deskripsi PR.

### Data dan API

- ID memakai `uuid` (uuidv7, string) yang dibuat aplikasi.
- Waktu `created_at`/`updated_at`/`deleted_at` disimpan sebagai **epoch detik**.
- **Soft delete**: setiap query menyaring `deleted_at IS NULL` **dan** `faskes_uuid`.
- `faskes_uuid` selalu diambil dari token login, **bukan** dari body request.
- API memakai awalan `/api/v3/<layanan>/...` dengan respons `{ message, payload }`.
- Database dan API memakai `snake_case`; kode Vue memakai `camelCase` (axios mengonversi otomatis).

### Frontend

- Vue 3 + TypeScript + PrimeVue + Pinia + Tailwind; validasi form dengan vee-validate + yup.
- Gating modul/fitur memakai helper di `src/stores/modulFaskes.ts`.
- Cetak PDF lewat `bukaPdf` (`src/utils/pdf/bukaPdf.ts`).

### SDK bersama (`packages/`)

- Setelah mengubah kode SDK, jalankan `npm run sdk:refresh` (atau `npm run sdk:refresh -- <layanan>`), lalu uji layanan yang memakainya.
- Naikkan versi SDK di `package.json`-nya pada PR yang sama: PATCH untuk perbaikan, MINOR untuk ekspor/model/kolom baru, MAYOR bila ada ekspor yang dihapus atau perilakunya berubah.
- Pertahankan berkas lisensi dan atribusi penulis asli di setiap paket SDK.

### Modul atau fitur baru

Ubah `database/data/katalog-modul.json`, buat migrasi yang memanggil `sinkronKatalog`, lalu jalankan `npm run docs:katalog`. Rinciannya ada di [Manajemen Modul & Fitur](/arsitektur/manajemen-modul).

## Migrasi database

Perubahan skema **hanya** lewat migrasi baru di `database/migrations/`. Detail teknisnya ada di [Basis Data & Migrasi](/arsitektur/basis-data-migrasi).

- **Nama berkas:** `database/migrations/YYYYMMDDHHMMSS-deskripsi_singkat.cjs`, dengan cap waktu **UTC** saat berkas dibuat.
- **Urutan:** saat PR di-merge, migrasi baru harus berurutan **paling akhir** dibanding semua migrasi di `main`. Bila `main` sudah punya migrasi yang lebih baru, ganti cap waktu berkas Anda (beserta rujukannya di fragmen changelog) sebelum merge.
- **Idempoten:** pakai SQL mentah dengan `IF NOT EXISTS`, di dalam transaksi. CI menjalankan migrasi dua kali dan kali kedua tidak boleh mengubah apa pun.
- **Jangan pernah mengubah migrasi yang sudah ada di `main`.** Faskes mungkin sudah menjalankannya. Perbaikan selalu ditulis sebagai migrasi baru.
- Isi `down()` bila memungkinkan. Bila tidak, tulis alasannya di komentar berkas.
- Jangan pernah `TRUNCATE ... CASCADE` tabel `ref_*`.
- `schema.sql` hanya berisi struktur dan data referensi nasional. Jangan menambahkan data faskes, pasien, atau pengguna ke dalamnya.

::: warning Item SIMRS Studio
Item SIMRS Studio mendapat awalan migrasi sendiri (blok jam UTC `YYYYMMDDHH`) agar item yang dikerjakan bersamaan tidak memakai cap waktu yang sama.
:::

## Cara menguji

### Uji alur dengan akun demo

Setelah `npm run db:demo:seed`, tersedia 8 faskes fiktif dengan akun per peran (lihat [Data Demo](/memulai/data-demo)).

- Uji dengan **akun peran yang sesuai** (mis. `kp.pendaftaran` untuk pendaftaran, `kp.kasir` untuk kasir), bukan hanya `superadmin`, agar masalah izin ikut terlihat.
- Untuk perubahan yang bergantung segmen, uji minimal di **satu segmen yang mengaktifkan** fitur dan **satu yang mematikannya** (mis. praktik mandiri `pm.*` vs klinik pratama `kp.*`).
- Data transaksi realistis: `npm run db:demo:transaksi`.

### Uji unit

```bash
npm --prefix lab-service test
npm --prefix rekamedis-service test
npm --prefix bpjs-service test
npm --prefix satusehat-service test
```

Layanan lain memakai skrip `test` di `package.json` masing-masing. Beberapa layanan belum punya uji sama sekali; menambahkannya adalah kontribusi yang sangat berguna (backlog B-56).

### Frontend

- `vue-tsc` **belum andal** karena galat sintaks lama di `components/icons/*` (backlog B-41).
- Build produksi harus lulus:

  ```bash
  npm --prefix frontend-service run build-only
  ```

- Pastikan berkas yang Anda ubah dapat dimuat (`curl -I http://localhost:5520/src/<path-berkas>` mengembalikan 200), lalu uji di browser tanpa galat di konsol.

### Migrasi

```bash
npm run db:migrate
npm run db:migrate     # kali kedua tidak boleh mengubah apa pun
```

### Yang diperiksa CI

PR harus lulus CI: cek sintaks semua layanan dan `packages/`, uji unit, pemuatan `schema.sql` lalu migrasi dua kali, cek dokumen katalog (`node scripts/dokumen-katalog.mjs --cek`), pemeriksaan integritas lintas berkas (`node scripts/cek-integritas.mjs`), dan build frontend.

## Aturan data dan keamanan

Repo ini **publik**. Apa pun yang di-commit bisa dibaca siapa saja, selamanya.

::: danger Jangan pernah meng-commit
- Berkas `.env` dan salinannya.
- Kata sandi, token, API key, *client secret*, kunci privat, sertifikat. Satu-satunya kata sandi yang boleh tertulis adalah kata sandi demo publik `Demo@2026`.
- **Data pasien nyata** dalam bentuk apa pun: nama, NIK, No. RM, nomor BPJS, alamat, foto, hasil pemeriksaan, berkas ekspor, log, atau tangkapan layar dari sistem produksi.
- Alamat IP/host server internal faskes atau kantor, dan email/nomor telepon pribadi.
- Dokumen internal faskes atau dokumen kebutuhan produk yang bersifat rahasia.
:::

**Data uji harus jelas fiktif.** Gunakan data demo (`npm run db:demo:seed`, `npm run db:demo:transaksi`) atau buat identitas fiktif, mis.:

| Data | Contoh fiktif |
|---|---|
| Email | `nama@contoh.id` |
| Nomor HP | `080000000000` |
| NIK | berawalan `9999` |
| Host | `simrs.contoh.id` atau `localhost` |

**Bila terlanjur meng-commit rahasia:** jangan hanya menghapusnya di commit berikutnya. Segera **ganti (rotasi)** rahasia tersebut, lalu kabari maintainer secara privat. Kerentanan keamanan dilaporkan sesuai [Kebijakan Keamanan](/pendahuluan/keamanan), bukan lewat issue publik.

### Etika data kesehatan

Data kesehatan termasuk **data pribadi yang bersifat spesifik** menurut Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, dan rekam medis wajib dijaga kerahasiaannya. Sebagai kontributor:

- **Prinsip minimum**: kumpulkan dan tampilkan data pasien hanya sebanyak yang dibutuhkan alur.
- **Rahasia rekam medis**: hormati hak akses per peran; jangan membuat jalan pintas seperti endpoint tanpa autentikasi atau log berisi data pasien.
- **Jejak audit**: perubahan data klinis penting sebaiknya tercatat (siapa, kapan, apa).
- **Tidak ada data nyata di luar faskes**: jangan meminta, menyalin, atau membagikan data pasien nyata untuk debugging. Minta implementator mereproduksi masalah dengan data demo.
- **Keselamatan pasien di atas kecepatan**: perubahan alur klinis (resep, hasil lab, nilai kritis, identitas pasien) perlu ditinjau tenaga klinis.

## Review dan merge

### Siapa yang harus menyetujui

| Jenis perubahan | Persetujuan minimal |
|---|---|
| Dokumen, salah ketik, terjemahan | 1 Reviewer atau Maintainer |
| Perbaikan bug atau fitur di satu modul | 1 Maintainer bidang terkait |
| Perubahan lintas layanan, SDK `packages/`, migrasi database, autentikasi/izin, integrasi (SATUSEHAT, BPJS, LIS), CI/deploy, dependensi mayor | 2 persetujuan, minimal 1 dari Core Maintainer |
| Perubahan alur atau form klinis | Syarat di atas ditambah 1 reviewer tenaga medis/klinis |
| Arsitektur inti dan perubahan besar | Lewat RFC terlebih dahulu |

- Penulis PR tidak menyetujui PR-nya sendiri.
- PR yang butuh 2 persetujuan dibiarkan terbuka minimal **48 jam** sejak siap ditinjau (kecuali perbaikan P1 dan keamanan).
- Persetujuan **gugur** bila ada commit baru yang mengubah isi secara berarti.

### Cara merge

- Bawaan: **Squash and merge** oleh maintainer. Judul commit hasil squash mengikuti konvensi commit ditambah nomor PR, mis. `fix(lab): B-45 pembuatan order lab dalam satu transaksi (#57)`.
- Merge commit tidak dipakai di `main`. Branch kerja dihapus setelah merge.
- **3 hari sebelum rilis** alpha/beta, `main` hanya menerima perbaikan bug, dokumen, dan uji.
- Bila `main` rusak setelah merge, maintainer mana pun langsung me-revert commit penyebabnya. Penulis memperbaiki di PR baru.
- PR tanpa aktivitas 30 hari diberi label `stale`, lalu ditutup bila 14 hari kemudian tetap tidak aktif. PR yang ditutup boleh dibuka kembali.

## Melaporkan bug dan mengusulkan fitur

**Bug:** buka issue di GitHub berisi versi/commit OpenSIMRS, cara instalasi, OS, versi Node/Docker, segmen faskes dan peran akun, langkah reproduksi, hasil yang terjadi dan yang diharapkan, serta log galat (hapus kata sandi, token, dan data pasien).

**Usulan fitur:** jelaskan kebutuhan di lapangan (siapa penggunanya, di jenis faskes apa, alur saat ini), bukan hanya solusi teknisnya.

## Langkah berikutnya

- [Roadmap](/pendahuluan/roadmap): pilih dan klaim pekerjaan.
- [Struktur Direktori](/memulai/struktur-direktori): kenali isi monorepo.
- [Data Demo](/memulai/data-demo): akun untuk menguji perubahan Anda.
- [Kanal Komunitas](/komunitas/): tanya jawab dengan kontributor lain.
