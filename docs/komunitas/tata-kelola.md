# Tata Kelola

Halaman ini menjelaskan peran di proyek OpenSIMRS, jenjang kontributor, cara pengambilan keputusan, proses RFC untuk perubahan besar, serta nilai-nilai yang dipegang komunitas. Sumbernya adalah `GOVERNANCE.md`, `COMMUNITY_MANIFESTO.md`, dan panduan peran kontributor di repo.

## Filosofi

- **Transparan:** keputusan penting dibahas dan diumumkan secara terbuka.
- **Terbuka:** siapa pun boleh berkontribusi.
- **Berorientasi jangka panjang.**
- **Melindungi kepentingan** pasien, fasilitas kesehatan, dan komunitas.

## Peran

Semua orang yang berkontribusi adalah **Contributor**, apa pun bidangnya (implementator, developer, tester/QA, product development).

| Peran | Tanggung jawab | Ditetapkan oleh |
|---|---|---|
| **Contributor** | Menyumbang kode, dokumentasi, pengujian, laporan lapangan, atau masukan klinis; mengikuti [Panduan Kontribusi](/pendahuluan/kontribusi) dan [Kode Etik](/komunitas/kode-etik) | – |
| **Reviewer** (per bidang) | Meninjau PR, laporan bug, atau usulan fitur di bidangnya (mis. farmasi, laboratorium, QA, implementasi) | Maintainer bidang terkait |
| **Maintainer** (per bidang/modul) | Menjaga kualitas modul/bidang tertentu, menggabungkan PR, memelihara dokumentasi bidangnya | Core Maintainer |
| **Core Maintainer** | Arsitektur inti, roadmap teknis, rilis, keamanan & kepatuhan, penetapan maintainer | Kesepakatan Core Maintainer |
| **Moderator kanal** | Menjaga ketertiban grup Telegram, Discord, dan WhatsApp sesuai [aturan forum](/komunitas/#aturan-main-forum) | Core Maintainer |

Pengguna (rumah sakit, klinik, puskesmas, akademisi, implementator) adalah bagian komunitas meskipun belum berkontribusi kode.

### Jenjang kontributor

| Jenjang | Ciri | Cara mencapai |
|---|---|---|
| **Contributor** | Pernah menyumbang: PR, laporan bug yang lengkap, skenario uji, masukan klinis di issue, dokumentasi, atau laporan implementasi | Kontribusi pertama diterima |
| **Reviewer** (per bidang) | Dipercaya meninjau kontribusi orang lain di bidangnya | Kontribusi konsisten dan berkualitas di bidang itu; diusulkan maintainer bidang |
| **Maintainer** (per bidang/modul) | Menggabungkan PR, menjaga kualitas dan dokumentasi bidang/modul, membimbing kontributor baru | Aktif sebagai reviewer; ditetapkan Core Maintainer |

Jenjang bersifat **per bidang**: seseorang bisa menjadi Maintainer modul laboratorium sekaligus Contributor di bidang QA. Satu orang juga boleh aktif di lebih dari satu bidang.

## Pengambilan keputusan

| Jenis keputusan | Mekanisme |
|---|---|
| Perbaikan bug | PR + persetujuan satu maintainer |
| Fitur kecil | PR + review |
| Perubahan besar (struktur data, kontrak API, alur klinis) | RFC + diskusi terbuka |
| Arsitektur inti dan rilis | Core Maintainer |

Jumlah persetujuan PR per jenis perubahan (mis. 2 persetujuan untuk migrasi, SDK, dan integrasi) dirinci di [Panduan Kontribusi › Review dan merge](/pendahuluan/kontribusi#review-dan-merge).

## RFC (Request for Comments)

Untuk perubahan besar:

1. Buat issue GitHub berlabel `RFC`.
2. Jelaskan tujuan, alternatif, dan dampaknya, termasuk ke data lama dan alur klinis.
3. Diskusikan minimal **7 hari**. Kanal komunitas boleh dipakai untuk mengundang masukan, tetapi keputusan dan ringkasannya dicatat di issue.
4. Keputusan diumumkan terbuka dan, bila menyangkut desain, dicatat di bagian keputusan desain [Roadmap](/pendahuluan/roadmap#keputusan-desain-yang-sudah-diambil).

::: tip Kapan perlu RFC?
Bila perubahan Anda menyentuh struktur data, kontrak API antar-layanan, alur klinis, atau arsitektur inti, mulailah dengan RFC sebelum menulis kode. Ini mencegah PR besar ditolak setelah dikerjakan lama.
:::

## Lisensi dan pemakaian komersial

OpenSIMRS dirilis di bawah **Lisensi MIT**. Siapa pun, termasuk mitra implementator komersial, boleh memakai, memasang, dan menawarkan jasa di atas OpenSIMRS sesuai lisensi. Perbaikan dan fitur yang berguna bagi faskes lain sangat dianjurkan untuk dikontribusikan kembali ke repositori.

## Manifesto komunitas

Kami percaya sistem informasi kesehatan Indonesia harus **terbuka, terjangkau, aman, berkelanjutan, dan dibangun bersama**.

**Visi:** menjadikan OpenSIMRS fondasi digital yang dapat dipakai faskes di seluruh Indonesia, dari praktik dokter mandiri sampai rumah sakit kelas A.

**Misi komunitas:**

- Membantu klinik, puskesmas, dan rumah sakit bertransformasi digital.
- Memberdayakan developer, mahasiswa, dan tenaga IT kesehatan.
- Mendorong inovasi yang berkelanjutan.
- Menempatkan keselamatan dan privasi pasien sebagai pusat teknologi.

**Prinsip dasar:**

- Komunitas lebih dulu.
- Keselamatan pasien di atas segalanya.
- Interoperabilitas dan kepatuhan (SATUSEHAT, BPJS Kesehatan, pelindungan data pribadi).
- Inovasi yang berkelanjutan.

**Siapa yang dirangkul:** implementator (IT rumah sakit/faskes dan mahasiswa yang memasang OpenSIMRS di faskes), developer dan akademisi, tester/QA, product development (analis kebutuhan, tenaga medis/klinis, desainer UX), serta pemerhati kesehatan dan pelaku healthtech.

> Kami tidak sekadar membangun produk. Kami membangun **ekosistem**.

## Kontak

| Keperluan | Saluran |
|---|---|
| Umum, keamanan, dan kode etik | [dev@opensimrs.id](mailto:dev@opensimrs.id) |
| Diskusi komunitas | [Kanal Komunitas](/komunitas/) (Telegram, Discord, WhatsApp) |
| Pelacakan pekerjaan teknis | GitHub Issues & Pull Request di [tulisankode/opensimrs](https://github.com/tulisankode/opensimrs) |
| Website resmi | [OpenSIMRS.my.id](https://opensimrs.my.id) |

## Langkah berikutnya

- [Kode Etik](/komunitas/kode-etik)
- [Panduan Kontribusi](/pendahuluan/kontribusi)
- [Roadmap](/pendahuluan/roadmap)
