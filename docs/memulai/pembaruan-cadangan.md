# Pembaruan & Cadangan

Halaman ini menjelaskan cara memperbarui OpenSIMRS ke versi terbaru dan cara mencadangkan serta memulihkan data PostgreSQL dan MongoDB. Ikuti urutannya: **cadangkan dulu, baru perbarui.**

## Sebelum memperbarui

- Baca [Catatan Rilis](/pendahuluan/catatan-rilis), terutama bagian **Diubah** dan **Keamanan**.
- Di server, **buat cadangan** PostgreSQL dan MongoDB, dan pastikan cadangan itu bisa dipulihkan (lihat [Cadangan](#cadangan)).
- Di staging dan production, pasang **tag rilis** (mis. `v1.0.0-alpha.2`), bukan sembarang commit. Production memasang tag yang sama setelah staging lulus uji.

## Memperbarui ke versi terbaru

### Pengembangan lokal

```bash
git pull origin main
npm run install:all
npm run db:migrate
```

Bila pembaruan mengubah folder `packages/` (SDK bersama), jalankan juga:

```bash
npm run sdk:refresh                  # semua layanan
npm run sdk:refresh -- lab-service   # atau layanan tertentu saja
```

SDK dipasang ke setiap layanan sebagai **salinan**, bukan symlink, sehingga perubahan di `packages/` baru terlihat setelah `sdk:refresh`. Setelah itu mulai ulang layanan (`npm run dev`).

### Server Docker

```bash
cd /opt/opensimrs
git fetch --tags
git checkout <tag-rilis>
./deploy/server/deploy.sh
```

`deploy.sh` membangun ulang hanya layanan yang berubah, menjalankan migrasi, memeriksa kesehatan layanan, dan melakukan rollback otomatis ke image sebelumnya bila ada layanan yang tidak merespons. Lihat [Deployment](/memulai/deployment#server-dengan-deploy-sh).

::: warning Rollback tidak membatalkan migrasi
Rollback `deploy.sh` hanya mengembalikan **image** layanan. Perubahan skema dari migrasi yang sudah berjalan tetap ada. Karena itulah cadangan sebelum pembaruan wajib.
:::

### Server tanpa Docker

1. Cadangkan database.
2. `git pull` (atau checkout tag rilis).
3. `npm run install:all`, dan `npm run sdk:refresh` bila `packages/` berubah.
4. `npm run db:migrate`.
5. Bangun ulang frontend: `npm --prefix frontend-service run build-only`.
6. Mulai ulang proses (pm2 atau systemd).

### Tentang migrasi

Migrasi di `database/migrations/` aman dijalankan berulang (idempoten), dan selain menambah tabel/kolom juga menyinkronkan katalog [Manajemen Modul](/arsitektur/manajemen-modul). Periksa migrasi yang sudah berjalan dengan:

```bash
npm run db:migrate:status
```

## Cadangan

Rekam medis tersebar di **dua** basis data: data terstruktur di PostgreSQL dan isi RME di MongoDB. **Selalu cadangkan keduanya bersamaan.**

### Dengan Docker

Perintah berikut memakai nama layanan compose (`db`, `mongodb`) dan variabel dari `.env` root. Muat variabelnya dulu dengan `set -a; . ./.env; set +a`.

```bash
# PostgreSQL
docker compose exec -T db pg_dump -U "$DB_USERNAME" "$DB_NAME" | gzip > pg_$(date +%Y%m%d_%H%M).sql.gz

# MongoDB (isi rekam medis)
docker compose exec -T mongodb mongodump --archive --gzip \
  --username "$MONGO_DB_USERNAME" --password "$MONGO_DB_PASSWORD" --authenticationDatabase admin \
  > mongo_$(date +%Y%m%d_%H%M).gz
```

Pada server yang dipasang dengan `deploy.sh`, tambahkan opsi proyek dan override setelah `docker compose`:

```bash
docker compose -p opensimrs -f docker-compose.yml -f deploy/server/docker-compose.server.yml exec -T db ...
```

### Tanpa Docker

Jalankan `pg_dump` dan `mongodump` langsung di host:

```bash
pg_dump -h 127.0.0.1 -U "$DB_USERNAME" "$DB_NAME" | gzip > pg_$(date +%Y%m%d_%H%M).sql.gz
mongodump --archive --gzip \
  --username "$MONGO_DB_USERNAME" --password "$MONGO_DB_PASSWORD" --authenticationDatabase admin \
  > mongo_$(date +%Y%m%d_%H%M).gz
```

## Pemulihan

```bash
gunzip -c pg_YYYYMMDD_HHMM.sql.gz | docker compose exec -T db psql -U "$DB_USERNAME" "$DB_NAME"
docker compose exec -T mongodb mongorestore --archive --gzip \
  --username "$MONGO_DB_USERNAME" --password "$MONGO_DB_PASSWORD" --authenticationDatabase admin \
  < mongo_YYYYMMDD_HHMM.gz
```

Pulihkan PostgreSQL dan MongoDB dari cadangan yang dibuat pada waktu yang sama, agar data terstruktur dan isi RME tetap cocok.

::: tip Cadangan dari uninstall
`uninstall.sh` menawarkan cadangan `pg_dump`/`mongodump` ke `~/opensimrs-cadangan-<waktu>/` sebelum menghapus apa pun, dan menampilkan cara memulihkannya di akhir proses.
:::

## Jadwal dan kebijakan cadangan

- Jadwalkan cadangan **harian** dengan `cron` (atau penjadwal lain).
- Simpan salinan **di luar server**, dalam keadaan terenkripsi. Pola 3-2-1 dijelaskan di [Spesifikasi Hardware](/memulai/spesifikasi-hardware).
- **Uji pemulihan** secara berkala di server uji. Cadangan yang belum pernah dipulihkan belum terbukti bisa dipakai.
- Atur masa simpan cadangan sesuai ketentuan rekam medis yang berlaku dan kebijakan faskes.
- Berkas cadangan berisi data pasien. Batasi akses ke berkas itu seketat akses ke server production.

## Lihat juga

- [Deployment](/memulai/deployment)
- [Basis Data & Migrasi](/arsitektur/basis-data-migrasi)
- [Catatan Rilis](/pendahuluan/catatan-rilis)
