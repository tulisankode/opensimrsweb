# Basis Data & Migrasi

Halaman ini menjelaskan konvensi data OpenSIMRS dan cara mengubah skema database dengan migrasi. Bacalah sebelum menambah tabel, kolom, atau model baru.

## Gambaran

| Penyimpanan | Isi | Akses |
|---|---|---|
| PostgreSQL (`opensimrs`) | Semua data terstruktur, dipakai bersama semua layanan. | Sequelize lewat `@opensimrs/model-sdk`; `bpjs-service`, `satusehat-service`, dan `penunjang-service` memakai `pg` langsung. |
| MongoDB (`opensimrs`) | Isi rekam medis elektronik: `rekam_medises`, `sessions`, `catatan_perawats`, `instruksi_medises`. | Mongoose/driver MongoDB di layanan terkait. |
| Redis | Token sesi dan cache izin. | `authorization-sdk`, `permission-sdk`. |

Skema PostgreSQL **hanya** berubah lewat migrasi. ORM tidak boleh mengubah tabel: pastikan `SYNC_DB=false` di semua lingkungan.

## Konvensi data

| Aspek | Aturan |
|---|---|
| Penamaan | `snake_case` di database dan API. Di kode Vue memakai `camelCase`; instance axios frontend mengonversinya otomatis. |
| ID | Kolom `uuid` berupa string **uuidv7** yang dibuat aplikasi. Kolom `id` integer hanya untuk urutan internal. |
| Waktu | `created_at`, `updated_at`, `deleted_at` disimpan sebagai **epoch detik** (`BIGINT`), bukan milidetik. |
| Hapus | **Soft delete**: isi `deleted_at`, jangan menghapus baris. Setiap query wajib menyaring `deleted_at IS NULL`. |
| Isolasi faskes | Setiap query wajib menyaring `faskes_uuid`, yang diambil dari token login. |
| JSON di kolom teks | Beberapa kolom menyimpan JSON sebagai teks (mis. `users.permissions`, `tarif.tindakan`). Selalu `JSON.parse` dengan aman. |

Contoh kueri yang mengikuti konvensi:

```sql
SELECT uuid, created_at
FROM contoh_tabel
WHERE faskes_uuid = :faskesUuid   -- dari token, bukan dari body permintaan
  AND deleted_at IS NULL;
```

## `schema.sql`

`schema.sql` di root repo hanya berisi **struktur tabel** dan **data referensi nasional**: wilayah, ICD-10, ICD-9-CM, SNOMED, LOINC, dan odontogram. Berkas ini **tidak** memuat data faskes, pasien, atau pengguna.

- Docker memuatnya otomatis saat volume PostgreSQL masih kosong (±11 MB, 1–3 menit).
- Instalasi native memuatnya dengan `psql ... -f schema.sql`.
- Setelah itu selalu jalankan `npm run db:migrate` untuk menambah tabel terbaru dan katalog modul.

Jangan menambahkan data faskes, pasien, atau kredensial ke `schema.sql`.

## Migrasi

Migrasi memakai **sequelize-cli** dan dijalankan terpusat dari root repo. Konfigurasinya ada di `.sequelizerc` dan `database/config.cjs`, yang membaca koneksi dari `.env` root.

```bash
npm run db:migrate            # jalankan migrasi yang belum berjalan
npm run db:migrate:status     # lihat status migrasi
npm run db:migrate:undo       # batalkan migrasi terakhir (hati-hati)
```

### Nama berkas

```text
database/migrations/YYYYMMDDHHMMSS-<ringkasan>.cjs
```

- Stempel waktu dalam **UTC**.
- Migrasi berjalan berurutan menurut nama berkas, jadi saat PR digabung, migrasi Anda harus berada **paling akhir** di urutan. Bila ada migrasi lain yang masuk lebih dulu dengan stempel lebih baru, ganti nama berkas Anda sebelum digabung.

### Wajib idempoten

CI memuat `schema.sql`, lalu menjalankan `db:migrate` **dua kali**; kali kedua tidak boleh mengubah apa pun. Tulis migrasi dengan SQL mentah yang aman dijalankan berulang dan pada database yang sudah memiliki sebagian objeknya:

```js
'use strict';

// Kode pemeriksaan di LIS per item pemeriksaan untuk memetakan hasil yang dikirim LIS.
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TABLE item_pemeriksaan ADD COLUMN IF NOT EXISTS kode_lis VARCHAR(50);`
    );
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TABLE item_pemeriksaan DROP COLUMN IF EXISTS kode_lis;`
    );
  },
};
```

Pola yang lazim dipakai:

| Kebutuhan | Pola |
|---|---|
| Tabel baru | `CREATE TABLE IF NOT EXISTS ...` |
| Kolom baru | `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...` |
| Indeks | `CREATE INDEX IF NOT EXISTS ...` / `CREATE UNIQUE INDEX IF NOT EXISTS ...` |
| Fungsi & trigger | `CREATE OR REPLACE FUNCTION ...` dan `DROP TRIGGER IF EXISTS ...` sebelum `CREATE TRIGGER` |
| Data referensi | `INSERT ... ON CONFLICT (...) DO UPDATE` / `DO NOTHING` |
| Beberapa pernyataan | Bungkus dalam `queryInterface.sequelize.transaction(...)` |

Contoh tabel baru dengan kolom waktu sesuai konvensi:

```js
await queryInterface.sequelize.transaction(async (transaction) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS contoh_tabel (
      id BIGSERIAL,
      uuid VARCHAR(255) PRIMARY KEY,
      faskes_uuid VARCHAR(255) NOT NULL,
      nama VARCHAR(255) NOT NULL,
      created_at BIGINT NOT NULL,
      updated_at BIGINT,
      deleted_at BIGINT
    );
    CREATE INDEX IF NOT EXISTS contoh_tabel_faskes_idx ON contoh_tabel (faskes_uuid);
  `, { transaction });
});
```

### Jangan mengubah migrasi lama

Migrasi yang sudah masuk `main` mungkin sudah berjalan di banyak database. Mengubahnya tidak akan menjalankannya ulang, sehingga database menjadi tidak konsisten. **Selalu buat migrasi baru** untuk setiap perubahan, termasuk untuk memperbaiki migrasi sebelumnya.

### Migrasi katalog dan izin

Dua jenis migrasi khusus sering muncul:

- **Sinkron katalog**: hanya memanggil `sinkronKatalog` dari `database/lib/sinkron-katalog.cjs` setelah `database/data/katalog-modul.json` diubah. Lihat [Manajemen Modul & Fitur](/arsitektur/manajemen-modul#katalog-dan-sinkronisasi).
- **Izin**: menambahkan izin modul baru ke peran dan pengguna yang sudah ada (izin dibaca dari `users.permissions`, jadi keduanya perlu diperbarui).

## `@opensimrs/model-sdk`

`packages/model-sdk` berisi definisi model Sequelize/Mongoose bersama, helper umum, dan helper [Audit Trail](/arsitektur/audit-trail). Layanan membuat instance Sequelize dengan `createSequelizeInstance`, lalu mengimpor model per domain dari folder `exports/`.

SDK dipasang ke setiap layanan sebagai **salinan** (`file:../packages/model-sdk` + `install-links=true` di `.npmrc`), sehingga Sequelize/Mongoose tetap satu instans per layanan. Konsekuensinya:

```bash
npm run sdk:refresh                  # pasang ulang SDK ke semua layanan
npm run sdk:refresh -- lab-service   # atau ke layanan tertentu
```

- Perubahan di `packages/` **tidak terlihat** di layanan sebelum `sdk:refresh` dijalankan.
- Setiap mengubah SDK, **naikkan versi** di `package.json` paket itu (riwayat `model-sdk` dicatat di `packages/model-sdk/CHANGE_LOG.md`).
- Jangan mengganti dependensi SDK menjadi symlink: Sequelize/Mongoose bisa menjadi dua instans.
- Model **tidak** dipakai untuk mengubah skema; perubahan skema tetap lewat migrasi.

## Data demo

Data demo **bukan** migrasi. Skrip di `database/demo/` dijalankan terpisah dan hanya untuk development/staging:

```bash
npm run db:demo:seed                   # 8 faskes fiktif + akun demo
npm run db:demo:master-penunjang       # datamaster penunjang, idempoten
npm run db:demo:reset -- --ya          # HAPUS semua data faskes & transaksi (PostgreSQL + MongoDB)
```

Seeder demo baru harus idempoten dan memakai data yang jelas fiktif (email `@contoh.id`, HP `080000000000`, NIK berawalan `9999`). Lihat [Data Demo](/memulai/data-demo).

## Lihat juga

- [Manajemen Modul & Fitur](/arsitektur/manajemen-modul)
- [Audit Trail](/arsitektur/audit-trail)
- [Pembaruan & Cadangan](/memulai/pembaruan-cadangan)
- [Panduan Kontribusi](/pendahuluan/kontribusi)
