# Akses Lewat Domain

Halaman ini menjelaskan cara membuka instalasi lokal OpenSIMRS (`npm run dev`) dari luar lewat domain HTTPS, misalnya untuk uji coba bersama tim dari mesin kantor melalui **Cloudflare Tunnel** atau reverse proxy HTTPS. Hasil akhirnya: aplikasi terbuka di `https://simrs.contoh.id` dan semua API lewat `https://api-simrs.contoh.id`.

::: info Untuk server production
Halaman ini untuk instalasi lokal yang dibuat dengan installer. Untuk server staging/production, pakai [Deployment](/memulai/deployment), yang sudah menyertakan gateway dan HTTPS.
:::

## Mengapa butuh gateway

Saat berjalan lokal, setiap layanan mendengar di port sendiri (8081–8100) dan tidak melayani HTTPS. Tunnel atau reverse proxy biasanya hanya meneruskan satu alamat per hostname. Karena itu semua API dilewatkan ke **satu gateway nginx di port 8080**, yang meneruskan `/api/v3/<layanan>/` ke port layanan yang sesuai.

```text
Browser ──https──▶ simrs.contoh.id      ──▶ tunnel/proxy ──▶ http://localhost:5520  (frontend Vite)
Browser ──https──▶ api-simrs.contoh.id  ──▶ tunnel/proxy ──▶ http://localhost:8080  (gateway nginx)
                                                                 └─▶ /api/v3/auth/  → :8083
                                                                 └─▶ /api/v3/admisi/ → :8081
                                                                 └─▶ ... (semua layanan)
```

## Menjalankan installer dengan domain

::: code-group
```bash [macOS / Linux]
./install.sh --domain simrs.contoh.id --api api-simrs.contoh.id
# boleh digabung dengan opsi lain, mis. --podman
```
```powershell [Windows]
.\install.cmd -Domain simrs.contoh.id -Api api-simrs.contoh.id
```
:::

`--domain` dan `--api` wajib dipakai bersama. Skema (`https://`) dan path di belakang domain dibuang otomatis, dan nama domain yang tidak sah ditolak.

Yang dilakukan installer:

1. **Menulis `frontend-service/.env.local`** (diabaikan git), yang menimpa `frontend-service/.env` saat Vite berjalan:
   - `ALLOWED_HOSTS=<domain>,<api>` agar Vite menerima host tersebut;
   - `VITE_KEEP_API_HOST=true` agar frontend memakai alamat API apa adanya, tanpa menempelkan port layanan ke domain;
   - semua `VITE_BASE_*` yang sebelumnya `http://localhost:<port>` diganti menjadi `https://<api>/api/v3/...`.

   Bila sudah ada `.env.local` lama yang bukan buatan installer, berkas itu dicadangkan dulu (`.env.local.bak.<waktu>`).
2. **Membuat konfigurasi gateway** `~/.opensimrs/gateway-lokal.conf` dengan `node scripts/gateway-lokal.mjs`. Skrip ini menurunkan konfigurasi dari `deploy/server/gateway.nginx.conf`, lalu mengganti upstream nama kontainer (`auth-service:8083`, dst.) menjadi alamat mesin Anda.
3. **Menjalankan kontainer nginx `opensimrs-gateway`** di port 8080 dengan `--restart=always`, memakai Podman (atau Docker bila Podman tidak ada). Setelah itu installer memeriksa `http://localhost:8080/health`.

Bila Podman maupun Docker tidak tersedia, konfigurasinya tetap dibuat agar bisa Anda pakai di nginx yang terpasang langsung di mesin (ubah `listen` menjadi 8080). Bila port 8080 sudah dipakai program lain, gateway tidak dijalankan; hentikan program itu lalu jalankan ulang installer.

### Contoh isi `.env.local`

```dotenv
# Dibuat install.sh --domain simrs.contoh.id --api api-simrs.contoh.id. Hapus berkas ini untuk kembali ke http://localhost:<port>.
ALLOWED_HOSTS=simrs.contoh.id,api-simrs.contoh.id
VITE_KEEP_API_HOST=true
VITE_BASE_URL=https://api-simrs.contoh.id
VITE_BASE_AUTH=https://api-simrs.contoh.id/api/v3/auth
VITE_URL_SETTING=https://api-simrs.contoh.id/api/v3/setting
# ... VITE_BASE_* lainnya dengan pola yang sama
```

### Membuat konfigurasi gateway secara manual

```bash
node scripts/gateway-lokal.mjs --keluar ~/.opensimrs/gateway-lokal.conf --host host.containers.internal
```

| `--host` | Dipakai bila nginx berjalan di |
|---|---|
| `host.containers.internal` | Kontainer Podman (bawaan). |
| `host.docker.internal` | Kontainer Docker. |
| `127.0.0.1` | nginx yang terpasang langsung di mesin. |

## Memetakan tunnel atau reverse proxy

Arahkan dua hostname ke mesin yang menjalankan OpenSIMRS:

| Hostname | Layanan |
|---|---|
| `simrs.contoh.id` | `http://localhost:5520` (frontend) |
| `api-simrs.contoh.id` | `http://localhost:8080` (gateway API) |

Di Cloudflare Tunnel, keduanya didaftarkan sebagai *public hostname* pada tunnel yang sama. Di reverse proxy HTTPS (nginx, Caddy, Traefik), buat dua blok server seperti contoh di [Deployment](/memulai/deployment#https-di-depan-gateway).

## Memeriksa

```bash
curl https://api-simrs.contoh.id/health
# {"status":"ok"}
```

Lalu buka `https://simrs.contoh.id` dan login seperti biasa. Bila `/health` menjawab tetapi login gagal, pastikan semua layanan sudah berjalan (`npm run dev`) dan frontend sudah dimulai ulang setelah `.env.local` dibuat.

## Menambah domain lain

Vite hanya menerima host yang terdaftar. Untuk membuka frontend lewat domain tambahan (mis. `uji.simrs.contoh.id`), tambahkan ke `ALLOWED_HOSTS` di `frontend-service/.env.local`, dipisah koma:

```dotenv
ALLOWED_HOSTS=simrs.contoh.id,api-simrs.contoh.id,uji.simrs.contoh.id
```

Mulai ulang frontend (`npm run dev:frontend` atau `npm run dev`). Anda tidak perlu mengubah `vite.config.ts`, karena `ALLOWED_HOSTS` dibaca dari variabel lingkungan maupun berkas `.env*` frontend.

## Setelah mesin dinyalakan ulang

Kontainer gateway memakai `--restart=always`, tetapi di macOS VM Podman harus menyala dulu. Bila gateway tidak menjawab:

```bash
podman machine start          # macOS dengan Podman
podman start opensimrs-gateway
# Docker: docker start opensimrs-gateway
```

## Kembali ke akses lokal

Hapus `frontend-service/.env.local`, lalu mulai ulang frontend. Aplikasi kembali memakai `http://localhost:<port>` dari `frontend-service/.env`. `uninstall.sh` juga ikut menghapus kontainer gateway, `~/.opensimrs/gateway-lokal.conf`, dan `.env.local` buatan installer.

## Lihat juga

- [Konfigurasi](/memulai/konfigurasi#vite-keep-api-host)
- [Deployment](/memulai/deployment)
- [Gambaran Sistem](/arsitektur/gambaran)
