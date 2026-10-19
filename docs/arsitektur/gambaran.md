# Gambaran Sistem

Halaman ini memberi gambaran arsitektur OpenSIMRS untuk pengembang dan tim IT: komponen apa saja yang berjalan, port dan awalan rutenya, serta di mana data disimpan. Bacalah halaman ini sebelum menyentuh kode atau memasang di server.

## Ringkasan

OpenSIMRS adalah SIMRS berbasis *microservice* dalam satu repo (**monorepo**, tanpa git submodule):

- **19 layanan backend** Node.js + Express, masing-masing dengan port sendiri dan awalan rute `/api/v3/...`, ditambah **SIMRS Studio** (`studio-service`) yang opsional;
- **satu frontend** Vue 3 + PrimeVue + Tailwind (`frontend-service`, port 5520);
- **PostgreSQL** sebagai satu database bersama `opensimrs`;
- **MongoDB** untuk isi rekam medis elektronik;
- **Redis** untuk token sesi dan cache izin;
- **gateway nginx** (port 8080) yang menyatukan semua API dalam satu domain pada deploy server.

Satu instalasi bisa melayani **banyak faskes**. Data setiap faskes dipisahkan dengan `faskes_uuid` yang diambil dari token login.

```text
                     frontend-service (Vue 3, port 5520)
                                    │
                                    │ REST /api/v3/<layanan>/...   (server: lewat gateway nginx :8080)
 ┌──────────┬──────────────┬────────┼─────────┬──────────────┬──────────┐
 auth   admisi/antrian  rawat-jalan  rekamedis  farmasi/stok  payment  ... (19 layanan Express)
 └──────────┴──────────────┴────────┼─────────┴──────────────┴──────────┘
                                    │
       PostgreSQL (satu database bersama) · MongoDB (isi RME) · Redis (token & cache izin)
                                    │
 satusehat-service (FHIR Kemenkes) · bpjs-service (PCare/VClaim) · lab-service ⇄ LIS · penunjang-service ⇄ PACS/UTD
```

## Layanan dan port

| Port | Layanan | Folder | Awalan API |
|---|---|---|---|
| 5520 | Frontend (aplikasi web) | `frontend-service` | – |
| 8081 | Admisi (pasien & registrasi) | `admisi-service` | `/api/v3/admisi` |
| 8082 | Antrian (jadwal, layar TV, APM) | `antrian-service` | `/api/v3/antrian` |
| 8083 | Auth (login, JWT, izin) | `auth-service` | `/api/v3/auth` |
| 8084 | Farmasi | `farmasi-service` | `/api/v3/farmasi` |
| 8085 | IGD | `igd-service` | `/api/v3/pelayanan` |
| 8086 | Inventory (gudang) | `inventory-service` | `/api/v3/inventory` |
| 8087 | Laboratorium + bridging LIS | `lab-service` | `/api/v3/lab`, `/adam-lis` |
| 8088 | Laporan & dashboard | `laporan-service` | `/api/v3/laporan` |
| 8089 | Pembayaran (kasir, tagihan) | `payment-service` | `/api/v3/payment` |
| 8091 | Rawat Inap | `rawat-inap-service` | `/api/v3/ranap` |
| 8092 | Rawat Jalan | `rawat-jalan-service` | `/api/v3/rajal` |
| 8093 | Rekam Medis (RME) | `rekamedis-service` | `/api/v3/rekam-medis` |
| 8094 | Setting (profil faskes, Manajemen Modul, integrasi, Audit Trail) | `setting-service` | `/api/v3/setting` |
| 8095 | Stok Farmasi | `stok-farmasi-service` | `/api/v3/stok` |
| 8096 | Datamaster | `datamaster-service` | `/api/v3/datamaster` |
| 8097 | Integrasi SATUSEHAT | `satusehat-service` | `/api/v3/satusehat` |
| 8098 | Integrasi BPJS (PCare & VClaim) | `bpjs-service` | `/api/v3/bpjs` |
| 8099 | Penunjang (Fisioterapi, Radiologi, MCU, Patologi Anatomi, Mikrobiologi, Bank Darah, CSSD, dan modul penunjang lain) | `penunjang-service` | `/api/v3/penunjang`, `/adam-pacs`, `/adam-pa-lis`, `/adam-utd`, `/adam-hdis`, `/adam-lis/mikrobiologi` |
| 8100 | Program Puskesmas (KIA/KB, imunisasi, MTBS, sasaran, UKM, laporan dinkes) | `program-puskesmas-service` | `/api/v3/program-puskesmas` |
| 8090 | SIMRS Studio (opsional, mode pengembang berbasis AI) | `studio-service` | `/api/v3/studio` |

Awalan `/adam-*` adalah titik masuk hasil dari sistem eksternal (LIS, PACS/RIS, sistem patologi anatomi, UTD, HDIS). Titik masuk ini tidak memakai token login, melainkan kunci masuk per koneksi (`?key=<kunci masuk>`). Titik masuk milik `penunjang-service` juga tersedia dengan awalan `/api/v3/penunjang/...` (mis. `/api/v3/penunjang/radiologi/pacs/hasil`), yang ikut diteruskan gateway. Lihat [LIS & PACS](/integrasi/lis-pacs).

Infrastruktur dan alat bantu:

| Port | Komponen |
|---|---|
| 5432 | PostgreSQL |
| 27017 | MongoDB |
| 6379 | Redis |
| 8080 | Gateway nginx (deploy server dan [akses lewat domain](/memulai/akses-domain)) |
| 2312, 2313, 2412, 2413 | LIS, sistem PA, PACS/RIS, dan UTD tiruan untuk pengujian (opsional, `scripts/*-tiruan.mjs`) |

::: info SIMRS Studio
`studio-service` hanya aktif bila `STUDIO_PENGEMBANG=aktif` dan superadmin menyalakan Mode Pengembang di **Setting › System**. Layanan ini dijalankan langsung di mesin pengembang dan tidak ikut dibangun oleh `deploy.sh`. Lihat [SIMRS Studio](/studio/).
:::

## Frontend

`frontend-service` dibangun dengan **Vue 3 + TypeScript**, **PrimeVue**, **Pinia**, dan **Tailwind**. Validasi form memakai vee-validate + yup, dan PDF dibuat dengan pdfmake.

- Alamat setiap layanan dibaca dari variabel `VITE_BASE_*` ([Konfigurasi](/memulai/konfigurasi#env-frontend)).
- Instance axios mengubah request ke `snake_case` dan respons ke `camelCase` secara otomatis, sehingga kode Vue memakai `camelCase` (`noRm`, `dischargeDate`).
- Menu, rute, tombol, dan bagian form disaring menurut modul yang aktif di faskes dan izin pengguna ([Manajemen Modul & Fitur](/arsitektur/manajemen-modul)).

## Penyimpanan data

### PostgreSQL

Semua layanan memakai **satu database PostgreSQL bersama** (`opensimrs`). Sebagian besar layanan mengaksesnya lewat Sequelize dan definisi model bersama di paket `@opensimrs/model-sdk`. Layanan `bpjs-service`, `satusehat-service`, dan `penunjang-service` memakai driver `pg` secara langsung.

Struktur skema dikelola migrasi terpusat di `database/migrations/`; `SYNC_DB=false` mencegah ORM mengubah tabel. Lihat [Basis Data & Migrasi](/arsitektur/basis-data-migrasi).

### MongoDB

MongoDB menyimpan **isi rekam medis elektronik**, antara lain koleksi `rekam_medises` (satu dokumen per kunjungan), `sessions` (isi asesmen per sesi, satu field per bagian), `catatan_perawats`, dan `instruksi_medises`. Tabel kunjungan di PostgreSQL merujuk dokumen RME lewat `rekam_medis_uuid`.

Karena itu rekam medis seorang pasien tersebar di dua basis data. Cadangkan keduanya bersamaan ([Pembaruan & Cadangan](/memulai/pembaruan-cadangan)).

### Redis

Redis menyimpan sesi login: setiap token yang aktif punya kunci `token-<…>` berisi daftar izin pengguna. Middleware di setiap layanan menolak token yang kuncinya sudah tidak ada di Redis, jadi logout langsung berlaku di semua layanan. Lihat [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin).

## SDK bersama

Tiga paket di folder `packages/` dipakai bersama oleh layanan:

| Paket | Isi |
|---|---|
| `@opensimrs/model-sdk` | Definisi model Sequelize bersama, helper umum, dan helper [Audit Trail](/arsitektur/audit-trail). |
| `@opensimrs/authorization-sdk` | Middleware JWT HS256 + pemeriksaan sesi di Redis. |
| `@opensimrs/permission-sdk` | Middleware pemeriksaan izin per rute (modul → submodul → fitur → aksi). |

Layanan memasangnya lewat `"@opensimrs/<sdk>": "file:../packages/<sdk>"` dengan `install-links=true` di `.npmrc`, sehingga SDK terpasang sebagai **salinan** dan Sequelize/Mongoose tetap satu instans per layanan. Setelah mengubah SDK, jalankan `npm run sdk:refresh` dan naikkan versi paketnya.

## Gateway nginx

Pada deploy server, browser tidak mengakses port layanan satu per satu. Gateway nginx (`deploy/server/gateway.nginx.conf`, port 8080) meneruskan permintaan berdasarkan awalan path:

```nginx
location = /health { return 200 '{"status":"ok"}'; }
location ^~ /api/v3/auth/    { proxy_pass http://auth-service:8083; }
location ^~ /api/v3/admisi/  { proxy_pass http://admisi-service:8081; }
# ... satu baris per layanan
location / { return 404 '{"message":"Endpoint tidak ditemukan"}'; }
```

Potongan di atas disederhanakan; berkas aslinya memakai variabel upstream dan resolver DNS kontainer agar gateway tetap menyala walau salah satu layanan belum siap. Batas ukuran body bawaan 25 MB. Frontend dibangun dengan `VITE_KEEP_API_HOST=true` agar semua panggilan API memakai satu domain gateway.

## Lihat juga

- [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin)
- [Basis Data & Migrasi](/arsitektur/basis-data-migrasi)
- [Konvensi API](/arsitektur/konvensi-api)
- [Struktur Direktori](/memulai/struktur-direktori)
