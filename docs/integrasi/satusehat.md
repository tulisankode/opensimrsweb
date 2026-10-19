# SATUSEHAT

Halaman ini untuk tim IT faskes yang mengirim data kunjungan dari OpenSIMRS ke **SATUSEHAT**, platform data kesehatan Kementerian Kesehatan berbasis standar FHIR R4. Setelah mengikuti halaman ini, Anda bisa mengisi kredensial faskes, memahami data apa yang dikirim dan kapan, serta menangani kegagalan pengiriman.

Integrasi ini dilayani `satusehat-service` (port `8097`, awalan `/api/v3/satusehat`). Modul `satusehat` tercatat sebagai modul inti, sehingga selalu aktif. Pengiriman baru berjalan setelah kredensial faskes diisi dan statusnya aktif.

## Prasyarat

- Faskes sudah terdaftar di portal SATUSEHAT dan memiliki **Client ID**, **Client Secret**, dan **Organization ID**. Mulailah dengan kredensial **sandbox** (staging Kemenkes).
- **Dokter** (DPJP) punya NIK 16 digit di data pegawai dan sudah terdaftar sebagai *Practitioner* di SATUSEHAT.
- **Pasien** memakai identitas KTP dengan NIK 16 digit yang terdaftar di SATUSEHAT.
- Server bisa keluar ke API SATUSEHAT lewat IP publik Indonesia.

## Mengisi kredensial

1. Buka **Setting › Konfigurasi Integrasi › SATUSEHAT**.
2. Isi **Client ID**, **Client Secret**, dan **Organization ID**, lalu pilih **Status** aktif.
3. Klik **Simpan**.
4. Klik **Uji Koneksi**. OpenSIMRS meminta token OAuth2 dan membaca data *Organization* faskes Anda. Bila berhasil, nama organisasi dari SATUSEHAT ditampilkan.

Kredensial diisi **per faskes**, tidak di `.env`. Jangan menuliskan nilainya di dokumentasi, tiket, atau tangkapan layar.

### Variabel lingkungan `satusehat-service`

| Variabel | Bawaan | Fungsi |
|---|---|---|
| `SATUSEHAT_MODE` | `nyata` | `mock` = tidak memanggil Kemenkes. Mode ini tidak menulis ID tiruan ke database |
| `SATUSEHAT_LINGKUNGAN` | `sandbox` | `sandbox` (staging Kemenkes) atau `produksi` |
| `SATUSEHAT_BASE_URL` | sesuai lingkungan | Menimpa alamat dasar API bila perlu |
| `SATUSEHAT_PEKERJA` | aktif | `false` mematikan pengiriman otomatis |
| `SATUSEHAT_INTERVAL_MENIT` | `15` | Jeda pengiriman otomatis |
| `SATUSEHAT_RENTANG_HARI` | `7` | Rentang hari kunjungan yang diproses pekerja |
| `SATUSEHAT_MAKS_PERCOBAAN` | `5` | Batas percobaan ulang untuk kunjungan yang gagal |
| `SATUSEHAT_TIMEOUT_MS` | `30000` | Batas waktu permintaan |

Urutan yang disarankan: uji dengan `SATUSEHAT_LINGKUNGAN=sandbox` dan `SATUSEHAT_MODE=nyata` memakai kredensial sandbox. Pindah ke `SATUSEHAT_LINGKUNGAN=produksi` hanya di server produksi setelah uji sandbox lulus.

## Data yang dikirim

Saat ini OpenSIMRS mengirim **kunjungan rawat jalan yang sudah selesai** (pasien sudah dipulangkan/*discharge*). Satu kunjungan dikirim sebagai satu *Bundle* transaksi FHIR berisi:

| Resource | Isi |
|---|---|
| `Encounter` | Kunjungan rawat jalan (kelas `AMB`), nomor pelayanan sebagai identifier, pasien, dokter, lokasi, riwayat status *arrived → in-progress → finished*, dan daftar diagnosis |
| `Condition` | Diagnosis ICD-10 dari rekam medis. Diagnosis pertama dianggap diagnosis utama |
| `Observation` | Tanda vital terakhir bila diisi: nadi, frekuensi napas, tekanan darah sistolik dan diastolik, suhu (kode LOINC). Nilai kosong atau 0 tidak dikirim |

Sebelum Bundle dikirim, OpenSIMRS memastikan ID SATUSEHAT (IHS) untuk:

- **Pasien**: dicari berdasarkan NIK, lalu disimpan di data pasien;
- **Dokter**: dicari berdasarkan NIK pegawai, lalu disimpan di data *practitioner*;
- **Lokasi (poli)**: dibuat sebagai resource `Location` milik *Organization* faskes bila belum punya ID, lalu disimpan.

ID yang sudah tersimpan dipakai ulang pada pengiriman berikutnya.

::: info Data lain belum dikirim
Rawat inap, IGD, resep, dan hasil penunjang belum dikirim ke SATUSEHAT. Fitur **Kirim Imunisasi ke SATUSEHAT** (modul Program Puskesmas) sudah ada di katalog, tetapi pemetaan resource `Immunization` belum tersedia di `satusehat-service`. Pelayanan imunisasi tetap tersimpan dan status kirimnya ditandai gagal dengan pesan yang jelas.
:::

## Alur pengiriman

```
Kunjungan RJ selesai (discharge)
        │
        ▼
Pekerja otomatis (tiap 15 menit)  atau  tombol Kirim / Kirim Sekarang
        │
        ▼
Cek kredensial → cari/simpan IHS pasien, dokter, lokasi → ambil diagnosis & tanda vital dari rekam medis
        │
        ▼
POST Bundle transaksi ke SATUSEHAT → simpan ID Encounter & ID resource
```

- **Otomatis**: untuk setiap faskes yang integrasinya aktif, pekerja mengambil kunjungan selesai dalam `SATUSEHAT_RENTANG_HARI` hari terakhir yang belum terkirim atau gagal dengan percobaan di bawah `SATUSEHAT_MAKS_PERCOBAAN`. Paling banyak 50 kunjungan per putaran.
- **Manual**: di **Setting › Konfigurasi Integrasi › SATUSEHAT**, daftar kunjungan menampilkan status tiap kunjungan. Tombol **Kirim**/**Kirim Ulang** mengirim satu kunjungan, dan **Kirim Sekarang** menjalankan pekerja untuk faskes Anda.
- **Tidak ada kiriman ganda**: kunjungan yang sudah punya Encounter di SATUSEHAT tidak dikirim ulang, karena itu akan membuat data ganda.

Status kunjungan di daftar: belum diproses, terkirim, atau gagal (beserta pesan galat dan jumlah percobaan).

## Pemecahan masalah

Kegagalan karena data belum lengkap ditampilkan apa adanya. Perbaiki datanya, lalu klik **Kirim Ulang**.

| Pesan | Solusi |
|---|---|
| Konfigurasi SATUSEHAT (Client ID, Client Secret, Organization ID) belum lengkap | Lengkapi ketiganya di Setting › Konfigurasi Integrasi › SATUSEHAT |
| Kunjungan belum selesai (discharge) | Selesaikan kunjungan di rawat jalan |
| Pasien … tidak memiliki NIK 16 digit | Ubah identitas pasien menjadi KTP dengan NIK 16 digit |
| NIK pasien … belum terdaftar di SATUSEHAT | Pasien belum punya IHS. Pastikan NIK benar; pengiriman tidak bisa dilanjutkan sampai NIK dikenali SATUSEHAT |
| Dokter … belum memiliki NIK 16 digit di data pegawai | Lengkapi NIK dokter di data pegawai |
| NIK dokter … belum terdaftar sebagai Practitioner | Daftarkan tenaga kesehatan di SATUSEHAT |
| Diagnosis ICD-10 belum diisi di rekam medis | Isi diagnosis dokter pada kunjungan |
| Semua permintaan habis waktu | Server tidak keluar lewat IP Indonesia atau koneksi keluar diblokir |

Galat dari SATUSEHAT (*OperationOutcome*) diringkas menjadi pesan yang mudah dibaca dan tersimpan di catatan sinkronisasi.

## Lihat juga

- [BPJS Kesehatan](/integrasi/bpjs)
- [Rawat Jalan](/modul/rawat-jalan)
- [Konfigurasi](/memulai/konfigurasi)
- [Endpoint per Layanan](/api/layanan)
