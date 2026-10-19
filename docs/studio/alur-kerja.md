# Alur Kerja Item

Halaman ini merinci perjalanan satu item SIMRS Studio dari permintaan sampai rilis: apa yang dikerjakan agen di tiap tahap, siapa yang harus menyetujui, bagaimana risiko ditentukan, cek otomatis apa saja yang dijalankan, dan cara menerapkan hasilnya ke branch lokal atau ke Pull Request. Halaman ini untuk pengusul, product, programmer, QA, dan maintainer rilis yang bekerja di Studio.

## Tahap dan gerbang persetujuan

Setiap tahap baru berpindah setelah **semua gerbang** tahap itu menyetujui **dokumen terbaru**. Bila dokumen direvisi, persetujuan perlu diberikan ulang.

| Tahap | Yang dikerjakan AI | Gerbang persetujuan |
|---|---|---|
| **Permintaan** | Merangkum, mencari fitur serupa, bertanya, mengusulkan risiko | Product (triase: prioritas, jenis, modul, risiko) |
| **Use case** | Aktor, alur utama/alternatif/gagal, diagram | Pengusul |
| **PRD** | Kriteria terima *Diberikan… Ketika… Maka…*, dampak data, izin, katalog | Product, + Reviewer klinis bila risiko tinggi/kritis, + superadmin bila kritis |
| **Desain teknis** | Membaca kode, lalu menyusun rencana per berkas | Programmer, + superadmin bila kritis |
| **Coding** | Branch `feat/STD-…`, kode, migrasi, uji, fragmen CHANGELOG | Reviewer kode, + superadmin bila kritis. Syarat: pemeriksa kebijakan lulus |
| **QA** | Rencana uji dan checklist kasus uji | QA, + Reviewer klinis bila risiko tinggi/kritis. Syarat: cek otomatis lulus dan semua kasus uji lulus atau tidak berlaku |
| **Rilis** | Isi fragmen CHANGELOG, catatan rilis, pesan commit | Maintainer rilis. Syarat: sudah di-commit dan sudah diterapkan ke lokal (mode lokal) atau sudah dibuat PR (mode PR) |

### Setuju, revisi, atau tolak

- **Setuju** mengisi satu gerbang. Tahap berpindah saat semua gerbang terisi.
- **Minta revisi** mengirim alasan Anda ke agen. Pilih **Kembali ke tahap** untuk mundur ke tahap sebelumnya, misalnya dari Coding ke PRD. Tahap itu dan tahap sesudahnya perlu disetujui ulang. Kode di branch item tidak dihapus.
- **Tolak** membatalkan item. Branch dan berkas yang belum di-commit tidak dihapus. Superadmin bisa **Buka kembali** item ke tahap pilihan.
- Alasan wajib diisi untuk revisi dan tolak. Semua keputusan beserta alasan, peran, dan waktunya tampil di **Riwayat keputusan** dan tercatat di **Audit**.

Panel **Diskusi** di kanan menjadi instruksi bagi agen pada tahap aktif. **Sunting** menyimpan dokumen hasil suntingan Anda sebagai versi baru.

::: tip Pemisahan tugas
Opsi **pemisahan tugas** di Pengaturan (mati bawaan) mencegah satu orang menjadi satu-satunya penyetuju untuk item berisiko sedang ke atas: pengusul tidak boleh menyetujui tahap selain use case, penyunting dokumen tidak boleh menyetujui dokumennya sendiri, dan satu orang hanya mengisi satu gerbang per tahap. Nyalakan bila tim sudah punya peran terpisah.
:::

## Tingkat risiko

Risiko item bertingkat **rendah → sedang → tinggi → kritis**.

| Risiko | Akibat |
|---|---|
| **Rendah / sedang** | Gerbang standar |
| **Tinggi** | Reviewer klinis wajib menyetujui PRD dan QA |
| **Kritis** | Reviewer klinis dan superadmin ikut menyetujui. **Agen tidak menulis kode**: agen hanya menulis PRD dan desain, sedangkan kode dikerjakan programmer (lihat [Coding manual](#coding-manual-dan-pindai-perubahan)) |

Risiko **naik otomatis** dan tidak pernah turun otomatis:

- desain teknis yang merencanakan perubahan di **zona kuning** (layanan klinis/keuangan) menaikkan risiko menjadi *tinggi*;
- desain teknis yang menyentuh **zona merah** menaikkan risiko menjadi *kritis*;
- kode yang menyentuh zona kuning, baik buatan agen maupun hasil pindai manual, menaikkan risiko menjadi *tinggi*.

Product menetapkan risiko lewat aksi **TETAPKAN RISIKO**. Batas bawah risiko dari area yang tersentuh hanya bisa diturunkan superadmin (mis. deteksi positif palsu), dan tercatat di audit. Daftar zona ada di [Keamanan & Batasan](/studio/keamanan).

## Tahap Coding

### Awalan migrasi per item

Saat item masuk Coding, Studio **memesan satu blok jam UTC** `YYYYMMDDHH` untuk item itu. Blok tersebut lebih baru dari migrasi terakhir di branch dasar/lokal dan dari awalan yang dipesan item aktif lain. Migrasi baru item wajib bernama:

```
database/migrations/<awalan>MMSS-nama.cjs
```

Awalan tampil di panel Coding. Pemeriksa kebijakan menggagalkan migrasi yang memakai awalan milik item lain.

### Fragmen CHANGELOG

Agen menulis catatan perubahan di `changelog.d/STD-<nomor>.md`, **bukan** di `CHANGELOG.md`, dengan bagian `### Ditambahkan`, `### Diubah`, atau `### Diperbaiki`. Maintainer menggabungkan fragmen saat rilis dengan `node scripts/gabung-changelog.mjs`. Cara ini mencegah konflik antar-item yang dikerjakan paralel.

### Mode kerja

| Mode | Perilaku |
|---|---|
| **Workspace** (bawaan) | Agen bekerja di working tree repo. `npm run dev` langsung menjadi pratinjau. Hanya satu item yang bisa di-coding pada satu waktu |
| **Worktree** | Salinan repo terpisah per item (node_modules ditautkan). Working tree Anda tidak tersentuh dan item bisa dikerjakan paralel |

### Coding manual dan pindai perubahan

Untuk item berisiko kritis, atau bila programmer ingin menulis kode sendiri:

1. Klik **Siapkan branch**. Studio menyiapkan branch item dan memesan awalan migrasi tanpa menjalankan agen.
2. Kerjakan kode di VS Code. Tulis migrasi dengan awalan item dan catatan perubahan di `changelog.d/STD-<nomor>.md`.
3. Klik **Pindai perubahan manual**. Studio mencatat berkas yang berubah sejak branch disiapkan dan commit baru di branch item, lalu menjalankan pemeriksa kebijakan seperti biasa.

Pindai juga tersedia di tahap Rilis untuk commit manual yang dibuat belakangan.

## Cek otomatis

Cek otomatis dijalankan di tahap Coding atau QA (**JALANKAN UJI**) dan wajib lulus sebelum QA bisa dinyatakan lulus.

| Langkah | Kapan dijalankan | Wajib lulus |
|---|---|---|
| **Pemeriksa kebijakan** | Selalu | Ya |
| **Sintaks JS** (`node --check`) | Ada berkas `.js/.cjs/.mjs` backend yang berubah | Ya |
| **Uji layanan** (`npm --prefix <layanan> test`) | Layanan yang berubah punya skrip uji dan folder `test/` | Ya |
| **Integritas lintas berkas** (`node scripts/cek-integritas.mjs`) | Selalu | Ya |
| **Dokumen katalog** (`node scripts/dokumen-katalog.mjs --cek`) | `database/data/katalog-modul.json` berubah | Ya |
| **Build frontend** (`npm --prefix frontend-service run build-only`) | Ada berkas frontend berubah dan opsi build frontend aktif (bawaan) | Ya |

Pemeriksa kebijakan memeriksa:

- **zona merah** dan **zona kuning** (lihat [Keamanan & Batasan](/studio/keamanan));
- **rahasia & kunci** dan **data pribadi** pada baris yang ditambahkan;
- **migrasi**: migrasi lama tidak boleh diubah, nama `YYYYMMDDHHMMSS-nama.cjs`, tidak memakai awalan item lain, dan idempoten (`IF NOT EXISTS`);
- **katalog modul**: perubahan katalog wajib disertai dokumen katalog (`npm run docs:katalog`);
- **kriptografi**: kode enkripsi/dekripsi baru hanya lolos bila berupa salinan baku helper rahasia yang sudah teruji;
- **import melingkar**: berkas frontend tidak boleh mengimpor `@/main`;
- **CHANGELOG**: ada fragmen di `changelog.d/`.

Dua temuan hanya berupa **peringatan** dan tidak menggagalkan: logika backend tanpa berkas uji, dan migrasi yang tidak lagi paling akhir (diperbaiki otomatis saat Terapkan).

## Tahap Rilis

Mode rilis diatur di **Pengaturan & Agen › Rilis**.

| Mode | Untuk siapa | Yang terjadi |
|---|---|---|
| **Lokal saja** (bawaan) | IT RS yang mengustomisasi instalasinya sendiri | **Commit → Terapkan ke lokal** menggabungkan branch item ke **branch lokal**, lalu menjalankan `db:migrate` bila ada migrasi baru |
| **Pull Request** | Kontributor upstream | **Push & buat PR** ke GitHub/Gitea, lalu **Perbarui status** memantau PR, CI, merge, dan tag rilis |
| **Keduanya** | RS yang juga menyumbang ke upstream | Terapkan ke lokal, lalu push & PR |

### Terapkan ke branch lokal

- Isi **branch lokal** secara eksplisit, misalnya `rs-lokal`. Bila kosong, Studio memakai branch yang sedang aktif di repo.
- **Aplikasi harus berjalan dari branch lokal.** Bila repo utama masih di branch lain, Studio menampilkan peringatan dan tombol **Pindahkan aplikasi ke `<branch lokal>`**.
- Item berikutnya bercabang dari branch lokal, sehingga kustomisasi saling menumpuk.
- Bila item mengubah `package.json` suatu layanan, Studio menjalankan `npm install` di layanan itu. Bila item mengubah SDK lokal (`packages/*`), Studio menjalankan `npm run sdk:refresh`.
- **Batalkan penerapan** membalik penerapan dengan `git revert`, termasuk modul/fitur dan izin yang dinyalakan Studio.

**Pengurutan migrasi otomatis.** Bila migrasi item tidak lagi paling akhir terhadap branch tujuan (misalnya item lain diterapkan lebih dulu), Studio mengganti nama migrasi item ke awalan baru dengan urutan relatif yang sama, memperbarui rujukan nama lama, lalu membuat commit `chore(studio): urutkan migrasi …`. Migrasi yang sudah tercatat di `SequelizeMeta` tidak diganti namanya, dan Terapkan ditolak dengan penjelasan.

**Aktivasi otomatis.** Bila opsi **Nyalakan modul/fitur baru setelah diterapkan** dicentang (bawaan) dan `LINGKUNGAN=development`, Studio menyalakan modul/fitur yang baru tersedia di katalog untuk faskes Anda (atau semua faskes sesuai pengaturan), memberi izin modul baru ke peran admin faskes dan super admin, lalu memuat ulang menu Anda tanpa login ulang. Di staging, klik **Aktifkan di aplikasi** di tahap Rilis.

### Sinkronisasi dengan branch lokal

Tombol **Sinkronkan dengan `<branch lokal>`** di panel Coding/Rilis (izin Rilis › SIAPKAN atau Coding › BUKA PR) menggabungkan branch lokal (atau branch dasar di mode PR) ke branch item. Konflik pada berkas berikut diselesaikan otomatis:

- `database/data/katalog-modul.json`: digabung per entri modul/fitur/bagian dan preset. Bila kedua sisi mengubah nilai yang sama secara berbeda, Studio tidak menebak;
- `docs/MANAJEMEN-MODUL.md`: dibuat ulang dari katalog;
- `CHANGELOG.md`: entri kedua sisi dipertahankan;
- daftar sisipan seperti daftar izin, menu header, router frontend, dan rute penunjang.

Setelah itu Studio menjalankan cek integritas dan membuat commit merge. Bila ada konflik lain atau cek integritas gagal, penggabungan dibatalkan dan branch item tidak berubah. **Terapkan** menjalankan sinkronisasi ini otomatis bila pra-cek menemukan konflik. Sinkronisasi butuh working tree item yang bersih, jadi commit dulu perubahan item.

### Membawa ke server RS

Bila server aplikasi RS berbeda dari mesin Studio, gunakan **SIMRS Studio › Server & Deploy** (superadmin atau hak **Rilis › DEPLOY**). Studio mengirim branch lokal lewat SSH dengan kunci khusus, lalu server memperbarui folder aplikasinya (hanya *fast-forward*) dan menjalankan perintah deploy. Pengiriman dihentikan bila folder aplikasi di server punya perubahan yang disunting langsung, dan untuk server produksi nama server harus diketik sebagai konfirmasi. Untuk server tanpa jaringan, unduh paket rilis `.bundle` dan pasang manual.

## Lihat juga

- [Pengantar SIMRS Studio](/studio/)
- [Agen & Konektor](/studio/agen-konektor)
- [Keamanan & Batasan](/studio/keamanan)
- [Basis Data & Migrasi](/arsitektur/basis-data-migrasi)
- [Panduan Kontribusi](/pendahuluan/kontribusi)
