# Struktur Direktori

OpenSIMRS disimpan dalam **satu monorepo**: semua layanan backend, frontend, SDK bersama, migrasi database, skrip, dan dokumen berada di satu repositori sebagai folder biasa (tanpa git submodule). Halaman ini menjelaskan isi setiap folder dan pola folder di dalam satu layanan, agar Anda tahu di mana harus mencari atau menambah kode.

## Gambaran umum

```
opensimrs/
├── admisi-service/              # layanan backend (Express), satu folder per domain
├── antrian-service/
├── auth-service/
├── ...                          # layanan *-service lainnya
├── penunjang-service/
├── program-puskesmas-service/
├── bpjs-service/                # integrasi BPJS (PCare, VClaim, Antrean)
├── satusehat-service/           # integrasi SATUSEHAT (FHIR Kemenkes)
├── studio-service/              # SIMRS Studio (opsional, mode pengembang)
├── frontend-service/            # aplikasi web Vue 3
├── packages/                    # SDK bersama @opensimrs/*
├── database/
│   ├── migrations/              # migrasi sequelize-cli (.cjs)
│   ├── data/                    # katalog-modul.json (sumber katalog Manajemen Modul)
│   ├── lib/                     # sinkron-katalog.cjs
│   ├── seeders/                 # seeder sequelize-cli
│   └── demo/                    # reset & seeder data demo 8 faskes
├── scripts/                     # skrip bantu: SDK, katalog, changelog, server tiruan
├── deploy/                      # deploy server & helpdesk
├── docs/                        # dokumen teknis di repo
├── changelog.d/                 # fragmen CHANGELOG per PR
├── schema.sql                   # struktur + data referensi nasional
├── docker-compose.yml           # satu-satunya berkas compose
├── package.json                 # skrip npm root (dev, db:*, sdk:refresh, ...)
└── install.sh / install.cmd     # installer lokal tanpa Docker
```

## Layanan backend (`*-service/`)

Setiap layanan adalah aplikasi Node.js + Express yang berdiri sendiri, dengan `package.json`, `.env`, dan `Dockerfile` masing-masing. Semua layanan memakai awalan API `/api/v3/...` dan satu database PostgreSQL bersama.

| Folder | Port | Awalan API | Tanggung jawab |
|---|---|---|---|
| `admisi-service` | 8081 | `/api/v3/admisi` | Data pasien, registrasi RJ/RI/IGD, penjamin pasien, monitoring kamar |
| `antrian-service` | 8082 | `/api/v3/antrian` | Jadwal dokter, layar antrian & kiosk TV, anjungan pasien mandiri |
| `auth-service` | 8083 | `/api/v3/auth` | Login, JWT, pindah faskes (superadmin), cache izin di Redis |
| `farmasi-service` | 8084 | `/api/v3/farmasi` | Resep, telaah & penyerahan obat |
| `igd-service` | 8085 | `/api/v3/pelayanan` | Pelayanan IGD |
| `inventory-service` | 8086 | `/api/v3/inventory` | Gudang, pembelian ke supplier, distribusi ke depo, opname |
| `lab-service` | 8087 | `/api/v3/lab` | Order, hasil & validasi laboratorium, bridging LIS |
| `laporan-service` | 8088 | `/api/v3/laporan` | Laporan & dashboard |
| `payment-service` | 8089 | `/api/v3/payment` | Tagihan, kasir, shift, kuitansi |
| `rawat-inap-service` | 8091 | `/api/v3/ranap` | Pelayanan rawat inap |
| `rawat-jalan-service` | 8092 | `/api/v3/rajal` | Antrian poli (panggil, mulai periksa) |
| `rekamedis-service` | 8093 | `/api/v3/rekam-medis` | Rekam medis elektronik (MongoDB), tindakan, resume & discharge |
| `setting-service` | 8094 | `/api/v3/setting` | Profil faskes, konfigurasi integrasi, Manajemen Modul |
| `stok-farmasi-service` | 8095 | `/api/v3/stok` | Stok depo farmasi |
| `datamaster-service` | 8096 | `/api/v3/datamaster` | Faskes, lokasi, pegawai, praktisi, tarif, role, dan datamaster lain |
| `satusehat-service` | 8097 | `/api/v3/satusehat` | Integrasi SATUSEHAT |
| `bpjs-service` | 8098 | `/api/v3/bpjs` | Integrasi BPJS PCare & VClaim |
| `penunjang-service` | 8099 | `/api/v3/penunjang` | Fisioterapi, Radiologi, MCU, Patologi Anatomi, Mikrobiologi, dan modul penunjang lain |
| `program-puskesmas-service` | 8100 | `/api/v3/program-puskesmas` | KIA/KB, imunisasi, MTBS, sasaran, UKM, laporan dinkes |
| `studio-service` | 8090 | `/api/v3/studio` | SIMRS Studio, mode pengembang berbasis AI (opsional) |

::: info SIMRS Studio
`studio-service` hanya aktif bila `STUDIO_PENGEMBANG=aktif` dan superadmin menyalakan Mode Pengembang. Layanan ini dijalankan di mesin pengembang, bukan di server produksi. Lihat [Pengantar SIMRS Studio](/studio/).
:::

Daftar port lengkap, termasuk PostgreSQL, MongoDB, Redis, gateway nginx, dan server tiruan untuk pengujian, ada di [Gambaran Sistem](/arsitektur/gambaran).

## Pola folder di dalam satu layanan

Ada dua pola yang dipakai di repo. Saat menambah kode, ikuti pola layanan yang sedang Anda ubah.

### Pola berlapis (mayoritas layanan)

Layanan lama seperti `admisi-service` dan `lab-service` memisahkan kode per lapisan. Akses data memakai Sequelize lewat `@opensimrs/model-sdk`.

```
admisi-service/
├── src/
│   ├── app.js               # titik masuk Express
│   ├── routes/              # definisi rute (routes.js)
│   ├── controllers/         # menerima request, memanggil service, mengirim respons
│   ├── services/            # logika bisnis
│   ├── repositories/        # query database (Sequelize)
│   ├── validations/         # skema validasi input
│   ├── models/              # definisi model
│   ├── middlewares/         # autentikasi, otorisasi, konteks request, penanganan galat
│   ├── configurations/      # instans Sequelize, Redis, axios, multer
│   ├── exception/           # kelas galat (bad request, not found, unauthorized, ...)
│   ├── responses/           # format respons sukses/galat
│   ├── helper/              # utilitas (JWT, paginasi, ...)
│   ├── listeners/           # pendengar event
│   ├── constant/            # konstanta
│   ├── seeders/             # seeder lokal layanan
│   └── templates/           # templat dokumen
├── test/                    # uji unit
├── .env.example             # contoh variabel lingkungan (tanpa rahasia)
├── .npmrc                   # install-links=true (SDK dipasang sebagai salinan)
├── Dockerfile
└── package.json
```

Alur sebuah request: `routes` → `middlewares` → `controllers` → `services` → `repositories` → database. Respons API berbentuk `{ message, payload }`. `lab-service` memakai pola yang sama dan menambah folder `src/lis/` untuk bridging LIS.

### Pola per modul (`pg` langsung)

Layanan yang lebih baru (`penunjang-service`, `program-puskesmas-service`, `bpjs-service`, dan `satusehat-service`) memakai paket `pg` langsung dengan berkas `server.js`, `config.js`, `db.js`, dan `auth.js` sendiri. `penunjang-service` dan `program-puskesmas-service` juga mengelompokkan kode **per modul**:

```
penunjang-service/
├── src/
│   ├── server.js            # titik masuk Express
│   ├── rute.js              # memasang router tiap modul di bawah /api/v3/penunjang
│   ├── config.js            # membaca .env
│   ├── db.js                # pool pg, helper query & transaksi
│   ├── auth.js              # verifikasi login (JWT)
│   ├── umum/                # helper bersama: izin, kunjungan, tagihan, penomoran, modul, respons
│   ├── radiologi/           # satu folder per modul: rute.js + berkas per sub-fitur
│   ├── fisioterapi/
│   ├── mcu/
│   ├── laundry/
│   └── ...
├── test/                    # uji unit (node --test)
└── package.json
```

Setiap folder modul punya `rute.js` sendiri dan berkas per sub-fitur (mis. `radiologi/order.js`, `radiologi/jadwal.js`, `radiologi/hasil.js`). Helper di `src/umum/` dipakai lintas modul, misalnya `izin.js` untuk penegakan izin per aksi dan `tagihan.js` untuk mengirim tagihan ke `payment-service`.

## Frontend (`frontend-service/`)

Aplikasi web Vue 3 + TypeScript + PrimeVue + Pinia + Tailwind, berjalan di port **5520**.

```
frontend-service/
├── src/
│   ├── main.ts              # titik masuk aplikasi
│   ├── router/              # rute halaman
│   ├── views/               # halaman per modul (Admisi, RawatJalan, Laboratorium, ...)
│   ├── components/          # komponen yang dipakai ulang
│   ├── layouts/             # tata letak halaman
│   ├── stores/              # store Pinia per modul, termasuk modulFaskes.ts (gating modul/fitur)
│   ├── utils/               # utilitas, termasuk utils/pdf/bukaPdf.ts untuk cetak PDF
│   ├── types/               # tipe TypeScript
│   └── assets/              # gambar, logo, gaya
├── public/
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## SDK bersama (`packages/`)

| Paket | Isi |
|---|---|
| `@opensimrs/model-sdk` | Definisi model dan repository bersama (Sequelize), termasuk helper audit |
| `@opensimrs/authorization-sdk` | Verifikasi JWT HS256 dan middleware autentikasi |
| `@opensimrs/permission-sdk` | Pemeriksaan izin |

Layanan memakai SDK lewat `"@opensimrs/<sdk>": "file:../packages/<sdk>"` dengan `.npmrc` berisi `install-links=true`. Akibatnya SDK terpasang sebagai **salinan**, bukan symlink.

::: warning Setelah mengubah SDK
Perubahan di `packages/` baru terlihat oleh layanan setelah Anda menjalankan:

```bash
npm run sdk:refresh                   # semua layanan
npm run sdk:refresh -- lab-service    # satu layanan saja
```

Naikkan juga versi di `package.json` SDK yang Anda ubah.
:::

## Database (`database/`)

| Folder/berkas | Isi |
|---|---|
| `migrations/` | Migrasi `sequelize-cli` bernama `YYYYMMDDHHMMSS-deskripsi.cjs` (UTC), SQL mentah dan idempoten. Dijalankan dengan `npm run db:migrate`. |
| `data/katalog-modul.json` | **Sumber** katalog Manajemen Modul: segmen, modul, fitur, bagian, dan preset. |
| `lib/sinkron-katalog.cjs` | Menyalin isi `katalog-modul.json` ke tabel `ref_*` dan `preset_*`. Dipanggil dari migrasi. |
| `seeders/` | Seeder `sequelize-cli`, mis. `npm run db:seed:admin`. |
| `demo/` | Skrip data demo: `reset-demo.cjs`, `seed-demo.cjs`, `seed-transaksi.cjs`, `isi-master-penunjang.cjs`, data faskes fiktif di `katalog-demo.cjs`, dan seeder datamaster per modul penunjang. Lihat [Data Demo](/memulai/data-demo). |
| `config.cjs` | Konfigurasi koneksi untuk `sequelize-cli`. |

`schema.sql` di root berisi struktur database dan data referensi nasional (wilayah, ICD-10, ICD-9-CM, SNOMED, LOINC, odontogram), tanpa data faskes, pasien, atau pengguna. Penjelasan lengkap ada di [Basis Data & Migrasi](/arsitektur/basis-data-migrasi).

## Skrip (`scripts/`)

| Berkas | Fungsi |
|---|---|
| `refresh-sdk.mjs` | `npm run sdk:refresh`: memasang ulang SDK `packages/` ke layanan |
| `dokumen-katalog.mjs` | `npm run docs:katalog`: membuat tabel katalog di `docs/MANAJEMEN-MODUL.md`; `--cek` dipakai CI |
| `cek-integritas.mjs` | Pemeriksaan integritas lintas berkas (rute katalog, menu, migrasi, fragmen changelog), dijalankan CI |
| `gabung-changelog.mjs` | Menggabungkan fragmen `changelog.d/` ke `CHANGELOG.md` saat rilis |
| `lis-tiruan.mjs`, `lis-tiruan-mikro.mjs`, `lis-pa-tiruan.mjs` | Server LIS tiruan (laboratorium, mikrobiologi, patologi anatomi) untuk uji bridging |
| `pacs-tiruan.mjs`, `utd-tiruan.mjs`, `hdis-tiruan.mjs`, `marketplace-tiruan.mjs` | Server tiruan PACS/RIS, UTD, HDIS, dan marketplace untuk pengujian |
| `README-*.md` | Petunjuk pemakaian tiap server tiruan |

## Deploy (`deploy/`)

| Folder | Isi |
|---|---|
| `deploy/server/` | `deploy.sh`, `docker-compose.server.yml`, `gateway.nginx.conf`, dan `.env.example` untuk memasang OpenSIMRS di server dengan Docker atau Podman. Lihat [Deployment](/memulai/deployment). |
| `deploy/helpdesk/` | Panduan dan berkas pendukung agen Helpdesk (OpenClaw): instruksi agen, contoh konfigurasi, skrip uji, gateway tiruan, dan perangkat evaluasi. Lihat [Helpdesk](/integrasi/helpdesk). |

## Dokumen (`docs/`) dan changelog (`changelog.d/`)

`docs/` berisi dokumen teknis yang ikut ditinjau di PR: petunjuk instalasi, lingkungan, Manajemen Modul, roadmap, konteks pengembangan, SIMRS Studio, spesifikasi hardware, dokumentasi API, serta subfolder `kontributor/`, `panduan-pengguna/`, `rancangan/`, `testing/`, dan `audit/`.

`changelog.d/` berisi **fragmen CHANGELOG**, satu berkas per PR (`<nama-branch>.md`) atau per item SIMRS Studio (`STD-<nomor>.md`). Lihat [Panduan Kontribusi › Fragmen changelog](/pendahuluan/kontribusi#fragmen-changelog).

## Berkas di root

| Berkas | Fungsi |
|---|---|
| `package.json` | Skrip npm root: `dev`, `dev:core`, `dev:<layanan>`, `install:all`, `infra:up`, `stack:up`, `db:migrate`, `db:demo:*`, `sdk:refresh`, `docs:katalog` |
| `.env.example` | Contoh `.env` root (koneksi database, `SECRET_KEY`, `DEMO_PASSWORD`), tanpa rahasia |
| `docker-compose.yml` | Satu-satunya berkas compose: infrastruktur dan seluruh tumpukan |
| `schema.sql` | Struktur database + data referensi nasional |
| `mongo-init.js` | Menyiapkan database MongoDB aplikasi, tanpa kredensial |
| `.sequelizerc` | Konfigurasi `sequelize-cli` (lokasi migrasi dan seeder) |
| `install.sh`, `install.cmd`, `install.ps1` | Installer lokal tanpa Docker (macOS/Ubuntu/Debian dan Windows) |
| `uninstall.sh`, `uninstall.cmd`, `uninstall.ps1` | Menghapus instalasi lokal |
| `.github/` | Workflow CI (`workflows/ci.yml`) dan templat Pull Request |
| `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`, `GOVERNANCE.md`, `CODE_OF_CONDUCT.md`, `COMMUNITY.md`, `LICENSE` | Dokumen proyek dan komunitas |

## Langkah berikutnya

- [Instalasi](/memulai/instalasi): menyiapkan repo di komputer Anda.
- [Data Demo](/memulai/data-demo): mengisi database dengan 8 faskes fiktif.
- [Gambaran Sistem](/arsitektur/gambaran): bagaimana layanan saling berhubungan.
- [Konvensi API](/arsitektur/konvensi-api): aturan endpoint dan respons.
