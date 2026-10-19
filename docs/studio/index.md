# SIMRS Studio

**SIMRS Studio** adalah ruang kerja pengembangan berbasis AI di dalam OpenSIMRS. Tim IT rumah sakit menuliskan kebutuhan dengan bahasa sehari-hari, lalu agen AI mengerjakannya tahap demi tahap, dari ringkasan permintaan sampai kode dan catatan rilis. Halaman ini menjelaskan apa itu SIMRS Studio, untuk siapa, kapan aktif, dan gambaran alurnya.

::: warning Hanya untuk mesin pengembang atau staging
SIMRS Studio dijalankan di mesin pengembang atau server staging, **bukan** di server produksi. Di instalasi dengan `LINGKUNGAN=production`, coding, QA, dan rilis ditolak. Hasilnya dibawa ke produksi lewat branch git atau fitur Server & Deploy.
:::

## Untuk siapa

| Pengguna | Kebutuhan |
|---|---|
| **IT rumah sakit** | Mengustomisasi OpenSIMRS untuk instalasinya sendiri tanpa akun GitHub, push, atau Pull Request (mode rilis *lokal*) |
| **Kontributor upstream** | Menyumbangkan perubahan ke repo OpenSIMRS lewat Pull Request (mode rilis *PR*) |
| **Keduanya** | RS yang memakai kustomisasinya sendiri sekaligus menyumbangkannya ke upstream |

Kebutuhan sederhana seperti laporan, template cetak, atau formulir tambahan bisa dibuat sebagai **ekstensi tanpa kode**, tanpa melewati seluruh tahap.

## Kapan Studio aktif

Studio berjalan sebagai `studio-service` (port `8090`, awalan `/api/v3/studio`). Ada tiga lapis pengaman sebelum Studio bisa dipakai:

1. **Lapis instalasi**: `studio-service/.env` berisi `STUDIO_PENGEMBANG=aktif` (dan `LINGKUNGAN=development` di mesin pengembang). Tanpa ini, layanan tidak melayani permintaan.
2. **Mode Pengembang**: superadmin membuka **Setting › System → Mode Pengembang → Aktifkan**.
3. **Fitur Studio**: di **SIMRS Studio › Pengaturan & Agen**, fitur **Coding** dan **Ekstensi** mati bawaan dan harus dinyalakan sadar oleh superadmin. Fitur desain, QA, dan rilis aktif bawaan.

Superadmin juga bisa menekan **Hentikan Studio** (*kill switch*) di Pengaturan. Semua tugas agen dibatalkan dan semua item menjadi hanya-baca.

### Prasyarat

- OpenSIMRS sudah terpasang dan berjalan dengan `npm run dev` (lihat [Instalasi](/memulai/instalasi)).
- Node.js 22 LTS (minimal 20) dan Git 2.30 ke atas. Di Windows, gunakan Git for Windows.
- RAM minimal 16 GB dan ruang disk kosong minimal 10 GB.
- Minimal satu agen: Claude Code CLI dengan langganan pribadi, Codex CLI, atau konektor API. Lihat [Agen & Konektor](/studio/agen-konektor).
- Untuk mode rilis lokal: branch rilis lokal, misalnya `rs-lokal`, yang diisi namanya di Pengaturan Studio.

## Peran

Hak di Studio diatur per peran lewat **Datamaster › Role**, modul izin **SIMRS Studio**. Modul ini **tidak pernah** diberikan otomatis ke admin faskes.

| Peran | Hak (submodul › aksi) |
|---|---|
| Pengusul | Permintaan › CREATE, UPDATE, SETUJUI USECASE |
| Product | Permintaan › TRIASE, BATAL; PRD › UPDATE, SETUJUI, TETAPKAN RISIKO |
| Reviewer klinis | Review Klinis › SETUJUI (wajib untuk risiko tinggi/kritis) |
| Programmer | Desain › SETUJUI; Coding › JALANKAN AGEN, REVIEW, BUKA PR |
| QA | QA › UPDATE, JALANKAN UJI, LULUS |
| Maintainer rilis | Rilis › SIAPKAN |

Item berisiko *kritis* juga butuh persetujuan superadmin.

## Gambaran tahap

Setiap kebutuhan menjadi satu **item** bernomor `STD-xxxx` yang melewati tujuh tahap. Setiap tahap baru berlanjut setelah pemegang peran yang berwenang menyetujui dokumen terbarunya.

```
Permintaan → Use case → PRD → Desain teknis → Coding → QA → Rilis
```

| Tahap | Hasil kerja AI |
|---|---|
| **Permintaan** | Ringkasan, fitur serupa yang sudah ada, pertanyaan klarifikasi, usulan risiko |
| **Use case** | Aktor, alur utama/alternatif/gagal, diagram |
| **PRD** | Kriteria terima *Diberikan… Ketika… Maka…*, dampak data, izin, katalog modul |
| **Desain teknis** | Rencana perubahan per berkas setelah membaca kode |
| **Coding** | Branch `feat/STD-…`, kode, migrasi, uji, fragmen CHANGELOG |
| **QA** | Rencana uji dan checklist kasus uji, ditambah cek otomatis |
| **Rilis** | Isi fragmen CHANGELOG, catatan rilis, pesan commit, lalu penerapan |

Rincian gerbang persetujuan, tingkat risiko, dan cek otomatis ada di [Alur Kerja Item](/studio/alur-kerja).

## Ekstensi tanpa kode

Di **SIMRS Studio › Ekstensi** (fitur Ekstensi harus aktif) tersedia tiga jenis ekstensi:

- **Laporan**: kueri SELECT berparameter, ditampilkan sebagai tabel dengan ekspor Excel dan cetak PDF;
- **Template cetak**: kueri ditambah tata letak dokumen dengan kop faskes;
- **Formulir tambahan**: isian per pasien atau kunjungan, dengan hak akses mengikuti modul yang ditentukan.

Kueri ekstensi hanya boleh SELECT/WITH, wajib memakai `:faskes_uuid` (faskes selalu diambil dari token), tidak boleh menyentuh tabel akun/sesi atau kolom rahasia, dan berjalan dalam transaksi hanya-baca dengan batas waktu 15 detik.

Ekstensi dibawa ke produksi sebagai paket `.json` bertanda tangan Ed25519. Kunci publik Studio dipasang di `laporan-service` produksi sebagai `EKSTENSI_KUNCI_PUBLIK`, lalu paket diimpor lewat **Setting › Ekstensi**. Paket yang diubah atau ditandatangani kunci lain ditolak.

## Lihat juga

- [Alur Kerja Item](/studio/alur-kerja)
- [Agen & Konektor](/studio/agen-konektor)
- [Keamanan & Batasan](/studio/keamanan)
- [Manajemen Modul & Fitur](/arsitektur/manajemen-modul)
