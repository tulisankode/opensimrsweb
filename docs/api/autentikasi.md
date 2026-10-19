# Autentikasi

Halaman ini menjelaskan cara aplikasi lain masuk ke API OpenSIMRS: login untuk mendapatkan token, memakai token di setiap permintaan, memperbarui token sebelum kedaluwarsa, berpindah faskes, dan logout. Semua contoh memakai instalasi lokal dengan akun demo `superadmin` / `Demo@2026`.

Endpoint autentikasi dilayani `auth-service` (port `8083`, awalan `/api/v3/auth`).

## Cara kerja singkat

- Login menghasilkan **token akses** dan **refresh token**, keduanya JWT **HS256** yang ditandatangani dengan `SECRET_KEY`. Semua layanan memakai `SECRET_KEY` yang sama, sehingga satu token berlaku untuk semua layanan.
- Token memuat `username`, `role`, `user_uuid`, dan **`faskesUuid`**. Setiap layanan menentukan faskes dari token, bukan dari isi permintaan.
- Sesi beserta daftar izin pengguna disimpan di **Redis**. Layanan yang memakai `@opensimrs/authorization-sdk` menolak token yang sesinya sudah tidak ada di Redis.

| Token | Masa berlaku |
|---|---|
| Token akses | 3600 detik (1 jam) |
| Refresh token | 4200 detik (70 menit) |

## Login

`POST /api/v3/auth/login`

```bash
curl -s -X POST http://localhost:8083/api/v3/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"Demo@2026"}'
```

Respons sukses (`200`), disingkat:

```json
{
  "message": "Login berhasil!",
  "payload": {
    "token": "eyJhbGciOiJIUzI1NiIs…",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs…",
    "permissions": [ … ],
    "user": {
      "faskes_uuid": "0192…",
      "role": "super admin",
      "name": "…"
    }
  }
}
```

- `permissions` berisi daftar izin pengguna (modul › submodul › aksi). Gunakan untuk menyembunyikan menu yang tidak berhak, tetapi tetap andalkan pemeriksaan izin di server.
- Username yang tidak terdaftar atau sandi yang salah dijawab `401`. Percobaan login gagal dengan username yang dikenal dicatat di audit trail.

## Memakai token

Kirim token akses di header `Authorization` pada setiap permintaan ke endpoint yang dilindungi:

```bash
curl -s "http://localhost:8081/api/v3/admisi/patient?page=1&limit=5" \
  -H "Authorization: Bearer <token>"
```

Tanpa header, atau dengan token yang tidak valid/kedaluwarsa, layanan menjawab `401`, misalnya:

```json
{
  "message": "Authentikasi gagal",
  "errors": [{ "type": "invalid token", "message": "Token tidak valid atau kadaluarsa" }]
}
```

Izin per aksi (misalnya **Laboratorium › Order Lab › VALIDASI ORDER**) diperiksa setelah token valid. Tanpa izin, layanan menjawab `403`. Lihat [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin).

## Memperbarui token

`POST /api/v3/auth/refresh-token`

Kirim **refresh token** dan **token akses lama** sebelum refresh token kedaluwarsa:

```bash
curl -s -X POST http://localhost:8083/api/v3/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<refresh token>","token":"<token akses lama>"}'
```

Respons (`200`):

```json
{
  "message": "Berhasil refresh token",
  "payload": { "token": "eyJ…", "refresh_token": "eyJ…" }
}
```

Sesi token lama dihapus dari Redis, jadi segera ganti token yang Anda simpan. Bila refresh token sudah kedaluwarsa, server menjawab `401` dan pengguna harus login ulang.

::: tip Strategi yang disarankan
Perbarui token saat menerima `401` dengan pesan token kedaluwarsa, atau beberapa menit sebelum 1 jam berlalu. Jangan menyimpan sandi pengguna untuk login ulang otomatis.
:::

## Memilih atau mengganti faskes

Token terikat pada satu faskes. Faskes awal adalah faskes milik akun pengguna.

**Superadmin** dapat berpindah ke faskes lain dengan menerbitkan token baru:

`PUT /api/v3/auth/token/:faskes`

```bash
curl -s -X PUT http://localhost:8083/api/v3/auth/token/<faskes_uuid> \
  -H "Authorization: Bearer <token>"
```

Respons (`202`):

```json
{
  "message": "Success update token!",
  "payload": {
    "new_token": "eyJ…",
    "new_refresh_token": "eyJ…",
    "faskes_name": "…",
    "faskes_uuid": "0192…"
  }
}
```

- Token lama dihapus dari Redis. Pakai `new_token` untuk permintaan berikutnya; semua data yang dibaca dan ditulis kini milik faskes tersebut.
- Pengguna selain peran `super admin` mendapat galat. Pengguna biasa hanya bekerja di faskes akunnya.
- Daftar faskes dapat dibaca superadmin lewat `datamaster-service` (`GET /api/v3/datamaster/faskes`).

## Logout

`DELETE /api/v3/auth/logout`

```bash
curl -s -X DELETE http://localhost:8083/api/v3/auth/logout \
  -H "Authorization: Bearer <token>"
```

Respons (`202`): `{ "message": "superadmin berhasil logout" }`. Sesi token dihapus dari Redis dan peristiwa logout dicatat di audit trail. Buang token dan refresh token yang tersimpan di aplikasi Anda.

## Endpoint dengan kunci API

Beberapa endpoint untuk aplikasi mobile, kiosk, atau sistem mitra tidak memakai JWT:

| Jenis | Header | Contoh |
|---|---|---|
| Mobile/APM pasien (admisi) | `x-api-key` dan `faskes-uuid` | `/api/v3/admisi/mobile/pasien/...` |
| Titik masuk hasil LIS/PACS/HDIS/UTD | `x-api-key` (kunci masuk per koneksi) atau `?key=` | `/api/v3/lab/lis/hasil` |
| WS Antrean BPJS | Token WS dari `/api/v3/bpjs/antrean/ws/token` | lihat [BPJS Kesehatan](/integrasi/bpjs#antrean-online-mobile-jkn) |

Kunci API mobile diatur di `.env` server (lihat [Konfigurasi](/memulai/konfigurasi)); kunci masuk bridging dibuat per koneksi di **Setting › Konfigurasi Integrasi** (lihat [LIS & PACS](/integrasi/lis-pacs)). Jangan pernah menaruh kunci di kode aplikasi yang dibagikan ke publik atau di repo.

## Lihat juga

- [Ringkasan API](/api/)
- [Endpoint per Layanan](/api/layanan)
- [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin)
- [Audit Trail](/arsitektur/audit-trail)
