# Autentikasi & Hak Akses

Halaman ini menjelaskan cara OpenSIMRS mengenali pengguna (autentikasi) dan membatasi apa yang boleh ia lakukan (hak akses). Isinya untuk pengembang yang menambah rute baru dan tim IT yang mengatur peran petugas.

## Ringkasan

- Login dilayani `auth-service` dan menghasilkan **JWT HS256** yang ditandatangani `SECRET_KEY`.
- Setiap layanan memeriksa token itu sendiri dengan `SECRET_KEY` yang **sama** lewat `@opensimrs/authorization-sdk`.
- Daftar izin pengguna disimpan di **Redis** per token, lalu diperiksa per rute dengan `@opensimrs/permission-sdk`.
- Cakupan data selalu dibatasi ke faskes pengguna, yang **diambil dari JWT**, tidak pernah dari body atau parameter permintaan.

## Alur login

```text
POST /api/v3/auth/login  { username, password }
  │
  ├─ auth-service mencocokkan sandi (bcrypt)
  ├─ membuat token (1 jam) + refresh token (70 menit), HS256, issuer "authentication-service"
  ├─ menyimpan izin pengguna di Redis:  token-<kunci>  →  { permissions }   (kedaluwarsa 3 jam)
  ├─ mencatat peristiwa "login" ke Audit Trail
  └─ respons: { message, payload: { token, refreshToken, permissions, user: { faskesUuid, role, name } } }
```

Contoh:

```bash
curl -X POST http://localhost:8083/api/v3/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "superadmin", "password": "Demo@2026"}'
```

Permintaan berikutnya ke layanan mana pun menyertakan token di header:

```http
Authorization: Bearer <token>
```

### Isi token

Payload JWT memuat `role`, `username`, `faskesUuid`, dan `user_uuid`. Layanan membaca payload ini sebagai `request.author` setelah token diverifikasi.

### Endpoint autentikasi

| Metode & path | Fungsi |
|---|---|
| `POST /api/v3/auth/login` | Login, menghasilkan token dan refresh token. |
| `POST /api/v3/auth/refresh-token` | Menukar refresh token dengan token baru; sesi token lama di Redis dihapus. |
| `DELETE /api/v3/auth/logout` | Menghapus sesi token dari Redis. Token itu langsung ditolak semua layanan. |
| `PUT /api/v3/auth/token/:faskes` | Hanya superadmin: membuat token baru untuk faskes lain (berpindah faskes). |
| `POST /api/v3/auth/permission/muat-ulang` | Membaca ulang izin pengguna dari database ke sesi Redis tanpa login ulang. |

Rincian endpoint ada di [Referensi API › Autentikasi](/api/autentikasi).

## `SECRET_KEY` bersama

OpenSIMRS memakai **HS256**: satu kunci rahasia untuk membuat sekaligus memeriksa token. Karena itu `SECRET_KEY` harus **sama persis** di `auth-service` dan semua layanan lain dalam satu lingkungan, dan **berbeda** antarlingkungan (development, staging, production).

- Bila `SECRET_KEY` kosong, layanan melempar `SECRET_KEY is required for JWT HS256`.
- Bila berbeda antarlayanan, layanan menolak token dan pengguna seperti "ter-logout" saat membuka modul.
- `PRIVATE_KEY`/`PUBLIC_KEY` tidak dipakai lagi.

Buat nilainya dengan `openssl rand -hex 32`. Lihat [Konfigurasi](/memulai/konfigurasi).

## Sesi dan cache izin di Redis

Saat login, `auth-service` menyimpan izin pengguna ke Redis dengan kunci yang diturunkan dari tanda tangan token (`token-<10 karakter>`). Middleware `authorization-sdk` di setiap layanan:

1. membaca header `Authorization: Bearer <token>`;
2. memverifikasi JWT dengan `SECRET_KEY` (algoritme HS256);
3. memeriksa kunci sesi token di Redis. Bila tidak ada (sudah logout atau kedaluwarsa), permintaan ditolak **401**.

`permission-sdk` lalu membaca daftar izin dari kunci yang sama. Akibatnya:

- **Logout berlaku seketika** di semua layanan.
- **Perubahan izin baru berlaku setelah login ulang**, atau setelah sesi dimuat ulang lewat `POST /api/v3/auth/permission/muat-ulang` (dipakai alur Manajemen Modul).

## Struktur izin

Izin disusun bertingkat **modul → submodul → (fitur) → aksi**. Definisi lengkapnya ada di `auth-service/src/helpers/permission-list.js`, satu objek per modul:

```js
export const settingPermission = {
  module: "Setting",
  subModules: [
    { name: "Profile Faskes", allows: ["READ", "UPDATE PROFILE", "UPDATE LOGO DAN WARNA"] },
    { name: "Audit Trail", allows: ["LIHAT", "EKSPOR"] },
    // ...
  ],
};
```

Submodul yang punya fitur menaruh aksi di tingkat fitur:

```js
{
  name: "Laporan Admisi",
  features: [
    { name: "Kunjungan", allows: ["READ", "CETAK LAPORAN"] },
    { name: "Penjamin", allows: ["READ", "CETAK LAPORAN"] },
  ],
}
```

| Tingkat | Contoh |
|---|---|
| Modul | `Admisi`, `Farmasi`, `Setting`, `SIMRS Studio` |
| Submodul | `Admisi RJ`, `Antrian`, `Audit Trail` |
| Fitur (opsional) | `Kunjungan` di bawah `Laporan Admisi` |
| Aksi | `READ`, `CREATE PASIEN RJ`, `PANGGIL`, `LIHAT`, `EKSPOR` |

Fungsi `mapPermission` di berkas yang sama memetakan nama modul ke objek izinnya. Editor Role di aplikasi mengambil katalog izin dari server (`GET /api/v3/auth/permission/katalog`), jadi modul baru langsung muncul sebagai pilihan.

## Peran dan superadmin

- Izin diatur per **peran** di **Datamaster › Role**, lalu disalin ke setiap pengguna peran itu.
- Saat login, izin dibaca dari kolom `users.permissions`, **bukan** `role.permissions`. Bila Anda mengubah data izin langsung di database, salin juga ke pengguna.
- **Superadmin** adalah peran bernama persis `super admin` (huruf kecil, tanpa faskes). Superadmin bisa berpindah faskes lewat `PUT /api/v3/auth/token/:faskes`, satu-satunya yang boleh mengubah [Manajemen Modul](/arsitektur/manajemen-modul), dan secara bawaan satu-satunya yang mendapat izin **Setting › Audit Trail**.
- Izin **SIMRS Studio** tidak pernah diberikan otomatis ke peran faskes; superadmin memberikannya per peran.

::: tip Menu yang tampil
Menu yang tampil = modul **aktif** di faskes ∩ modul yang ada di **izin** pengguna. Modul yang aktif belum tentu terlihat bila peran pengguna tidak punya izinnya. Lihat [Manajemen Modul & Fitur](/arsitektur/manajemen-modul#menu-yang-tampil).
:::

## Memakai SDK di rute

### Autentikasi: `authorization-sdk`

Pasang middleware di tingkat aplikasi atau router. Parameternya adalah daftar URL yang dikecualikan dari pemeriksaan token:

```js
import authorizationSdk from "@opensimrs/authorization-sdk";

const privateRoute = express.Router();
privateRoute.use(authorizationSdk([]));   // semua rute di router ini wajib token
```

Setelah lolos, payload token tersedia di `request.author`.

### Izin: `permission-sdk`

Buat instance sekali dengan koneksi Redis layanan:

```js
// src/configurations/permission.config.js
import { PermissionBuilder } from "@opensimrs/permission-sdk";
import redisClient from "./redis-client-config.js";

export const permissionSdk = PermissionBuilder.setRedis(redisClient).build();
```

Lalu pasang per rute dengan argumen `(modul, submodul, fitur, aksi)`. Kirim `null` sebagai fitur bila submodul tidak punya fitur:

```js
import { permissionSdk } from "../configurations/permission.config.js";

const LIHAT = permissionSdk("Setting", "Audit Trail", null, "LIHAT");
const EKSPOR = permissionSdk("Setting", "Audit Trail", null, "EKSPOR");

router.get("/api/v3/setting/audit-trail", LIHAT, AuditTrailController.cari);
router.post("/api/v3/setting/audit-trail/ekspor", EKSPOR, AuditTrailController.ekspor);

// dengan fitur
router.get("/laporan/kunjungan", permissionSdk("Admisi", "Laporan Admisi", "Kunjungan", "READ"), handler);
```

Bila modul, submodul, fitur, atau aksinya tidak ada di izin pengguna, middleware melempar `NotAllowedException` berkode **403**, yang oleh error middleware layanan diubah menjadi respons berbentuk:

```json
{
  "message": "Gagal",
  "errors": [{ "type": "not allowed", "message": "..." }]
}
```

Nama modul, submodul, fitur, dan aksi harus **persis sama** dengan `permission-list.js`, termasuk huruf besar-kecil.

::: warning Penegakan di backend belum menyeluruh
Tidak semua rute sudah memakai `permission-sdk`; sebagian penyaringan masih dilakukan di frontend. Penegakan izin menyeluruh di backend masih tercatat di backlog. Untuk aksi penting di rute baru, selalu pasang pemeriksaan izin di server.
:::

## Isolasi faskes

Satu instalasi melayani banyak faskes. Aturannya:

- `faskes_uuid` **selalu** diambil dari token (`request.author.faskesUuid`), **tidak pernah** dari body, query, atau parameter permintaan.
- Setiap query wajib menyaring `faskes_uuid` dan `deleted_at IS NULL`.

```js
// benar: cakupan faskes dari token
static async cari(author, query) {
  return AuditTrailRepository.cari(author.faskesUuid, bacaFilter(query), query.page, query.page_size);
}
```

## Menambah izin untuk modul baru

1. Tambahkan objek izin di `auth-service/src/helpers/permission-list.js` dan daftarkan kuncinya di `mapPermission`.
2. Tambahkan nama modul ke `SEMUA_MODUL` di `auth-service/src/controllers/permission-controller.js` agar muncul di editor Role.
3. Peran yang sudah ada tidak otomatis mendapat izin baru. Buat **migrasi izin**, atau andalkan sinkron otomatis untuk peran admin faskes dan atur peran lain di Datamaster › Role.

Langkah lengkapnya ada di [Manajemen Modul & Fitur](/arsitektur/manajemen-modul#menambah-modul-atau-fitur).

## Lihat juga

- [Manajemen Modul & Fitur](/arsitektur/manajemen-modul)
- [Konvensi API](/arsitektur/konvensi-api)
- [Audit Trail](/arsitektur/audit-trail)
- [Referensi API › Autentikasi](/api/autentikasi)
