# HDIS (Hemodialisa)

Halaman ini untuk tim IT faskes dan vendor HDIS (*Hemodialysis Information System*) yang menyambungkan mesin atau sistem hemodialisa ke modul **Unit Hemodialisa** OpenSIMRS. Setelah mengikuti halaman ini, jadwal HD terkirim otomatis ke HDIS dan parameter mesin per sesi masuk ke catatan intradialitik pasien.

Bridging ini dilayani `penunjang-service` (port `8099`) melalui fitur **Bridging HDIS** (`hd_bridging_hdis`) di modul `hemodialisa`.

::: info Kontrak REST generik
Belum ada spesifikasi vendor resmi. OpenSIMRS memakai kontrak REST generik versi `1` yang dijelaskan di halaman ini. Bila vendor Anda memakai format lain, adaptasi dilakukan di `penunjang-service/src/hemodialisa/hdis/kirim.js` (jadwal keluar) dan `hdis/terima.js` (parameter masuk).
:::

## Alur singkat

```
OpenSIMRS ── jadwal + data pasien minimum ──►  HDIS          (POST ke URL Penerima Jadwal)
OpenSIMRS ◄── parameter mesin per sesi ─────── HDIS          (POST ke /adam-hdis/bridging)
```

1. Saat jadwal HD dibuat, dipindah, atau dibatalkan, OpenSIMRS mengirim jadwal ke HDIS.
2. Selama sesi HD berjalan, HDIS mengirim pengukuran (tekanan darah, QB, UF, TMP, dan seterusnya) ke OpenSIMRS.
3. Pengukuran dilekatkan ke sesi HD yang sesuai sebagai observasi bersumber `hdis`.

## Menyiapkan koneksi

1. Aktifkan modul **Unit Hemodialisa** dan fitur **Bridging HDIS** di **Setting › Manajemen Modul**.
2. Buka **Setting › Konfigurasi Integrasi › Hemodialisa › HDIS**, lalu tambah koneksi:
   - **Nama** koneksi;
   - **URL Penerima Jadwal**: alamat HDIS yang menerima jadwal;
   - **API Key**: kunci dari vendor HDIS, dikirim OpenSIMRS di header `x-api-key`.
3. Salin **Kunci Masuk** yang ditampilkan. Kunci ini tampil utuh **sekali saja** dan dipakai HDIS saat mengirim parameter ke OpenSIMRS.
4. Klik **Uji** untuk memeriksa apakah HDIS bisa dihubungi dan menerima API key.
5. Petakan mesin di **Hemodialisa › Mapping HDIS**: setiap mesin HD OpenSIMRS dipasangkan dengan kode mesin di HDIS. Jadwal untuk mesin yang belum dipetakan tercatat **gagal** dan bisa dikirim ulang setelah pemetaan dilengkapi.

Satu faskes boleh punya lebih dari satu koneksi; satu koneksi aktif ditandai **bawaan**. API key dan kunci masuk disimpan terenkripsi dengan kunci `HD_HDIS_KUNCI_RAHASIA` (bila kosong memakai `SECRET_KEY`). Batas waktu permintaan ke HDIS diatur `HD_HDIS_TIMEOUT_MS` (bawaan 10000).

### Hak akses

| Aksi | Izin |
|---|---|
| Melihat/mengubah koneksi | **Setting › Konfigurasi Integrasi** (READ / UPDATE KONFIGURASI LAINNYA) atau **Hemodialisa › Datamaster › Mapping HDIS** |
| Pemetaan mesin | **Hemodialisa › Datamaster › Mapping HDIS** (READ / UPDATE) |
| Melihat riwayat pesan | **Hemodialisa › Registrasi & Jadwal › READ**, Mapping HDIS, atau Konfigurasi Integrasi |
| Kirim ulang jadwal | **Hemodialisa › Registrasi & Jadwal › UPDATE** atau Mapping HDIS UPDATE |

Semua rute konfigurasi memeriksa status fitur secara *fail-closed*: bila fitur nonaktif atau statusnya tidak dapat dipastikan, permintaan ditolak dengan pesan "Fitur Bridging HDIS belum diaktifkan untuk faskes ini".

## OpenSIMRS → HDIS: jadwal

`POST <URL Penerima Jadwal>` dengan header `x-api-key` (API key koneksi) dan `Idempotency-Key`.

```json
{
  "versi_kontrak": "1",
  "kunci_idempoten": "jadwal:0192…:v1",
  "aksi": "jadwal",
  "jadwal": {
    "kode_jadwal_simrs": "0192…",
    "tanggal": "2026-10-19",
    "shift": { "kode": "PAGI", "nama": "Pagi", "jam_mulai": "07:00", "jam_selesai": "12:00" },
    "kode_mesin_hdis": "MSN-03",
    "status": "terjadwal"
  },
  "pasien": { "no_rm": "RM-000123", "nama": "Pasien Fiktif", "jenis_kelamin": "P", "tanggal_lahir": "1980-01-01" },
  "registrasi": { "no_reg_hd": "HD-20261018-0001", "jenis": "kronis" }
}
```

- `aksi` bernilai `"batal"` untuk pembatalan jadwal.
- **Data pasien minimum**: tanpa NIK, alamat, telepon, penjamin, atau diagnosis. Nama pasien tidak disimpan di log pesan.
- Kunci idempoten `jadwal:<uuid>:v<versi>` sama pada setiap percobaan ulang. Versi naik saat jadwal dipindah atau dibatalkan. HDIS wajib menganggap kunci yang sama sebagai pesan yang sama.
- Kegagalan kirim **tidak** membatalkan penyimpanan jadwal di OpenSIMRS.

Status pengiriman di riwayat:

| Status | Arti | Tindakan |
|---|---|---|
| `terkirim` | HDIS menjawab 2xx | – |
| `gagal` | Pasti belum diproses HDIS: koneksi ditolak, 4xx, atau mesin belum dipetakan | Perbaiki penyebabnya, lalu kirim ulang |
| `tidak_pasti` | Waktu habis atau 5xx; HDIS mungkin sudah memproses | Kirim ulang aman karena kunci idempoten sama |

## HDIS → OpenSIMRS: parameter mesin

`POST /adam-hdis/bridging` ke `penunjang-service`, dengan kunci masuk di header `x-api-key` (atau `?key=`). Endpoint ini **tidak memakai JWT login**; koneksi dan faskes ditentukan dari kunci masuk.

```json
{
  "kode_jadwal_simrs": "0192…",
  "kunci_idempoten": "hdis-msn03-20261019-0730",
  "waktu_pengukuran": 1760833800,
  "kode_mesin_hdis": "MSN-03",
  "parameter": { "td_sistolik": 130, "td_diastolik": 80, "nadi": 84, "qb_ml_menit": 250, "uf_volume_ml": 600, "tmp_mmhg": 120 }
}
```

- `kunci_idempoten` wajib (maks. 200 karakter). Pesan dengan kunci yang sama dan sudah diterapkan mengembalikan hasil sebelumnya (`duplikat: true`) tanpa observasi baru.
- `waktu_pengukuran` dalam epoch detik.
- `kode_mesin_hdis` opsional. Bila diisi, harus cocok dengan mesin pada jadwal.
- Nilai `parameter` boleh angka langsung atau `{ "nilai": 84, "satuan": "x/menit" }`.

### Parameter yang diterima

| Kode | Parameter | Satuan |
|---|---|---|
| `td_sistolik` / `td_diastolik` | Tekanan darah | mmHg |
| `nadi` | Nadi | x/menit |
| `suhu` | Suhu | °C |
| `napas` | Frekuensi napas | x/menit |
| `spo2` | SpO2 | % |
| `qb_ml_menit` / `qd_ml_menit` | QB / QD | mL/menit |
| `uf_volume_ml` | Volume UF | mL |
| `uf_rate_ml_jam` | Laju UF | mL/jam |
| `tmp_mmhg` | TMP | mmHg |
| `tekanan_arteri_mmhg` / `tekanan_vena_mmhg` | Tekanan arteri / vena | mmHg |
| `konduktivitas_ms_cm` | Konduktivitas | mS/cm |
| `suhu_dialisat` | Suhu dialisat | °C |
| `heparin_ml_jam` | Heparin | mL/jam |

Daftar lengkap beserta batas kewajarannya bisa dibaca dari `GET /api/v3/penunjang/hemodialisa/referensi`.

### Pesan yang ditolak (karantina)

Pesan berikut dicatat berstatus **ditolak** dan tidak mengubah catatan klinis:

| Kondisi | HTTP |
|---|---|
| Kunci masuk salah atau koneksi nonaktif | 401 |
| Fitur Bridging HDIS tidak aktif untuk faskes | 403 |
| Parameter tidak dikenal, satuan berbeda, atau nilai di luar batas kewajaran | 400 |
| Jadwal tidak ditemukan di faskes koneksi | 404 |
| Kode mesin tidak cocok dengan mesin jadwal | 409 |
| Sesi HD belum dimulai atau belum ada | 409 |

Pesan yang ditolak karena sesi belum dimulai boleh dikirim ulang setelah sesi berjalan. Data yang datang setelah sesi ditutup tetap disimpan, tetapi ditandai **perlu ditinjau** perawat.

Galat dikembalikan dalam format `{ "success": false, "message": "…" }`.

::: warning Di balik gateway
Gateway nginx bawaan hanya meneruskan `/api/v3/*`. Bila HDIS mengakses OpenSIMRS lewat gateway, daftarkan alias `POST /api/v3/penunjang/hemodialisa/hdis/masuk` sebagai pengganti `/adam-hdis/bridging`.
:::

## Riwayat pesan

Riwayat pesan masuk dan keluar dapat difilter berdasarkan status, arah, jadwal, atau sesi. Pengiriman jadwal yang gagal atau tidak pasti dapat **dikirim ulang** dari riwayat; yang dikirim adalah keadaan jadwal terkini.

## Menguji tanpa HDIS vendor

```bash
node scripts/hdis-tiruan.mjs     # http://localhost:2416, API key: kunci-uji-hdis
```

Isi koneksi dengan URL Penerima Jadwal `http://localhost:2416/api/jadwal` dan API key `kunci-uji-hdis`, lalu atur HDIS tiruan agar mendorong parameter ke OpenSIMRS memakai kunci masuk yang Anda salin. Langkah lengkapnya ada di `scripts/README-hdis-tiruan.md`. Gunakan hanya data fiktif.

## Lihat juga

- [Penunjang Medis](/modul/penunjang-medis)
- [LIS & PACS](/integrasi/lis-pacs) (pola koneksi dan kunci masuk yang sama)
- [Endpoint per Layanan](/api/layanan)
