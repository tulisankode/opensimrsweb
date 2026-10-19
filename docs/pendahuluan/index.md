# Apa itu OpenSIMRS?

OpenSIMRS adalah **Sistem Informasi Manajemen Rumah Sakit (SIMRS)** sumber terbuka untuk fasilitas kesehatan (faskes) di Indonesia, dari praktik dokter mandiri sampai rumah sakit kelas A. Halaman ini menjelaskan tujuan proyek, siapa penggunanya, fitur utamanya, teknologi yang dipakai, dan kapan OpenSIMRS cocok dipakai.

::: warning Status: alfa (`1.0.0-alpha.1`)
Fitur OpenSIMRS masih bertambah cepat. Silakan dicoba dan dievaluasi. Sebelum dipakai di faskes, uji secara menyeluruh dan jalankan paralel dengan sistem lama terlebih dahulu.
:::

## Tujuan

OpenSIMRS dirancang untuk kebutuhan faskes di Indonesia: pendaftaran, rekam medis elektronik (RME), farmasi, laboratorium, kasir, rawat inap, IGD, layanan penunjang, sampai integrasi **SATUSEHAT** dan **BPJS Kesehatan**.

Visi komunitasnya adalah menjadikan OpenSIMRS fondasi digital yang dapat dipakai faskes di seluruh Indonesia. Sistem informasi kesehatan, menurut [manifesto komunitas](/komunitas/tata-kelola#manifesto-komunitas), harus terbuka, terjangkau, aman, berkelanjutan, dan dibangun bersama.

## Untuk siapa?

### Faskes pengguna

Satu aplikasi bisa dipakai berbagai jenis faskes karena fiturnya **modular per segmen**. Segmen menentukan modul, fitur, dan bagian form yang aktif bawaan, sehingga faskes kecil tidak dibebani menu rumah sakit.

| Segmen faskes | Contoh yang aktif bawaan |
|---|---|
| Dokter praktik mandiri | Pendaftaran & SOAP ringkas satu layar, resep, kasir sederhana |
| Klinik pratama / Puskesmas | Antrian, multi-poli, apotek & gudang, laboratorium, BPJS PCare, MCU |
| Klinik utama / RS kelas D | Rawat inap, IGD, radiologi, fisioterapi, BPJS VClaim (SEP) |
| RS kelas C / B / A | Ditambah patologi anatomi, mikrobiologi, dan modul rumah sakit lain (sebagian masih berstatus "Segera") |

Superadmin dapat menyalakan atau mematikan modul, fitur, dan bagian form untuk tiap faskes di luar bawaan segmennya. Penjelasannya ada di [Manajemen Modul & Fitur](/arsitektur/manajemen-modul).

### Kontributor

Semua orang yang ikut membangun OpenSIMRS adalah **Contributor**, apa pun bidangnya:

- **Implementator** (IT rumah sakit, klinik, puskesmas, mahasiswa): memasang, mengonfigurasi, dan mendampingi OpenSIMRS di faskes.
- **Developer** (mahasiswa dan pengembang): mempelajari sistem informasi kesehatan nyata dan mengerjakan backlog.
- **Tester/QA**: menguji alur dengan akun demo per segmen.
- **Product development** (analis kebutuhan, tenaga medis dan klinis, desainer UX): memvalidasi alur dan istilah tanpa perlu menulis kode.

Cara mulai ada di [Panduan Kontribusi](/pendahuluan/kontribusi).

## Fitur utama

| Modul | Ringkasan |
|---|---|
| **Pendaftaran & Antrian** | Data pasien, registrasi rawat jalan/inap/IGD, penjamin (umum, BPJS, asuransi), antrian poli dengan layar TV/kiosk bersuara, anjungan pasien mandiri |
| **Rekam Medis Elektronik** | Asesmen per bagian (alergi, tanda vital, nyeri, triase, gigi, mata, dan lainnya), SOAP, diagnosis ICD-10, tindakan, resep, order penunjang, resume & surat, SOAP Ringkas untuk praktik mandiri |
| **Rawat Jalan, Rawat Inap, IGD** | Alur periksa sampai selesai, SPRI, perpindahan bed/bangsal, discharge dengan tagihan kamar otomatis |
| **Farmasi & Inventory** | Telaah resep, racikan, penyerahan obat, penjualan bebas, stok depo, gudang, pembelian ke supplier, retur, stok opname |
| **Laboratorium** | Order dari RME, hasil & validasi, cetak hasil berkop dengan flag nilai abnormal, bridging LIS (kirim per order/massal, ambil hasil, mapping kode) |
| **Penunjang** | Radiologi, Fisioterapi, Patologi Anatomi, Mikrobiologi, Medical Check Up perorangan & korporasi |
| **Pembayaran** | Tagihan otomatis dari semua layanan tanpa tagihan ganda, kasir dengan/tanpa shift, diskon & voucher, kuitansi |
| **Integrasi** | SATUSEHAT (Kemenkes), BPJS PCare (FKTP) & VClaim (FKRTL), LIS |
| **Datamaster, Laporan & Setting** | Data faskes, lokasi, pegawai, tarif, peran & izin; dashboard dan laporan; profil, logo & warna tema per faskes |

Modul yang ditambahkan setelah rilis `1.0.0-alpha.1` (mis. Kamar Operasi, ICU, Gizi, Hemodialisa, Laundry, Mutu & Akreditasi) tercatat di [Catatan Rilis](/pendahuluan/catatan-rilis#belum-dirilis). Peta lengkapnya ada di [Peta Modul](/modul/).

::: tip SIMRS Studio
OpenSIMRS juga menyertakan **SIMRS Studio**, mode pengembang berbasis AI yang membantu IT faskes menyusun dan menerapkan fitur baru dengan gerbang persetujuan manusia. Studio mati secara bawaan. Lihat [Pengantar SIMRS Studio](/studio/).
:::

## Teknologi

| Lapisan | Teknologi |
|---|---|
| Backend | Node.js + Express, satu layanan per domain dengan awalan API `/api/v3/<layanan>` |
| Frontend | Vue 3 + TypeScript + PrimeVue + Pinia + Tailwind |
| Data terstruktur | PostgreSQL 16, satu database bersama untuk semua layanan |
| Isi rekam medis | MongoDB 7 |
| Cache token & izin | Redis 7 |
| Runtime | Node.js 22 LTS |

Semua layanan, SDK bersama `@opensimrs/*` (folder `packages/`), migrasi database, katalog modul, skrip deploy, dan dokumen berada di **satu monorepo**. Setiap data diisolasi per faskes. Rinciannya ada di [Gambaran Sistem](/arsitektur/gambaran) dan [Struktur Direktori](/memulai/struktur-direktori).

## Lisensi

OpenSIMRS dirilis di bawah **Lisensi MIT**. Siapa pun, termasuk mitra implementator komersial, boleh memakai, memasang, dan menawarkan jasa di atas OpenSIMRS sesuai lisensi. Perbaikan dan fitur yang berguna bagi faskes lain sangat dianjurkan untuk dikontribusikan kembali.

SDK bersama di `packages/` (`@opensimrs/model-sdk`, `@opensimrs/authorization-sdk`, `@opensimrs/permission-sdk`) berlisensi ISC, dengan atribusi penulis asli tetap dipertahankan.

## Kapan OpenSIMRS cocok dipakai?

| Kebutuhan Anda | Kecocokan saat ini |
|---|---|
| Mempelajari SIMRS nyata, tugas kuliah, kerja praktik, atau skripsi | **Cocok.** Data demo 8 faskes fiktif siap dipakai dan backlog diberi label `good first issue`. |
| Mengevaluasi SIMRS open source untuk faskes Anda | **Cocok.** Pasang dengan installer, lalu coba setiap segmen dengan [akun demo](/memulai/data-demo). |
| Pilot di praktik mandiri atau klinik | **Bisa, dengan uji paralel.** Segmen praktik mandiri menjadi fokus pertama roadmap. Jalankan berdampingan dengan sistem lama. |
| Produksi penuh di rumah sakit | **Belum disarankan tanpa uji menyeluruh.** Status masih alfa dan sebagian modul rumah sakit masih dikembangkan. |

Batasan yang perlu diketahui implementator menurut [Roadmap](/pendahuluan/roadmap):

- Otorisasi per peran dan penegakan Manajemen Modul sebagian besar masih di frontend (backlog B-10, B-11).
- Belum ada wizard instalasi bersih tanpa data demo (backlog B-40).
- Kepatuhan di setiap faskes (persetujuan pasien, pengamanan server, cadangan, akses) tetap menjadi tanggung jawab penyelenggara faskes. Lihat [Kebijakan Keamanan](/pendahuluan/keamanan).

## Langkah berikutnya

- [Instalasi](/memulai/instalasi): pasang OpenSIMRS di komputer Anda.
- [Data Demo](/memulai/data-demo): coba dengan 8 faskes fiktif dan akun per peran.
- [Roadmap](/pendahuluan/roadmap): arah pengembangan dan backlog.
- [Kanal Komunitas](/komunitas/): bergabung dan bertanya.
