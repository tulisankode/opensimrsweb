# Konfigurasi

Halaman ini menjelaskan berkas `.env` yang dibutuhkan OpenSIMRS: `.env` root, `.env` tiap layanan backend, dan `.env` frontend. Bila Anda memakai [installer](/memulai/instalasi#installer-cepat), semua berkas ini sudah dibuat otomatis dengan kunci acak. Bacalah halaman ini untuk memahami isinya, menyesuaikannya, atau menyiapkannya secara manual.

::: danger Jangan pernah meng-commit `.env`
Berkas `.env` berisi kata sandi dan kunci, dan sudah tercantum di `.gitignore`. Repo hanya memuat templat `.env.example` tanpa nilai rahasia. Semua contoh di halaman ini memakai nilai pengganti seperti `<isi-acak-32-byte>`; jangan memakainya apa adanya.
:::

## Membuat nilai acak

Setiap kunci dan kata sandi dibuat acak, berbeda untuk setiap lingkungan (development, staging, production):

```bash
openssl rand -hex 32
# tanpa openssl:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Berkas yang dibaca

| Berkas | Dibaca oleh |
|---|---|
| `.env` (root repo) | `docker compose`, migrasi (`npm run db:migrate`), dan skrip data demo (`npm run db:demo:*`). |
| `<layanan>-service/.env` | Layanan itu sendiri saat dijalankan dengan `npm run dev`. |
| `frontend-service/.env` | Frontend Vite. Nilai `VITE_*` dibakar ke bundle saat build. |
| `frontend-service/.env.local` | Menimpa `frontend-service/.env`; dipakai untuk akses lewat domain. |
| `~/.opensimrs/.env` | Server yang dipasang dengan `deploy/server/deploy.sh` (lihat [Deployment](/memulai/deployment)). |

## `.env` root

Contoh isi minimal untuk pengembangan lokal:

```dotenv
# PostgreSQL
DB_DIALECT=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=opensimrs
DB_USERNAME=opensimrs
DB_PASSWORD=<sandi-db>

# MongoDB — akun root dibuat dari nilai ini saat kontainer pertama kali dibuat
MONGO_INITDB_DATABASE=opensimrs
MONGO_DB_NAME=opensimrs
MONGO_DB_HOST=127.0.0.1
MONGO_DB_PORT=27017
MONGO_DB_AUTH_SOURCE=admin
MONGO_DB_USERNAME=opensimrs
MONGO_DB_PASSWORD=<sandi-mongo>

# Redis (lokal: tanpa sandi)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_DATABASE=0
REDIS_USERNAME=
REDIS_PASSWORD=

# Kunci JWT HS256 — SAMA di semua layanan
SECRET_KEY=<isi-acak-32-byte>

# Kata sandi akun demo (bawaan Demo@2026 bila kosong)
DEMO_PASSWORD=
```

Nama database `opensimrs` adalah nama bawaan. Anda boleh memakai nama lain asalkan konsisten di semua `.env`.

## `.env` tiap layanan

Setiap layanan backend membaca `.env` di foldernya sendiri. Isinya sebagian besar sama untuk semua layanan; yang berbeda hanya port dan `APPLICATION_MODULE`.

### Variabel bersama

| Variabel | Fungsi |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DIALECT`, `DB_POOL` | Koneksi PostgreSQL bersama. |
| `MONGO_DB_HOST`, `MONGO_DB_PORT`, `MONGO_DB_NAME`, `MONGO_DB_USERNAME`, `MONGO_DB_PASSWORD`, `MONGO_DB_AUTH_SOURCE` | MongoDB (rekam medis, SATUSEHAT, BPJS, laporan). |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_DATABASE`, `REDIS_USERNAME`, `REDIS_PASSWORD` | Redis (token sesi dan cache izin). Username dan sandi opsional. |
| `SECRET_KEY` | Kunci JWT HS256. **Wajib sama di semua layanan.** |
| `API_BASE=api`, `API_VERSION=v3` | Awalan rute API. |
| `SYNC_DB=false` | Skema dikelola migrasi; ORM tidak boleh mengubah tabel. |
| `APPLICATION_HOST`, `APP_HOST` | Alamat dengar, mis. `0.0.0.0`. |
| `APPLICATION_PORT`, `APP_PORT`, `PORT`, `SERVER_PORT` | Port layanan (lihat catatan di bawah). |
| `APPLICATION_MODULE` | Segmen terakhir awalan API untuk auth (`auth`) dan laporan (`laporan`). |
| `APPLICATION_TIMEZONE` | Zona waktu, mis. `Asia/Jakarta`. |
| `NODE_ENV` | `development` di laptop; `production` di staging dan production. |
| `API_KEY_SECRET`, `API_KEY_CHECK_NORM`, `ADMISI_SECRET_KEY`, `ANTRIAN_KEY_SECRET`, `API_KEY_ANTRIAN` | Kunci internal antarlayanan dan aplikasi mobile. Isi acak dan samakan antara layanan pemanggil dan penerima. |

::: warning Variabel port tidak seragam
Nama variabel port berbeda antarlayanan: ada yang membaca `APPLICATION_PORT`, `APP_PORT`, `PORT`, atau `SERVER_PORT`. Isi **keempatnya** dengan nilai yang sama.
:::

::: warning `SECRET_KEY` harus sama
Token login dibuat `auth-service` dan diperiksa setiap layanan lain dengan `SECRET_KEY` yang sama. Bila berbeda, layanan menolak token dan pengguna seperti "ter-logout" saat membuka modul. Variabel `PRIVATE_KEY`/`PUBLIC_KEY` tidak dipakai lagi. Penjelasan lengkap ada di [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin).
:::

### Alamat antarlayanan

Beberapa layanan memanggil layanan lain. Untuk lokal, isi dengan alamat `localhost`:

```dotenv
DATAMASTER_SERVICE_URL=http://localhost:8096
ADMISI_API_URL=http://localhost:8081/api/v3/admisi
INVENTORY_URL=http://localhost:8086/api/v3
REKAM_MEDIS_URL=http://localhost:8093/api/v3
FARMASI_API_URL=http://localhost:8084/api/v3/farmasi
PATIENT_SERVICE_URL=http://localhost:8081
SETTING_SERVICE_URL=http://localhost:8094
BASE_URL_API_ADMISI=http://localhost:8081/api/v3/admisi
BASE_URL_API_ANTRIAN=http://localhost:8082/api/v3/antrian
BASE_URL_API_FARMASI=http://localhost:8084/api/v3/farmasi
BASE_URL_API_PEMBAYARAN=http://localhost:8089/api/v3/payment/internal
BASE_URL_API_LAB=http://localhost:8087/api/v3/lab
VITE_BASE_ANTRIAN=http://localhost:8082/api/v3/antrian
```

Pada deploy Docker, alamat ini diganti nama kontainer oleh `deploy/server/docker-compose.server.yml`.

### Mode integrasi

```dotenv
SATUSEHAT_MODE=mock          # mock = respons tiruan; nyata = kirim ke SATUSEHAT
SATUSEHAT_LINGKUNGAN=sandbox # sandbox / produksi
BPJS_MODE=mock
BPJS_LINGKUNGAN=development  # development / production
LIS_MODE=nyata
```

Pakai `sandbox`/`development` di luar production. Endpoint produksi hanya dipakai di production setelah uji di sandbox lulus.

### Skrip siap salin

Buat berkas sementara `.env.layanan` di root berisi variabel bersama di atas, lalu salin ke setiap layanan sambil menambahkan port dan `APPLICATION_MODULE`. Berkas ini berisi rahasia: jangan di-commit dan hapus setelah dipakai.

::: code-group
```bash [macOS / Linux / Git Bash]
for pasangan in admisi:8081 antrian:8082 auth:8083 farmasi:8084 igd:8085 inventory:8086 lab:8087 \
  laporan:8088 payment:8089 rawat-inap:8091 rawat-jalan:8092 rekamedis:8093 setting:8094 \
  stok-farmasi:8095 datamaster:8096 satusehat:8097 bpjs:8098 penunjang:8099 studio:8090 program-puskesmas:8100; do
  nama=${pasangan%%:*}; port=${pasangan##*:}
  { cat .env.layanan
    echo "APPLICATION_PORT=$port"; echo "APP_PORT=$port"; echo "PORT=$port"; echo "SERVER_PORT=$port"
    echo "APPLICATION_MODULE=$nama"
  } > "$nama-service/.env"
done
```
```powershell [Windows PowerShell]
$layanan = @{ admisi=8081; antrian=8082; auth=8083; farmasi=8084; igd=8085; inventory=8086; lab=8087;
  laporan=8088; payment=8089; 'rawat-inap'=8091; 'rawat-jalan'=8092; rekamedis=8093; setting=8094;
  'stok-farmasi'=8095; datamaster=8096; satusehat=8097; bpjs=8098; penunjang=8099; studio=8090; 'program-puskesmas'=8100 }
foreach ($n in $layanan.Keys) {
  $p = $layanan[$n]
  $isi = (Get-Content .env.layanan -Raw) + "APPLICATION_PORT=$p`nAPP_PORT=$p`nPORT=$p`nSERVER_PORT=$p`nAPPLICATION_MODULE=$n`n"
  Set-Content -Path "$n-service/.env" -Value $isi -Encoding utf8
}
```
:::

Setiap layanan juga punya `.env.example` di foldernya. Bila port di berkas itu berbeda dari [tabel port](/arsitektur/gambaran#layanan-dan-port), jadikan tabel port sebagai acuan. Variabel paling lengkap terdokumentasi di `.env.example` milik `satusehat-service`, `bpjs-service`, `penunjang-service`, dan `lab-service` (variabel `LIS_*`).

### Variabel opsional per layanan

| Variabel | Layanan | Bawaan |
|---|---|---|
| `BPJS_KUNCI_RAHASIA`, `LIS_KUNCI_RAHASIA`, `INVENTORY_MARKETPLACE_KUNCI_RAHASIA`, `HD_HDIS_KUNCI_RAHASIA` | Kunci enkripsi kredensial integrasi | Kosong = memakai `SECRET_KEY` |
| `BASE_URL_API_INVENTORY` | `penunjang-service` | `http://localhost:8086/api/v3/inventory` |
| `MAX_UPLOAD_BERKAS_SARPRAS_MB` | `penunjang-service` | `5` (1–20) |
| `MAX_UPLOAD_MUTU_MB` | `penunjang-service` | `10` (1–20) |
| `HD_HDIS_TIMEOUT_MS` | `penunjang-service` | `10000` |

## `.env` frontend

Buat `frontend-service/.env` berisi alamat API setiap layanan:

```dotenv
VITE_BASE_URL=http://localhost:8083
VITE_BASE_AUTH=http://localhost:8083/api/v3/auth
VITE_URL_SETTING=http://localhost:8094/api/v3/setting
VITE_BASE_DATAMASTER=http://localhost:8096/api/v3/datamaster
VITE_BASE_PEMBAYARAN=http://localhost:8089/api/v3/payment
VITE_BASE_LABORATORIUM=http://localhost:8087/api/v3/lab
VITE_BASE_ADMISI=http://localhost:8081/api/v3/admisi
VITE_BASE_IGD=http://localhost:8085/api/v3/pelayanan/igd
VITE_BASE_FARMASI=http://localhost:8084/api/v3/farmasi
VITE_BASE_RAWAT_JALAN=http://localhost:8092/api/v3/rawat-jalan
VITE_BASE_REKAM_MEDIS=http://localhost:8093/api/v3
VITE_BASE_RAWAT_INAP=http://localhost:8091/api/v3/ranap
VITE_BASE_INVENTORY=http://localhost:8086/api/v3/inventory
VITE_BASE_DASHBOARD=http://localhost:8088/api/v3/laporan
VITE_BASE_ANTRIAN=http://localhost:8082/api/v3/antrian
VITE_BASE_STOK=http://localhost:8095/api/v3
VITE_BASE_SATUSEHAT=http://localhost:8097/api/v3/satusehat
VITE_BASE_BPJS=http://localhost:8098/api/v3/bpjs
VITE_BASE_PENUNJANG=http://localhost:8099/api/v3/penunjang
VITE_BASE_STUDIO=http://localhost:8090/api/v3/studio
VITE_BASE_PROGRAM_PUSKESMAS=http://localhost:8100/api/v3/program-puskesmas
```

::: info Rawat jalan
`VITE_BASE_RAWAT_JALAN` ditulis dengan akhiran `/api/v3/rawat-jalan`, tetapi frontend menormalkannya ke awalan `/api/v3/rajal` yang dipakai `rawat-jalan-service`.
:::

- Nilai `VITE_*` **dibakar saat build**. Setelah mengubahnya, mulai ulang frontend (development) atau build ulang (server).
- Di server, deploy menulis `frontend-service/.env.production.local` dari `PUBLIC_API_URL` (lihat [Deployment](/memulai/deployment)).

### `VITE_KEEP_API_HOST`

Bawaannya, bila aplikasi dibuka dari host selain `localhost` (dan nama host itu tidak memuat kata `opensimrs`), frontend menyusun alamat API dari **host halaman** ditambah **port** di `VITE_BASE_*`. Cara ini cocok untuk mengakses instalasi lewat IP di jaringan lokal.

Bila semua API berada di satu domain atau gateway (mis. `https://api-simrs.contoh.id`), isi:

```dotenv
VITE_KEEP_API_HOST=true
```

Frontend lalu memakai alamat di `VITE_BASE_*` apa adanya. Untuk pengembangan lokal biasa, biarkan kosong.

### `ALLOWED_HOSTS`

Server Vite hanya menerima host `localhost` dan `127.0.0.1`. Untuk membuka frontend lewat domain lain, daftarkan host tambahan (dipisah koma) lewat `ALLOWED_HOSTS`, baik sebagai variabel lingkungan maupun di berkas `.env*` frontend. Cara yang disarankan adalah `frontend-service/.env.local`:

```dotenv
ALLOWED_HOSTS=simrs.contoh.id,api-simrs.contoh.id
```

`install.sh --domain` menulis berkas ini secara otomatis. Lihat [Akses Lewat Domain](/memulai/akses-domain).

Pada deploy Docker, nilainya diambil dari `FRONTEND_ALLOWED_HOSTS` di `.env` server.

## Kredensial integrasi per faskes

Kredensial **SATUSEHAT** (Client ID/Secret, Organization ID), **BPJS PCare/VClaim** (cons-id, secret, user key, dst.), dan **LIS** (URL, API key, kode RS/lab) **tidak** ditaruh di `.env`. Semuanya diisi per faskes di aplikasi: **Setting › Konfigurasi Integrasi**, dan rahasianya disimpan terenkripsi di database.

::: danger Jangan mengganti kunci enkripsi sembarangan
Rahasia integrasi dienkripsi dengan `BPJS_KUNCI_RAHASIA`/`LIS_KUNCI_RAHASIA` (atau `SECRET_KEY` bila kosong). Mengganti kunci itu setelah data integrasi tersimpan membuat data lama tidak bisa dibaca, sehingga kredensial harus diisi ulang. Merotasi `SECRET_KEY` juga membuat semua pengguna harus login ulang.
:::

## Aturan per lingkungan

| Variabel | Development | Staging | Production |
|---|---|---|---|
| `NODE_ENV` | `development` | `production` | `production` |
| `DB_PASSWORD`, `MONGO_DB_PASSWORD` | sandi lokal | `<acak>` | `<acak>` |
| `REDIS_PASSWORD` | kosong | `<acak>` (disarankan) | `<acak>` (disarankan) |
| `SECRET_KEY` | `<acak>` | `<acak>`, beda dari dev | `<acak>`, beda dari staging |
| `SYNC_DB` | `false` | `false` | `false` |
| `DEMO_PASSWORD` | kosong (`Demo@2026`) | sandi kuat | **tidak diisi; data demo dilarang** |
| `SATUSEHAT_MODE` / `SATUSEHAT_LINGKUNGAN` | `mock` / `sandbox` | `nyata` / `sandbox` | `nyata` / `produksi` |
| `BPJS_MODE` / `BPJS_LINGKUNGAN` | `mock` / `development` | `nyata` / `development` | `nyata` / `production` |
| `PUBLIC_API_URL` | – | `https://api-staging.simrs.contoh.id` | `https://api.simrs.contoh.id` |
| `FRONTEND_ALLOWED_HOSTS` | – | `staging.simrs.contoh.id` | `simrs.contoh.id` |

Aturan penting lainnya:

- Simpan `.env` server di luar folder repo (`~/.opensimrs/.env`) dengan hak akses terbatas (`chmod 600`).
- `SECRET_KEY` berbeda di setiap lingkungan, agar token staging tidak berlaku di production.
- Rotasi kunci bila bocor, saat pemegangnya keluar, atau secara berkala.

## Lihat juga

- [Instalasi](/memulai/instalasi)
- [Deployment](/memulai/deployment)
- [Akses Lewat Domain](/memulai/akses-domain)
- [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin)
