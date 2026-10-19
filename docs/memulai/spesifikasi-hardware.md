# Spesifikasi Hardware

Halaman ini membantu implementator memperkirakan perangkat keras untuk memasang OpenSIMRS di server milik faskes (*on-premise*), dari laptop pengembang sampai rumah sakit kelas A. Selain server, halaman ini juga membahas jaringan, listrik, cadangan, dan perangkat klien.

::: warning Angka adalah titik awal
Angka di bawah adalah **titik awal**, bukan jaminan. Kebutuhan sebenarnya bergantung pada jumlah kunjungan, jumlah pengguna bersamaan, modul yang aktif, lampiran/gambar, dan integrasi. Ukur ulang pemakaian CPU, RAM, disk, dan waktu respons setelah beberapa minggu berjalan, lalu sesuaikan.
:::

## Dasar perhitungan

Satu instalasi lengkap OpenSIMRS terdiri dari layanan backend Node.js, frontend, PostgreSQL, MongoDB, Redis, dan (pada deploy server) gateway nginx. Berkas `deploy/server/docker-compose.server.yml` memberi batas memori untuk setiap komponen:

| Komponen | Batas memori di `docker-compose.server.yml` |
|---|---|
| Layanan backend inti | ±384 MB per layanan |
| Layanan integrasi/penunjang | ±192 MB per layanan |
| Frontend (Vue, disajikan Node) | ±768 MB |
| PostgreSQL 16 | ±1 GB |
| MongoDB 7 | ±512 MB |
| Redis 7 | ±128 MB |
| Gateway nginx | ±64 MB |

Jumlah batas memori seluruh tumpukan sekitar **±9 GB**. Angka ini adalah **plafon**; pemakaian rata-rata biasanya lebih rendah, tetapi sisakan ruang untuk sistem operasi, cache disk database, proses build, dan cadangan. Pada faskes besar, PostgreSQL adalah komponen yang paling diuntungkan oleh tambahan RAM dan disk cepat.

Instalasi native (tanpa Docker) membutuhkan sumber daya yang setara: semua proses Node.js layanan, ditambah PostgreSQL, MongoDB, Redis, dan nginx.

::: tip Kebutuhan RAM minimum
Instalasi lengkap menjalankan seluruh layanan backend, frontend, PostgreSQL, MongoDB, dan Redis sekaligus, jadi ikuti angka di tabel berikut. VPS kecil (mis. RAM 2 GB) tidak cukup untuk instalasi lengkap. Bila RAM terbatas, jalankan hanya layanan inti dengan `npm run dev:core` (auth, datamaster, admisi, dan frontend).
:::

## Spesifikasi per segmen

| Segmen | Topologi | CPU | RAM | Penyimpanan |
|---|---|---|---|---|
| **Laptop pengembang** | 1 laptop | 4 core | 16 GB (minimal 8 GB bila hanya menjalankan `npm run dev:core`) | SSD, ruang kosong 30 GB |
| **Dokter praktik mandiri** | 1 server atau mini PC | 4 core | 8–16 GB | SSD 256 GB |
| **Klinik pratama / klinik utama** | 1 server | 4–8 core | 16–32 GB | SSD 500 GB, RAID1 |
| **RS kelas D / C** | 1 server aplikasi; disarankan server database terpisah | 8–16 core | 32–64 GB | SSD/NVMe 1 TB, RAID1 atau RAID10 |
| **RS kelas B / A** | Minimal 2 server aplikasi + 1–2 server database (replika) + load balancer | 16–32 core per server | 64–128 GB per server | NVMe RAID10 2 TB+ |

Puskesmas umumnya setara klinik pratama; sesuaikan dengan jumlah kunjungan dan program yang aktif.

### Catatan per segmen

- **Praktik mandiri:** cukup menjalankan `deploy/server/deploy.sh` di satu mesin. Pastikan ada cadangan di luar mesin tersebut.
- **Klinik:** RAID1 melindungi dari kerusakan satu disk, tetapi **bukan pengganti cadangan**.
- **RS kelas D/C:** pisahkan PostgreSQL dan MongoDB ke server database agar beban aplikasi tidak mengganggu database. Arahkan `DB_HOST` dan `MONGO_DB_HOST` ke server tersebut.
- **RS kelas B/A:** jalankan beberapa instans layanan di belakang load balancer, replika database untuk ketersediaan, dan pemantauan (CPU, RAM, disk, waktu respons).

::: info Multi-server belum ada skripnya
Konfigurasi multi-server untuk RS kelas B/A belum disediakan skripnya. Rencanakan bersama tim infrastruktur faskes.
:::

## Kebutuhan pendukung

### Jaringan

- LAN **gigabit** antara server dan ruang pelayanan.
- Internet stabil untuk SATUSEHAT dan BPJS (PCare/VClaim). Keduanya hanya menerima koneksi dari **IP Indonesia**. Sediakan jalur cadangan bila memungkinkan.
- Port database (5432, 27017, 6379) **tidak dibuka** ke luar server.

### Listrik

- **UPS** untuk server dan perangkat jaringan, cukup untuk mematikan server dengan aman atau bertahan sampai genset menyala.

### Cadangan 3-2-1

- **3** salinan data, di **2** media berbeda, **1** di luar lokasi (*offsite*) dan **terenkripsi**.
- Cadangan **harian** PostgreSQL dan MongoDB dilakukan bersamaan. Uji pemulihan secara berkala.

Cara membuat cadangan ada di [Pembaruan & Cadangan](/memulai/pembaruan-cadangan).

### Perangkat lunak server

- Sistem operasi: **Ubuntu Server LTS** atau **Debian** stabil.
- **Docker Engine + Docker Compose v2** (cara Docker), atau PostgreSQL 16, MongoDB 7, Redis 7, dan Node.js 22 (cara native). Lihat [Instalasi](/memulai/instalasi) dan [Deployment](/memulai/deployment).

## Estimasi pertumbuhan penyimpanan

Perkirakan dengan rumus kasar:

```
pertumbuhan per tahun ≈ kunjungan per hari × hari layanan per tahun × ukuran data per kunjungan
                       + lampiran (hasil scan, gambar radiologi, dokumen)
```

- Data terstruktur + isi RME per kunjungan umumnya puluhan sampai ratusan KB. Ukur sendiri dari pertumbuhan database setelah satu bulan berjalan.
- **Lampiran dan gambar radiologi** jauh lebih besar (MB per berkas) dan biasanya mendominasi. Bila memakai PACS/DICOM, simpan citra di penyimpanan terpisah.
- Tambahkan ruang untuk cadangan lokal, log, dan image Docker. Build image membutuhkan ±10–15 GB ruang kosong.

**Contoh:** 100 kunjungan/hari × 300 hari × 200 KB ≈ **6 GB/tahun** untuk data terstruktur, belum termasuk lampiran.

## Perangkat klien

| Perangkat | Kegunaan |
|---|---|
| Komputer/laptop dengan **browser modern** (Chrome, Edge, Firefox versi terbaru) | Mengakses aplikasi |
| **Printer** biasa | Dokumen, resume, kuitansi |
| **Printer label/thermal** | Label spesimen, gelang, dan struk |
| **Layar antrian** (TV + mini PC/stick dengan browser) | Layar panggilan antrian; anjungan pasien mandiri bila dipakai |
| **Pembaca barcode** | Label spesimen dan obat |

## Langkah berikutnya

- [Instalasi](/memulai/instalasi): memasang OpenSIMRS.
- [Deployment](/memulai/deployment): memasang di server faskes.
- [Pembaruan & Cadangan](/memulai/pembaruan-cadangan): menjaga data tetap aman.
- [Kebijakan Keamanan](/pendahuluan/keamanan): praktik keamanan saat deploy.
