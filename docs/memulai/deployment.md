# Deployment

Halaman ini untuk tim IT yang memasang OpenSIMRS di server staging atau production. Ada dua cara yang sama-sama didukung: **Docker** (disarankan, dengan skrip `deploy/server/deploy.sh`) dan **instal native** (pm2/systemd + nginx). Keduanya diakhiri dengan HTTPS di depan aplikasi.

::: warning Selesaikan instalasi lokal dulu
Sebelum memasang di server, jalankan dulu OpenSIMRS dengan data demo di laptop atau server uji ([Instalasi](/memulai/instalasi)) agar Anda mengenal alur aplikasinya. OpenSIMRS masih berstatus **alfa**; jalankan paralel dengan sistem lama sebelum dipakai penuh.
:::

## Persiapan server

1. **Server** sesuai [Spesifikasi Hardware](/memulai/spesifikasi-hardware) untuk segmen faskes Anda. Linux (Ubuntu Server LTS atau Debian disarankan) dengan firewall aktif.
2. **HTTPS wajib** (Let's Encrypt atau CA lain), karena aplikasi memuat data kesehatan.
3. **Akses internet keluar** ke API BPJS dan SATUSEHAT. Keduanya hanya menerima koneksi dari **IP Indonesia**.
4. **Rahasia baru**: kata sandi database, `SECRET_KEY`, dan kunci API internal dibuat acak khusus untuk server ini (`openssl rand -hex 32`). Jangan memakai nilai dari laptop atau dokumentasi.
5. **Ruang disk**: membangun semua image sekaligus membutuhkan ±10 GB lapisan build; sisakan minimal 15 GB saat build.

## Berkas deploy

| Berkas | Isi |
|---|---|
| `docker-compose.yml` | Satu-satunya berkas compose: semua layanan, PostgreSQL 16, MongoDB, dan Redis. |
| `deploy/server/docker-compose.server.yml` | Override untuk server: port dan `APPLICATION_MODULE` per layanan, alamat antarlayanan memakai nama kontainer, batas memori, gateway nginx, MongoDB 7.0, dan database tidak dibuka ke host. |
| `deploy/server/gateway.nginx.conf` | Gateway nginx (port 8080): semua `/api/v3/<layanan>/` dalam satu domain. |
| `deploy/server/.env.example` | Templat `.env` server. |
| `deploy/server/deploy.sh` | Build layanan yang berubah → migrasi → jalankan → cek kesehatan → rollback bila gagal. |

## Semua di Docker, satu mesin

Untuk mencoba seluruh tumpukan di satu mesin tanpa Node.js lokal:

```bash
cp .env.example .env          # isi kredensial & SECRET_KEY
npm run stack:up              # = docker compose up -d --build
npm run stack:down            # hentikan & hapus kontainer (volume data tetap)
```

`docker-compose.yml` saja memberi semua layanan satu `.env` root yang sama, sehingga port, `APPLICATION_MODULE`, dan alamat antarlayanan per layanan belum diatur. **Untuk server, selalu pakai override** `deploy/server/docker-compose.server.yml`, cara termudahnya lewat `deploy.sh`.

## Server dengan `deploy.sh`

Rahasia server disimpan **di luar repo**, di `~/.opensimrs/.env` (lokasi bisa diganti dengan `OPENSIMRS_STATE_DIR`).

```bash
git clone https://github.com/tulisankode/opensimrs.git /opt/opensimrs
cd /opt/opensimrs
mkdir -p ~/.opensimrs
cp deploy/server/.env.example ~/.opensimrs/.env
chmod 600 ~/.opensimrs/.env
nano ~/.opensimrs/.env                       # isi semua rahasia
SERVER_HOST=simrs.contoh.id ./deploy/server/deploy.sh
```

### Isi `~/.opensimrs/.env`

- `DB_*`, `MONGO_*`, `REDIS_*`: kata sandi kuat. `MONGO_DB_AUTH_SOURCE=admin` (layanan memakai akun root MongoDB dari `MONGO_DB_USERNAME`/`MONGO_DB_PASSWORD`).
- `SECRET_KEY`, `API_KEY_SECRET`, `API_KEY_CHECK_NORM`, `ADMISI_SECRET_KEY`, `ANTRIAN_KEY_SECRET`: nilai acak, sama di semua layanan.
- `PUBLIC_API_URL`: alamat API yang dibuka ke browser, mis. `https://api.simrs.contoh.id`. Bila kosong, memakai `http://SERVER_HOST:8080`.
- `FRONTEND_ALLOWED_HOSTS`: domain aplikasi, dipisah koma, mis. `simrs.contoh.id`.
- `SEED_ADMIN_PASSWORD` dan `SEED_ADMIN_USERNAME` (opsional): membuat akun admin saat deploy. Kosongkan lagi setelah penyiapan awal.

### Yang dilakukan `deploy.sh`

1. Menolak berjalan bila ruang disk kosong di bawah `MIN_FREE_GB` (bawaan 8 GB).
2. Menyalin `~/.opensimrs/.env` ke `.env` root.
3. Menulis `frontend-service/.env.production.local` dari `PUBLIC_API_URL` dengan `VITE_KEEP_API_HOST=true`, sehingga semua API frontend lewat gateway.
4. Menandai image yang sedang berjalan sebagai `:previous` (untuk rollback).
5. Membangun **hanya layanan yang berubah** (berdasarkan hash folder layanan, folder `packages/` untuk layanan yang memakai SDK, dan env frontend), satu per satu agar RAM tidak habis.
6. Menyalakan PostgreSQL, MongoDB, dan Redis, lalu menunggu PostgreSQL siap. Start pertama memuat `schema.sql`.
7. Menjalankan migrasi (`sequelize-cli db:migrate`) dari kontainer Node sementara, ditambah seeder admin bila `SEED_ADMIN_PASSWORD` diisi.
8. Menjalankan semua layanan dan gateway.
9. **Health check**: setiap port yang dibuka harus menjawab, dan `satusehat-service` serta `bpjs-service` diperiksa lewat gateway (`/api/v3/satusehat/health`, `/api/v3/bpjs/health`).
10. Bila sehat, mencatat hasil build dan membersihkan cache build. Bila tidak, menampilkan status port, lalu **rollback** ke image `:previous` dan keluar dengan galat.

### Variabel saat menjalankan

| Variabel | Fungsi |
|---|---|
| `SERVER_HOST` | Bawaan `localhost`. Dipakai untuk alamat API bawaan dan pesan akhir. |
| `OPENSIMRS_STATE_DIR` | Lokasi `.env` server (bawaan `~/.opensimrs`). |
| `FORCE_BUILD=1` | Membangun ulang semua image. |
| `MIN_FREE_GB` | Pengaman ruang disk (bawaan 8). |
| `CONTAINER_CLI` | `docker` (bawaan) atau `podman`. |

### Dengan Podman

`deploy.sh` bisa memakai Podman sebagai pengganti Docker. Override server memakai tag `!reset` (Compose v2.24+), jadi `podman compose` harus memakai **docker-compose v2** sebagai provider, bukan `podman-compose` (Python).

```bash
brew install podman docker-compose
podman machine init --cpus 4 --memory 8192 --disk-size 60 opensimrs   # VM bawaan terlalu kecil
podman machine start opensimrs
# arahkan nama image pendek ke Docker Hub agar build non-interaktif tidak gagal "short-name resolution"
podman machine ssh opensimrs 'mkdir -p ~/.config/containers && printf "unqualified-search-registries = [\"docker.io\"]\nshort-name-mode = \"permissive\"\n" > ~/.config/containers/registries.conf'
podman compose version            # harus menyebut "Docker Compose version v2.x"
CONTAINER_CLI=podman SERVER_HOST=simrs.contoh.id ./deploy/server/deploy.sh
```

- Mode *rootless* cukup karena semua port di atas 1024.
- Disk VM tumbuh sesuai isi; build pertama bisa memakan lebih dari 10 GB. Bersihkan cache dengan `podman image prune`.
- VM harus menyala agar layanan berjalan. Setelah server restart, jalankan `podman machine start opensimrs`; kontainer memakai `restart: unless-stopped` dan ikut menyala.

### Data awal

Saat ini **belum ada wizard instalasi** yang membuat faskes dan superadmin pertama tanpa data demo. Cara sementara yang disarankan, dilakukan **sekali sebelum ada data nyata**:

1. Jalankan seeder demo dengan `DEMO_PASSWORD` yang **kuat dan rahasia** (bukan `Demo@2026`).
2. Login sebagai `superadmin`, lalu segera ganti kata sandinya.
3. Buat faskes Anda, atur segmennya di **Setting › Manajemen Modul**, lalu siapkan akun admin faskes.
4. Nonaktifkan faskes dan akun demo, lalu kosongkan `DEMO_PASSWORD` di `.env` server.

Contoh menjalankan seeder dari kontainer Node sementara:

```bash
set -a; . ./.env; set +a
docker run --rm -it --network opensimrs_opensimrs -v "$PWD:/app" -w /app \
  -e DB_HOST=db -e DB_PORT=5432 -e DB_NAME -e DB_USERNAME -e DB_PASSWORD -e DEMO_PASSWORD \
  node:22-alpine sh -c 'npm ci --no-audit --no-fund --ignore-scripts && node database/demo/seed-demo.cjs'
```

Alternatifnya, isi `SEED_ADMIN_PASSWORD` agar `deploy.sh` menjalankan seeder admin. Seeder ini menyalin faskes, peran, dan izin dari akun templat `superadmin`, sehingga membutuhkan akun itu sudah ada.

## Server Docker secara manual

Langkah yang sama dengan `deploy.sh`, bila Anda ingin mengendalikan setiap tahap:

```bash
# 1. .env dari templat server, lalu isi semua rahasia
cp deploy/server/.env.example .env

# 2. Env frontend (dibakar saat build): tulis frontend-service/.env.production.local
#    dengan VITE_KEEP_API_HOST=true dan semua VITE_BASE_* = https://api.simrs.contoh.id/api/v3/...

# 3. Infrastruktur & build
COMPOSE="docker compose -p opensimrs -f docker-compose.yml -f deploy/server/docker-compose.server.yml"
$COMPOSE up -d --wait db mongodb redis          # tunggu schema.sql selesai dimuat (1–3 menit)
$COMPOSE build

# 4. Migrasi dari kontainer Node sementara (jaringan Compose: opensimrs_opensimrs)
set -a; . ./.env; set +a
docker run --rm --network opensimrs_opensimrs -v "$PWD:/app" -w /app \
  -e DB_HOST=db -e DB_PORT=5432 -e DB_NAME -e DB_USERNAME -e DB_PASSWORD \
  node:22-alpine sh -c "npm ci --no-audit --no-fund --ignore-scripts && npx sequelize-cli db:migrate"

# 5. Jalankan semua layanan + gateway
$COMPOSE up -d
$COMPOSE ps
```

Isi lengkap `.env.production.local` sama dengan yang ditulis `deploy.sh`; lihat [Konfigurasi](/memulai/konfigurasi#env-frontend) untuk daftar variabel `VITE_BASE_*`.

## Server tanpa Docker

Cara ini setara dengan Docker: PostgreSQL 16, MongoDB 7, Redis 7, dan Node.js 22 dipasang langsung di sistem operasi.

1. **Pasang perangkat lunak** dan siapkan database: buat role dan database `opensimrs`, muat `schema.sql`, buat akun MongoDB di database `admin` (cocok dengan `MONGO_DB_AUTH_SOURCE=admin`), lalu aktifkan autentikasi MongoDB.
2. **Redis**: dengar hanya di `127.0.0.1` (`bind 127.0.0.1 -::1`, `protected-mode yes`; contoh ada di `redis.conf` root repo), aktifkan `requirepass`, dan isi `REDIS_PASSWORD` di semua `.env`.
3. **`.env`, dependensi, migrasi**: isi `.env` root dan tiap layanan ([Konfigurasi](/memulai/konfigurasi)) dengan `SYNC_DB=false`, `NODE_ENV=production`, dan alamat antarlayanan `http://127.0.0.1:<port>`; lalu `npm run install:all` dan `npm run db:migrate`.

### Proses manager

Jalankan setiap layanan sebagai proses tersendiri yang otomatis hidup kembali.

::: code-group
```bash [pm2]
npm install -g pm2
pm2 start npm --name opensimrs-auth --cwd /opt/opensimrs/auth-service -- run start
# ulangi untuk semua layanan, lalu:
pm2 save
pm2 startup
```
```ini [systemd]
# /etc/systemd/system/opensimrs-auth.service
[Service]
WorkingDirectory=/opt/opensimrs/auth-service
ExecStart=/usr/bin/npm run start
Restart=always
User=opensimrs
Environment=NODE_ENV=production

# lalu: systemctl enable --now opensimrs-auth
```
:::

Periksa skrip `start` di `package.json` tiap layanan; layanan integrasi memakai `node src/server.js`.

### Frontend

Bangun sekali dengan env produksi (`frontend-service/.env.production.local`), lalu sajikan folder `frontend-service/dist/` sebagai berkas statis lewat nginx:

```bash
npm --prefix frontend-service run build-only
```

### Gateway nginx

Pakai `deploy/server/gateway.nginx.conf` sebagai acuan pemetaan `/api/v3/<layanan>/` ke port layanan. Ganti nama kontainer (`auth-service:8083`, dst.) dengan `127.0.0.1:<port>` dan hapus baris `resolver`. Untuk instalasi native, `node scripts/gateway-lokal.mjs --host 127.0.0.1 --keluar <berkas.conf>` membuatkan konfigurasi itu dari berkas acuan (ubah `listen` sesuai kebutuhan).

## HTTPS di depan gateway

Pasang reverse proxy (nginx, Caddy, Traefik) di server yang meneruskan:

| Domain | Tujuan |
|---|---|
| `https://simrs.contoh.id` | `http://127.0.0.1:5520` (frontend) |
| `https://api.simrs.contoh.id` | `http://127.0.0.1:8080` (gateway API) |

Contoh minimal nginx untuk domain API:

```nginx
server {
    listen 443 ssl;
    server_name api.simrs.contoh.id;
    ssl_certificate     /etc/letsencrypt/live/api.simrs.contoh.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.simrs.contoh.id/privkey.pem;
    client_max_body_size 25m;
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Buat blok serupa untuk domain frontend ke port 5520, dan pastikan `FRONTEND_ALLOWED_HOSTS` memuat domain itu. Gateway sendiri menjawab `GET /health` dengan `{"status":"ok"}`.

## Praktik keamanan

### Port yang boleh dibuka

| Port | Arah | Keterangan |
|---|---|---|
| 443 (dan 80 untuk pengalihan/sertifikat) | Terbuka ke jaringan | Reverse proxy HTTPS. |
| 22 | Terbatas | SSH untuk admin yang ditunjuk; gunakan kunci SSH. |
| 5520, 8080 | Hanya lokal | Diteruskan reverse proxy; jangan dibuka langsung. |
| 8081–8096 | Hanya lokal | Dibuka ke host oleh compose untuk health check `deploy.sh`. |
| 5432, 27017, 6379 | **Jangan dibuka** | Override server tidak membukanya ke host. Pada instalasi native, dengar hanya di `127.0.0.1`. |

### Daftar periksa

- [ ] HTTPS aktif; firewall hanya membuka 80/443 (dan SSH).
- [ ] Semua sandi dan kunci baru dan acak; `.env` tersimpan di luar repo dengan `chmod 600`.
- [ ] `SECRET_KEY` berbeda dari lingkungan lain; `SYNC_DB=false`; `NODE_ENV=production`.
- [ ] Production tanpa data demo dan tanpa `DEMO_PASSWORD`; akun/faskes demo dinonaktifkan; sandi superadmin diganti.
- [ ] Integrasi diuji di sandbox sebelum memakai endpoint produksi.
- [ ] Cadangan harian PostgreSQL + MongoDB berjalan dan pemulihannya sudah diuji ([Pembaruan & Cadangan](/memulai/pembaruan-cadangan)).
- [ ] Akses server dan log hanya untuk orang yang ditunjuk, dengan akun pribadi.

## Langkah berikutnya

- [Pembaruan & Cadangan](/memulai/pembaruan-cadangan)
- [Konfigurasi](/memulai/konfigurasi)
- [Gambaran Sistem](/arsitektur/gambaran)
