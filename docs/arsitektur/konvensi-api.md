# Konvensi API

Halaman ini merangkum pola yang dipakai bersama oleh API layanan OpenSIMRS: awalan rute, header autentikasi, bentuk respons, kode status, isolasi faskes, dan batas laju. Ikuti pola ini saat menambah endpoint baru agar frontend dan klien lain bisa memakainya secara seragam. Daftar endpoint per layanan ada di [Referensi API](/api/).

::: info Kode warisan
Sebagian layanan berasal dari basis kode yang berbeda-beda, sehingga detail respons (terutama bentuk galat dan paginasi) belum sepenuhnya seragam. Bila menambah endpoint, tirulah pola layanan tempat Anda bekerja.
:::

## Awalan rute

Semua endpoint berada di bawah awalan berikut:

```text
/api/v3/<layanan>/...
```

`api` dan `v3` berasal dari variabel `API_BASE` dan `API_VERSION`. Segmen `<layanan>` untuk setiap layanan:

| Layanan | Awalan |
|---|---|
| `admisi-service` | `/api/v3/admisi` |
| `antrian-service` | `/api/v3/antrian` |
| `auth-service` | `/api/v3/auth` |
| `farmasi-service` | `/api/v3/farmasi` |
| `igd-service` | `/api/v3/pelayanan` |
| `inventory-service` | `/api/v3/inventory` |
| `lab-service` | `/api/v3/lab` |
| `laporan-service` | `/api/v3/laporan` |
| `payment-service` | `/api/v3/payment` |
| `rawat-inap-service` | `/api/v3/ranap` |
| `rawat-jalan-service` | `/api/v3/rajal` |
| `rekamedis-service` | `/api/v3/rekam-medis` |
| `setting-service` | `/api/v3/setting` |
| `stok-farmasi-service` | `/api/v3/stok` |
| `datamaster-service` | `/api/v3/datamaster` |
| `satusehat-service` | `/api/v3/satusehat` |
| `bpjs-service` | `/api/v3/bpjs` |
| `penunjang-service` | `/api/v3/penunjang` |
| `program-puskesmas-service` | `/api/v3/program-puskesmas` |
| `studio-service` | `/api/v3/studio` |

Pada deploy server, semua awalan ini dilayani satu domain lewat gateway nginx (mis. `https://api.simrs.contoh.id/api/v3/auth/login`). Lihat [Gambaran Sistem](/arsitektur/gambaran#gateway-nginx).

## Format data

- Body permintaan dan respons berupa **JSON**.
- Nama field memakai **`snake_case`** (`no_rm`, `faskes_uuid`). Frontend mengubahnya ke `camelCase` secara otomatis.
- ID berupa string **uuidv7**; waktu berupa **epoch detik**. Lihat [Basis Data & Migrasi](/arsitektur/basis-data-migrasi#konvensi-data).

## Autentikasi

Kecuali endpoint publik (mis. `POST /api/v3/auth/login`), setiap permintaan wajib menyertakan token dari login:

```http
GET /api/v3/datamaster/... HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
```

Token diverifikasi di setiap layanan (JWT HS256) dan sesinya harus masih ada di Redis. Rincian ada di [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin).

Beberapa jalur memakai mekanisme lain:

- **Titik masuk hasil sistem eksternal** (`/adam-lis/...`, `/adam-pacs/...`, `/adam-utd/...`, dll.) memakai kunci masuk per koneksi pada query `?key=<kunci masuk>`, bukan token login.
- **Kunci API internal** (`API_KEY_SECRET`, `API_KEY_CHECK_NORM`, `ADMISI_SECRET_KEY`, `ANTRIAN_KEY_SECRET`, `API_KEY_ANTRIAN`) dipakai untuk panggilan antarlayanan dan aplikasi pendukung seperti kiosk antrian.

## Bentuk respons

### Berhasil

Respons berhasil umumnya berbentuk `{ message, payload }`:

```json
{
  "message": "Login berhasil!",
  "payload": {
    "token": "<token>",
    "refreshToken": "<refresh-token>",
    "permissions": [],
    "user": { "faskesUuid": "...", "role": "super admin", "name": "..." }
  }
}
```

### Daftar dengan paginasi

Endpoint daftar menyertakan informasi paginasi. Di sebagian layanan (mis. `datamaster-service`), informasi itu ada di objek `properties`:

```json
{
  "message": "...",
  "payload": [ { "uuid": "...", "name": "..." } ],
  "properties": {
    "limit": 10,
    "offset": 1,
    "total_item": 42,
    "total_page": 5
  }
}
```

Layanan lain menaruh data dan totalnya di dalam `payload`. Periksa layanan terkait sebelum menulis klien.

### Galat

Galat umumnya berbentuk `{ message, errors: [...] }`. Setiap butir `errors` berisi `field` (galat validasi) atau `type`, beserta `message`:

```json
{
  "message": "Data gagal ditampilkan",
  "errors": [
    { "field": "username", "message": "username tidak boleh kosong" }
  ]
}
```

```json
{
  "message": "Authentikasi gagal",
  "errors": [
    { "type": "invalid token", "message": "Token tidak valid atau kadaluarsa" }
  ]
}
```

## Kode status umum

| Kode | Arti di OpenSIMRS |
|---|---|
| `200` | Berhasil. |
| `201` | Data berhasil dibuat (dipakai sebagian endpoint pembuatan). |
| `400` | Permintaan tidak valid, mis. galat validasi skema (Zod). |
| `401` | Token tidak ada, tidak valid, kedaluwarsa, atau sesinya sudah tidak ada di Redis. |
| `403` | Pengguna tidak punya izin untuk modul/submodul/fitur/aksi itu. |
| `404` | Data atau endpoint tidak ditemukan. Gateway menjawab `{"message":"Endpoint tidak ditemukan"}` untuk path di luar awalan yang dikenal. |
| `409` | Konflik, mis. melanggar batasan unik (kode yang sudah dipakai). |
| `429` | Terlalu banyak permintaan (batas laju, lihat di bawah). |
| `500` | Galat server. |

## Isolasi faskes

Satu instalasi melayani banyak faskes. Setiap endpoint wajib:

- mengambil `faskes_uuid` dari **token** (`request.author.faskesUuid`), **tidak pernah** dari body, query, atau parameter path;
- menyaring setiap query dengan `faskes_uuid` dan `deleted_at IS NULL`.

Dengan demikian, mengganti `faskes_uuid` di body permintaan tidak akan membuka data faskes lain. Superadmin berpindah faskes dengan meminta token baru (`PUT /api/v3/auth/token/:faskes`), bukan dengan mengirim `faskes_uuid` di permintaan.

## Batas laju

Dua layanan memasang batas laju dengan `express-rate-limit`:

| Layanan | Batas |
|---|---|
| `payment-service` | 100 permintaan per 5 menit per IP |
| `rawat-inap-service` | 100 permintaan per 5 menit per IP |

Bila batas terlampaui, layanan menolak permintaan dengan pesan *Too many requests from this IP, please try again after 5 minutes*. Layanan lain saat ini tidak memasang batas laju di tingkat aplikasi.

::: warning Di belakang gateway
Batas laju dihitung per alamat IP yang dilihat layanan. Layanan-layanan ini tidak mengatur `trust proxy` Express, sehingga bila permintaan datang lewat gateway atau reverse proxy, alamat yang terlihat adalah alamat proxy tersebut. Perhatikan hal ini saat menguji beban di server yang memakai gateway.
:::

## Health check

Sebagian layanan menyediakan endpoint kesehatan, mis. `GET /api/v3/setting/health`, `GET /api/v3/satusehat/health`, dan `GET /api/v3/bpjs/health`. Gateway nginx menjawab `GET /health` dengan `{"status":"ok"}`. `deploy.sh` memakai endpoint-endpoint ini untuk memutuskan rollback.

## Menambah endpoint baru

1. Tempatkan rute di bawah awalan layanan (`/api/v3/<layanan>/...`) dan beri nama path dalam Bahasa Indonesia yang konsisten dengan sekitarnya.
2. Pasang `authorization-sdk` (biasanya sudah di tingkat router) dan `permission-sdk` untuk aksi yang perlu dibatasi.
3. Ambil `faskes_uuid` dari `request.author`, jangan dari permintaan.
4. Validasi body dengan skema (umumnya Zod) dan kembalikan `{ message, payload }`.
5. Dokumentasikan endpoint di [Referensi API](/api/layanan).

## Lihat juga

- [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin)
- [Gambaran Sistem](/arsitektur/gambaran)
- [Referensi API](/api/)
