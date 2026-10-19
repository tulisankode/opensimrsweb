# Referensi API

Halaman ini untuk integrator dan pengembang yang memanggil API OpenSIMRS dari aplikasi lain, misalnya aplikasi mobile, kiosk, dashboard, atau sistem mitra. Isinya gambaran umum: alamat dasar tiap layanan, versi, format permintaan dan respons, paginasi, galat, dan contoh `curl` yang bisa langsung dicoba di instalasi lokal.

Rincian login dan token ada di [Autentikasi](/api/autentikasi). Daftar endpoint ada di [Endpoint per Layanan](/api/layanan).

## Alamat dasar

OpenSIMRS terdiri dari 19 layanan Express. Setiap layanan punya port dan awalan sendiri, semuanya di bawah `/api/v3/`.

| Layanan | Port | Awalan |
|---|---|---|
| `admisi-service` | 8081 | `/api/v3/admisi` |
| `antrian-service` | 8082 | `/api/v3/antrian` |
| `auth-service` | 8083 | `/api/v3/auth` |
| `farmasi-service` | 8084 | `/api/v3/farmasi` |
| `igd-service` | 8085 | `/api/v3/pelayanan` |
| `inventory-service` | 8086 | `/api/v3/inventory` |
| `lab-service` | 8087 | `/api/v3/lab` |
| `laporan-service` | 8088 | `/api/v3/laporan` |
| `payment-service` | 8089 | `/api/v3/payment` |
| `studio-service` | 8090 | `/api/v3/studio` |
| `rawat-inap-service` | 8091 | `/api/v3/ranap` |
| `rawat-jalan-service` | 8092 | `/api/v3/rajal` |
| `rekamedis-service` | 8093 | `/api/v3/rekam-medis` |
| `setting-service` | 8094 | `/api/v3/setting` |
| `stok-farmasi-service` | 8095 | `/api/v3/stok` |
| `datamaster-service` | 8096 | `/api/v3/datamaster` |
| `satusehat-service` | 8097 | `/api/v3/satusehat` |
| `bpjs-service` | 8098 | `/api/v3/bpjs` |
| `penunjang-service` | 8099 | `/api/v3/penunjang` |
| `program-puskesmas-service` | 8100 | `/api/v3/program-puskesmas` |

Di mesin pengembang, panggil layanan langsung, misalnya `http://localhost:8081/api/v3/admisi/patient`.

### Lewat gateway

Di server yang dipasang dengan `deploy.sh`, gateway nginx (port `8080`, berkas `deploy/server/gateway.nginx.conf`) menyatukan semua `/api/v3/<layanan>/` dalam satu alamat. Integrator cukup memakai satu domain API, misalnya `https://api.simrs.contoh.id/api/v3/admisi/patient`. Lihat [Akses Lewat Domain](/memulai/akses-domain).

::: warning `setting-service` dan `stok-farmasi-service`
Kedua layanan ini memakai versi dari variabel `API_VERSION`. Bila variabel itu tidak diisi, kode memakai `v1`. Pastikan `.env` berisi `API_VERSION="v3"` (seperti di `.env.example`) agar alamatnya sama dengan tabel di atas dan dengan gateway.
:::

## Versi

Versi API saat ini adalah **v3**, tertulis di path (`/api/v3/...`). Awalan `api` dan versi dapat diubah lewat `API_BASE` dan `API_VERSION` di beberapa layanan, tetapi frontend dan gateway mengasumsikan `/api/v3`. Belum ada kebijakan versi API terpisah dari versi rilis OpenSIMRS; perubahan yang memengaruhi integrator dicatat di [Catatan Rilis](/pendahuluan/catatan-rilis).

## Format permintaan

- Badan permintaan berupa JSON (`Content-Type: application/json`), kecuali unggah berkas (multipart).
- Nama field memakai **snake_case**, misalnya `refresh_token`, `faskes_uuid`. Frontend Vue memakai camelCase dan dikonversi otomatis oleh axios.
- ID berupa UUID (`uuidv7`). Waktu umumnya dalam **epoch detik**.
- Data dihapus secara *soft delete* (`deleted_at`).
- Endpoint yang dilindungi wajib header `Authorization: Bearer <token>`.
- **Faskes selalu diambil dari token.** Jangan mengirim `faskes_uuid` untuk memilih faskes; permintaan selalu berlaku untuk faskes yang tertera di token. Lihat [Autentikasi](/api/autentikasi).

Konvensi lengkap ada di [Konvensi API](/arsitektur/konvensi-api).

## Format respons

Respons sukses berbentuk objek dengan `message` dan `payload`:

```json
{
  "message": "Data berhasil ditampilkan",
  "payload": { }
}
```

Letak informasi paginasi **belum seragam** antarlayanan. Dua bentuk yang dipakai:

::: code-group
```json [admisi-service dan layanan sejenis]
{
  "message": "Berhasil Menampilkan Pasien",
  "payload": [ ],
  "properties": {
    "page": 1,
    "page_size": 10,
    "total_page": 3,
    "total_data": 25,
    "next_page": 2,
    "prev_page": null
  }
}
```
```json [bpjs, satusehat, lab (LIS), penunjang]
{
  "message": "Data berhasil ditampilkan",
  "payload": [ ],
  "pagination": { "page": 1, "limit": 10, "total": 25 }
}
```
:::

::: tip
Periksa respons endpoint yang Anda pakai, lalu baca paginasi dari `properties` atau `pagination` sesuai bentuknya.
:::

## Paginasi dan pencarian

Endpoint daftar umumnya menerima parameter query berikut:

| Parameter | Bawaan | Keterangan |
|---|---|---|
| `page` | `1` | Nomor halaman |
| `limit` | `10` | Jumlah data per halaman. Beberapa endpoint membatasi maksimum (mis. 100) |
| `q` | – | Kata kunci pencarian, mis. nama pasien, nomor RM, atau NIK di `/api/v3/admisi/patient` |

Filter tambahan berbeda per endpoint (mis. `status`, `tanggal`, `dari`, `sampai`). Periksa controller atau repository layanan terkait.

## Galat

Galat dikembalikan dengan kode HTTP yang sesuai dan badan JSON berisi `message`. Beberapa layanan menambahkan `errors`:

```json
{
  "message": "Authentikasi gagal",
  "errors": [{ "type": "invalid token", "message": "Token tidak valid atau kadaluarsa" }]
}
```

| Kode | Arti umum |
|---|---|
| `400` | Data tidak valid (validasi gagal) |
| `401` | Belum login, token tidak valid, atau token kedaluwarsa |
| `403` | Tidak punya izin, atau modul/fitur belum aktif untuk faskes |
| `404` | Data tidak ditemukan |
| `409` | Bentrok status atau data ganda |
| `422` | Data belum lengkap untuk diproses (mis. pengiriman ke BPJS/SATUSEHAT) |
| `429` | Terlalu banyak permintaan |
| `5xx` | Galat server atau layanan mitra |

Titik masuk hasil dari sistem mitra (LIS, PACS, HDIS, UTD) memakai format `{ "success": false, "message": "…" }`.

### Batas laju

`payment-service` dan `rawat-inap-service` membatasi **100 permintaan per 5 menit per IP** (HTTP `429` bila terlampaui). Batas laju belum diatur seragam di layanan lain. Bila integrasi Anda memanggil API dengan volume tinggi, terapkan batas laju di gateway atau reverse proxy.

## Contoh cepat

Contoh berikut memakai instalasi lokal dengan data demo (`npm run db:demo:seed`) dan akun demo `superadmin` / `Demo@2026`.

::: code-group
```bash [macOS / Linux]
# 1. Login, simpan token
TOKEN=$(curl -s -X POST http://localhost:8083/api/v3/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"Demo@2026"}' | jq -r '.payload.token')

# 2. Daftar pasien halaman pertama
curl -s "http://localhost:8081/api/v3/admisi/patient?page=1&limit=5&q=" \
  -H "Authorization: Bearer $TOKEN"
```
```powershell [Windows]
$r = Invoke-RestMethod -Method Post -Uri http://localhost:8083/api/v3/auth/login `
  -ContentType "application/json" -Body '{"username":"superadmin","password":"Demo@2026"}'
$TOKEN = $r.payload.token

Invoke-RestMethod -Uri "http://localhost:8081/api/v3/admisi/patient?page=1&limit=5&q=" `
  -Headers @{ Authorization = "Bearer $TOKEN" }
```
:::

::: danger Akun demo hanya untuk lingkungan lokal
Akun dan data demo hanya untuk development dan staging. Jangan pernah memakai akun demo di instalasi yang berisi data pasien.
:::

## Lihat juga

- [Autentikasi](/api/autentikasi)
- [Endpoint per Layanan](/api/layanan)
- [Konvensi API](/arsitektur/konvensi-api)
- [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin)
