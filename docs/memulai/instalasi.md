# Instalasi

Halaman ini memandu Anda memasang OpenSIMRS di laptop atau mesin pengembangan sampai aplikasi terbuka di browser dengan data demo. Ada dua cara: **installer otomatis** (disarankan) dan **langkah manual** dengan Docker untuk PostgreSQL, MongoDB, dan Redis. Untuk memasang di server faskes, lanjutkan ke [Deployment](/memulai/deployment) setelah instalasi lokal berjalan.

::: warning Status alfa
OpenSIMRS masih berstatus **alfa** (`1.0.0-alpha.1`). Silakan dicoba dan dievaluasi. Sebelum dipakai melayani pasien sungguhan, uji menyeluruh dan jalankan paralel dengan sistem lama.
:::

## Prasyarat

### Perangkat lunak

| Perangkat lunak | Versi | Keterangan |
|---|---|---|
| Git | ≥ 2.30 | Untuk mengunduh kode. |
| Node.js | **22 LTS** | Versi yang dipakai CI. Installer menerima Node.js ≥ 20, tetapi tetap menyarankan 22. |
| npm | bawaan Node.js | |
| PostgreSQL | 16 (minimal 15) | Satu database bersama `opensimrs`. |
| MongoDB + `mongosh` | 7 (minimal 6) | Isi rekam medis elektronik. |
| Redis | 7 (minimal 6) | Token sesi dan cache izin. Di Windows dipakai **Memurai Developer** sebagai pengganti Redis. |
| Docker Engine + Compose v2 | Docker ≥ 24, Compose ≥ 2.20 | Hanya bila PostgreSQL, MongoDB, dan Redis dijalankan di Docker. |

Installer akan memeriksa versi tiap perangkat lunak dan menawarkan pemasangan yang kurang, jadi Anda tidak harus memasang semuanya lebih dulu.

### Perangkat keras

Untuk pengembangan, siapkan CPU 4 core, RAM 16 GB (8 GB cukup bila hanya menjalankan `npm run dev:core`), dan SSD dengan ruang kosong 30 GB. Kebutuhan server per segmen faskes ada di [Spesifikasi Hardware](/memulai/spesifikasi-hardware).

## Installer cepat

Unduh kode, lalu jalankan installer dari folder repo:

::: code-group
```bash [macOS / Linux]
git clone https://github.com/tulisankode/opensimrs.git
cd opensimrs
./install.sh
```
```powershell [Windows]
git clone https://github.com/tulisankode/opensimrs.git
cd opensimrs
.\install.cmd
```
:::

Installer bisa dijalankan berulang dengan aman. Langkah yang dikerjakannya:

1. Memeriksa dependensi dan versinya: Git, OpenSSL, Node.js, PostgreSQL, Redis, MongoDB, dan `mongosh`. Yang kurang ditawarkan untuk dipasang lewat **Homebrew** (macOS), **apt** (Ubuntu/Debian), atau **winget** (Windows).
2. Menyalakan PostgreSQL, Redis, dan MongoDB.
3. Membuat role dan database PostgreSQL `opensimrs`, lalu memuat `schema.sql` (sekali saja, 1–3 menit).
4. Membuat akun MongoDB `opensimrs`.
5. Membuat `.env` root, `.env` tiap layanan, dan `frontend-service/.env` dengan kunci acak. Berkas yang sudah ada **tidak ditimpa**.
6. Menjalankan `npm install` di semua folder, `npm run db:migrate`, lalu menawarkan data demo (8 faskes fiktif).
7. Menawarkan alat AI opsional satu per satu (lihat [Alat AI opsional](#alat-ai-opsional)).

Setiap langkah tampil dengan bilah kemajuan. Keluaran lengkap disimpan di berkas log yang disebut di akhir proses, dan bila ada langkah yang gagal, 25 baris terakhir log ikut ditampilkan.

::: tip Hanya untuk development
`install.sh` dan `install.cmd` ditujukan untuk instalasi lokal. Untuk server staging atau production, ikuti [Deployment](/memulai/deployment).
:::

### Opsi installer

| macOS / Linux | Windows | Fungsi |
|---|---|---|
| `--cek` | `-Cek` | Hanya memeriksa dependensi, tidak mengubah apa pun. |
| `--ya` (atau `-y`) | `-Ya` | Menjawab "ya" untuk semua pertanyaan. |
| `--tanpa-demo` | `-TanpaDemo` | Melewati pengisian data demo. |
| `--jalankan` | `-Jalankan` | Langsung menjalankan `npm run dev` setelah instalasi selesai. |
| `--podman` | – | PostgreSQL, MongoDB, dan Redis dijalankan di kontainer Podman (lihat [Mode Podman](#mode-podman)). |
| `--tanpa-ai` | `-TanpaAi` | Melewati pemasangan alat AI. |
| `--helpdesk` | `-Helpdesk` | Tetap diterima demi kompatibilitas; OpenClaw kini selalu ditawarkan di langkah alat AI. |
| `--domain <domain> --api <domain-api>` | `-Domain <domain> -Api <domain-api>` | Menyiapkan akses dari luar lewat domain HTTPS. Keduanya wajib dipakai bersama. Lihat [Akses Lewat Domain](/memulai/akses-domain). |
| `--help` | – | Menampilkan bantuan. |

Contoh pemakaian:

```bash
./install.sh --cek                 # cek dependensi saja
./install.sh --ya --tanpa-demo     # tanpa pertanyaan, tanpa data demo
./install.sh --ya --jalankan       # instal lalu langsung jalankan aplikasi
```

### Catatan khusus Windows

`install.cmd` sama dengan menjalankan `powershell -ExecutionPolicy Bypass -File .\install.ps1`. Pemasangan layanan membutuhkan PowerShell **sebagai Administrator**.

- Dependensi dipasang lewat **winget**: Node.js 22, PostgreSQL 16, MongoDB 7.0, `mongosh`, dan **Memurai Developer** (layanan kompatibel Redis untuk Windows; edisi Developer gratis untuk development dan perlu dinyalakan ulang berkala).
- Bila PostgreSQL dipasang oleh skrip, sandi superuser `postgres` dibuat acak dan ditampilkan **sekali** di akhir. Bila PostgreSQL sudah terpasang, skrip menanyakannya, atau Anda bisa mengisi variabel lingkungan `PG_SUPERPASS`.
- Port PostgreSQL dibaca dari `postgresql.conf` layanan Windows-nya. Bila berbeda dari 5432 (mis. karena 5432 dipakai kontainer Docker), nilainya ikut ditulis ke `DB_PORT`. Anda juga bisa memaksanya lewat variabel `PG_PORT`.
- Redis di bawah versi 5, termasuk port Redis lama untuk Windows (v3.0), dianggap terlalu lama dan diganti Memurai.

## Mode Podman

Di macOS atau Linux, Anda bisa menjalankan PostgreSQL, MongoDB, dan Redis di kontainer Podman tanpa memasangnya dari Homebrew/apt. Layanan backend dan frontend tetap berjalan langsung di mesin (`npm run dev`).

```bash
brew install podman docker-compose node@22   # docker-compose v2 menjadi provider "podman compose"
git clone https://github.com/tulisankode/opensimrs.git && cd opensimrs
./install.sh --cek --podman                    # cek dependensi saja
./install.sh --podman                          # instalasi lengkap (+ --ya untuk tanpa tanya)
npm run dev
```

Yang dilakukan `--podman`:

- di macOS, membuat VM Podman `opensimrs` (2 CPU, 4 GB RAM, disk 40 GB) bila belum ada, lalu menyalakannya; nama image pendek (`postgres:16-alpine`, `mongo`, `redis`) diarahkan ke Docker Hub;
- menulis `.env` root **sebelum** kontainer dinyalakan, karena `podman compose` membaca nama dan sandi database dari berkas itu;
- menjalankan `podman compose up -d db mongodb redis`. Saat volume masih baru, kontainer PostgreSQL membuat role/database `opensimrs` dan memuat `schema.sql`, dan kontainer MongoDB membuat akun root `opensimrs`;
- memeriksa bahwa sandi di `.env` cocok dengan volume yang sudah ada, lalu melanjutkan langkah biasa.

Port 5432, 27017, dan 6379 harus kosong. Bila PostgreSQL/MongoDB/Redis dari Homebrew masih berjalan, hentikan dulu:

```bash
brew services stop postgresql@16 mongodb-community@7.0 redis
```

Setelah komputer dinyalakan ulang, nyalakan kembali VM dan kontainernya sebelum `npm run dev`:

```bash
podman machine start
podman compose -f docker-compose.yml up -d db mongodb redis
```

## Alat AI opsional

Di langkah terakhir, installer menawarkan alat AI satu per satu. Semuanya opsional dan bisa dilewati dengan `--tanpa-ai` (Windows: `-TanpaAi`).

| Alat | Cara pasang | Dipakai untuk |
|---|---|---|
| **Claude Code CLI** | `npm install -g @anthropic-ai/claude-code` | Agen [SIMRS Studio](/studio/) |
| **Codex CLI** | `npm install -g @openai/codex` | Agen SIMRS Studio |
| **OpenCode CLI** | `npm install -g @opencode/cli` | Agen SIMRS Studio dengan model lokal |
| **Ollama** | Homebrew (macOS), installer resmi (Linux), winget (Windows) | LLM lokal untuk agen OpenCode |
| **OpenClaw** | Installer resmi (menyiapkan Node 24.16+ sendiri) | [Helpdesk](/integrasi/helpdesk) |

Catatan:

- Akun Claude/ChatGPT dihubungkan dari aplikasi: **SIMRS Studio › Pengaturan & Agen**.
- **Ollama dipasang tanpa model.** Model berukuran beberapa GB, jadi pilih sendiri sesuai RAM/VRAM Anda, mis. `ollama pull qwen3:8b` (RAM ≥ 16 GB) atau `ollama pull gpt-oss:20b` (VRAM/RAM ≥ 24 GB). Setelah itu daftarkan di **SIMRS Studio › Pengaturan & Agen › Konektor** (Ollama, `http://localhost:11434`).
- **OpenClaw** di mesin pengembang hanya untuk uji coba. Untuk produksi, Helpdesk dipasang di VM terpisah dari server SIMRS.

## Langkah manual

Gunakan cara ini bila Anda ingin mengendalikan setiap tahap, atau menjalankan PostgreSQL, MongoDB, dan Redis di Docker.

### 1. Unduh kode dan buat `.env` root

```bash
git clone https://github.com/tulisankode/opensimrs.git
cd opensimrs
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
```

Isi `.env` dengan kredensial database dan `SECRET_KEY`. Rinciannya ada di [Konfigurasi](/memulai/konfigurasi). Repo ini monorepo biasa, jadi **tidak perlu** `--recurse-submodules`.

### 2. Jalankan infrastruktur

```bash
npm run infra:up              # = docker compose up -d db mongodb redis
docker compose ps
```

Saat volume masih kosong, PostgreSQL memuat `schema.sql` (±11 MB, berisi struktur tabel dan data referensi nasional). Proses ini butuh **1–3 menit**; tunggu sampai `docker logs opensimrs-db` menampilkan `database system is ready to accept connections`. Hentikan infrastruktur dengan `npm run infra:down`.

::: tip MongoDB tidak mau menyala
Bila MongoDB gagal start di Docker Desktop terbaru, ganti `image: mongo:latest` di `docker-compose.yml` menjadi `mongo:7.0`.
:::

### 3. Pasang dependensi

```bash
npm run install:all
```

Perintah ini menjalankan `npm install` di root, di setiap layanan, dan di `frontend-service`. Instalasi pertama bisa memakan 10–20 menit.

### 4. Buat `.env` tiap layanan dan frontend

Saat dijalankan dengan `npm run dev`, setiap layanan membaca `.env` di foldernya sendiri (mis. `auth-service/.env`), dan frontend membaca `frontend-service/.env`. Skrip siap salin ada di [Konfigurasi](/memulai/konfigurasi#env-tiap-layanan).

### 5. Migrasi dan data demo

```bash
npm run db:migrate
npm run db:demo:seed                   # 8 faskes fiktif + akun demo
npm run db:demo:master-penunjang       # opsional: datamaster lab/radiologi/fisio/MCU/PA/Mikro
```

Penjelasan data demo dan pola akunnya ada di [Data Demo](/memulai/data-demo).

### 6. Jalankan aplikasi

```bash
npm run dev
```

`npm run dev` menjalankan semua layanan backend beserta frontend dalam satu terminal. Pilihan lain:

| Perintah | Isi |
|---|---|
| `npm run dev:core` | Ringan untuk RAM terbatas: auth, datamaster, admisi, dan frontend. Cukup untuk login dan mencoba pendaftaran; modul lain tidak berfungsi. |
| `npm run dev:local` | `infra:up` lalu `dev:core` sekaligus. |
| `npm run dev:<layanan>` | Satu layanan saja, mis. `dev:auth`, `dev:lab`, `dev:penunjang`, `dev:frontend`. |
| `npm run stack:up` | Membangun dan menjalankan seluruh tumpukan di Docker (`docker compose up -d --build`). |

## Membuka aplikasi

Buka **http://localhost:5520**, lalu login dengan akun demo:

- Username: `superadmin`
- Kata sandi: `Demo@2026` (atau nilai `DEMO_PASSWORD` di `.env` root)

Anda juga bisa menguji login lewat API:

```bash
curl -X POST http://localhost:8083/api/v3/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "superadmin", "password": "Demo@2026"}'
```

## Menghapus instalasi

Pasangan installer, `uninstall.sh` (Windows: `uninstall.cmd`), hanya menghapus jejak OpenSIMRS:

- PostgreSQL: database dan role aplikasi;
- MongoDB: database dan akun aplikasi;
- Redis: hanya kunci sesi `token-*`, bukan `FLUSHDB`;
- mode Podman: kontainer dan volume OpenSIMRS;
- gateway akses domain bila ada (kontainer `opensimrs-gateway`, konfigurasinya, dan `frontend-service/.env.local` buatan installer);
- berkas buatan instalasi di repo: `node_modules`, `.env`, `dist`, data SIMRS Studio, dan worktree Studio.

PostgreSQL, MongoDB, Redis, dan Node.js itu sendiri, database atau akun lain, OpenClaw, serta Ollama beserta modelnya **tidak** disentuh.

::: code-group
```bash [macOS / Linux]
./uninstall.sh --simulasi        # tampilkan rencana tanpa menghapus apa pun
./uninstall.sh                   # rencana → cadangan (ditawarkan) → ketik "HAPUS OPENSIMRS"
./uninstall.sh --hapus-folder    # hapus juga folder repo ini
./uninstall.sh --alat-ai         # hapus juga Claude Code, Codex & OpenCode CLI (npm global)
```
```powershell [Windows]
.\uninstall.cmd -Simulasi
.\uninstall.cmd
.\uninstall.cmd -HapusFolder
.\uninstall.cmd -AlatAi
```
:::

Opsi lain: `--ya` / `-Ya` (tanpa pertanyaan), `--tanpa-cadangan` / `-TanpaCadangan`, dan `--podman` (memaksa mode Podman; bawaannya dideteksi otomatis). Di Windows, penghapusan role PostgreSQL membutuhkan sandi superuser lewat variabel `PG_SUPERPASS`.

Cadangan `pg_dump`/`mongodump` disimpan di `~/opensimrs-cadangan-<waktu>/` (Windows: `%USERPROFILE%\opensimrs-cadangan-<waktu>\`). Cara memulihkannya ditampilkan di akhir proses.

## Pemecahan masalah

### Port sudah dipakai

Gejala: layanan gagal start dengan `EADDRINUSE`, atau installer berhenti karena port 5432, 27017, atau 6379 sudah dipakai.

```bash
# macOS / Linux
lsof -i :8083
# Windows
netstat -ano | findstr :8083
```

Hentikan proses yang memakai port itu. Bila Anda memilih mengubah port layanan, ubah di `.env` layanan tersebut **dan** di semua URL yang merujuknya (`frontend-service/.env` dan `.env` layanan lain). PostgreSQL yang sudah terpasang di komputer sering bentrok di port 5432.

### Podman tidak tersambung

Bila installer melaporkan Podman belum tersambung ke VM, periksa VM dan koneksinya:

```bash
podman machine ls
podman system connection list
```

- VM mati: `podman machine start <nama-mesin>`.
- VM menyala tetapi koneksi bawaan menunjuk mesin lain atau mesin yang sudah dihapus: `podman system connection default <nama-mesin>`.
- VM menyala tetapi tetap tidak terhubung (koneksi menyimpan port SSH lama): `podman machine stop <nama-mesin> && podman machine start <nama-mesin>`.
- `podman compose` butuh provider. Pasang `docker-compose` (macOS: `brew install docker-compose`).

Bila sandi di `.env` sudah tidak cocok dengan volume Podman lama, installer berhenti dengan petunjuk. Pakai kembali `.env` lama, atau hapus volume dengan `podman compose -f docker-compose.yml down -v`.

::: danger
`podman compose -f docker-compose.yml down -v` menghapus volume beserta **seluruh datanya**.
:::

### Versi Node.js

Installer menolak Node.js di bawah 20 dan memperingatkan bila versinya di bawah 22. Pasang Node.js 22 LTS. Di macOS dengan Homebrew, `node@22` bersifat *keg-only*, jadi tambahkan ke `PATH` di `~/.zshrc`:

```bash
export PATH="$(brew --prefix node@22)/bin:$PATH"
```

### Windows dan Git Bash

Di Git Bash, argumen shell yang diawali `/` atau `@/` bisa diubah otomatis menjadi path Windows (mis. `C:/Program Files/Git/...`). Untuk mengubah berkas atau melakukan penggantian massal, pakai editor atau skrip Node, bukan argumen shell.

### Masalah lain

| Gejala | Penyebab umum | Solusi |
|---|---|---|
| Login berhasil, tetapi modul lain menolak (401) | `SECRET_KEY` berbeda antarlayanan | Samakan `SECRET_KEY` di semua `.env`, mulai ulang semua layanan, lalu login ulang. |
| Log berisi `SECRET_KEY is required for JWT HS256` | `SECRET_KEY` kosong, atau salinan SDK di layanan sudah usang | Isi `SECRET_KEY`, jalankan `npm run sdk:refresh`, lalu mulai ulang layanan. |
| Login akun demo gagal | Data demo belum diisi, atau `DEMO_PASSWORD` diubah | Jalankan `npm run db:demo:seed` dan periksa `DEMO_PASSWORD`. |
| `db:migrate` gagal tepat setelah kontainer dibuat | PostgreSQL masih memuat `schema.sql` | Tunggu 1–3 menit, cek `docker logs opensimrs-db`. |
| `laporan-service` gagal terhubung ke MongoDB | MongoDB tanpa akun, atau `MONGO_DB_USERNAME`/`MONGO_DB_PASSWORD` kosong | `laporan-service` selalu memakai username dan sandi. Buat akun MongoDB dan isi variabelnya. |
| Menu modul tidak muncul | Modul tidak aktif untuk faskes, peran tidak punya izin, atau belum login ulang | Lihat [Manajemen Modul & Fitur](/arsitektur/manajemen-modul#menu-yang-tampil). |

Masih buntu? Tanyakan di [kanal komunitas](/komunitas/) atau buka issue di GitHub dengan label `bantuan dibutuhkan`. Sertakan langkah, log (tanpa kata sandi, token, atau data pasien), OS, serta versi Node.js dan Docker.

## Langkah berikutnya

- [Konfigurasi](/memulai/konfigurasi): isi `.env` root, layanan, dan frontend.
- [Data Demo](/memulai/data-demo): faskes dan akun demo per segmen.
- [Akses Lewat Domain](/memulai/akses-domain): membuka instalasi lokal dari luar lewat HTTPS.
- [Deployment](/memulai/deployment): memasang di server faskes.
