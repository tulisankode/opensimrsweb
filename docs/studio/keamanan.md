# Keamanan & Batasan

SIMRS Studio memberi agen AI akses menulis kode ke repo OpenSIMRS. Halaman ini menjelaskan pagar pengaman yang membatasi akses itu: di mana Studio boleh dijalankan, berkas apa yang tidak boleh disentuh agen, area mana yang otomatis dianggap berisiko tinggi, dan pemeriksaan rahasia serta data pribadi. Halaman ini untuk superadmin, programmer, dan reviewer yang bertanggung jawab atas mutu perubahan.

## Hanya di mesin pengembang

- Studio dijalankan di **mesin pengembang atau staging**, bukan di server produksi.
- Studio hanya melayani bila `studio-service/.env` berisi `STUDIO_PENGEMBANG=aktif` dan superadmin menyalakan **Mode Pengembang** di **Setting › System**.
- Bila `LINGKUNGAN=production`, coding, cek otomatis, coding manual, dan rilis ditolak dengan pesan "Coding, QA, dan rilis tidak dijalankan di instalasi produksi".
- Hasil kerja dibawa ke produksi lewat git (branch lokal, Pull Request, atau Server & Deploy). Ekstensi tanpa kode dibawa sebagai paket bertanda tangan.
- **Hentikan Studio** (*kill switch*) membatalkan semua tugas agen dan membuat semua item hanya-baca.

## Batas kemampuan agen

- Agen **tidak menyambung ke database**, kecuali membaca struktur skema tanpa data.
- Agen **tidak membaca `.env`**.
- Agen tidak bisa commit, push, berpindah branch, atau menjalankan `npm install`. Commit, penerapan, dan pemasangan dependensi dilakukan Studio setelah gerbang persetujuan.
- Tahap dokumen berjalan hanya-baca. Tahap coding hanya boleh menyunting berkas dan menjalankan perintah uji yang diizinkan.
- Aturan platform yang ditanam di prompt tidak dapat dilonggarkan oleh aturan instalasi, template tahap, atau teks dari pengguna, lampiran, maupun isi berkas.
- Studio hanya men-commit **berkas yang diubah untuk item itu**. Semua tindakan tercatat di **Audit & Metrik**.

## Zona merah

Berkas zona merah **tidak boleh diubah agen**. Pemeriksa kebijakan menggagalkan perubahan pada:

| Pola | Alasan |
|---|---|
| `.env`, `.env.*` di folder mana pun | Berkas rahasia |
| `packages/authorization-sdk/`, `packages/permission-sdk/` | SDK autentikasi dan izin |
| `rahasia.js` di folder mana pun | Enkripsi rahasia |
| `.github/` | CI dan workflow |
| `deploy/` | Deploy server |
| `studio-service/` | SIMRS Studio sendiri |
| `CLAUDE.md`, `CLAUDE.local.md` | Aturan agen |

Migrasi yang sudah ada juga tidak boleh diubah; migrasi lama yang berubah menggagalkan pemeriksaan **Migrasi**.

Item berisiko **kritis** dikerjakan programmer, bukan agen. Untuk item kritis, perubahan zona merah dicatat sebagai pekerjaan manusia dan boleh lolos, **kecuali `.env`**, yang tetap ditolak. Desain teknis yang menyentuh zona merah otomatis menaikkan risiko item menjadi kritis.

## Zona kuning

Zona kuning adalah layanan dengan alur klinis atau keuangan:

`rekamedis-service/`, `farmasi-service/`, `stok-farmasi-service/`, `payment-service/`, `bpjs-service/`, `satusehat-service/`, `lab-service/`, `auth-service/`

Perubahan di zona kuning **wajib berisiko tinggi atau kritis**:

- desain teknis atau kode yang menyentuh zona kuning menaikkan risiko item menjadi **tinggi** secara otomatis;
- pemeriksa kebijakan gagal bila zona kuning disentuh tetapi risiko item masih rendah/sedang;
- risiko tinggi berarti **Reviewer klinis wajib menyetujui** PRD dan QA.

Superadmin dapat menambah aturan area sendiri di **SIMRS Studio › Aturan & Pengetahuan**, misalnya "perubahan perhitungan dosis di `farmasi-service/` = risiko kritis".

## Pemeriksa rahasia

Baris kode yang ditambahkan agen diperiksa terhadap pola berikut. Satu temuan menggagalkan pemeriksaan **Rahasia & kunci**:

- *private key* (`-----BEGIN … PRIVATE KEY-----`);
- kunci API berawalan `sk-`, token GitHub `ghp_`, kunci AWS `AKIA…`;
- sandi, secret, API key, atau token yang ditanam sebagai string panjang;
- **IP privat** (`10.x`, `172.16–31.x`, `192.168.x`), yang biasanya menandakan alamat server faskes.

### Kriptografi

Kode enkripsi/dekripsi baru (`createCipheriv`/`createDecipheriv`) hanya lolos bila berupa **salinan baku** helper rahasia yang sudah teruji (`lab-service/src/lis/rahasia.js` atau `setting-service/src/bantuan/rahasia.js`). Selain itu, tetapkan risiko kritis agar dikerjakan dan ditinjau programmer.

## Pemeriksa data pribadi

Teks bebas (permintaan, diskusi, lampiran teks) dan baris kode yang ditambahkan dipindai untuk data pribadi. Hanya data fiktif yang lolos:

| Jenis | Ditandai bila | Lolos bila |
|---|---|---|
| NIK | 16 digit angka | Berawalan `9999` |
| Nomor HP | Format `08…`, `628…`, `+628…` | `080000000000` |
| Email | Alamat email apa pun | Domain `contoh.id`, `example.com`/`example.org`, domain proyek OpenSIMRS, atau alamat *noreply* GitHub |

Lampiran berupa gambar dan PDF harus disamarkan sebelum diunggah. **Jangan pernah menuliskan data pasien asli** di permintaan, diskusi, atau lampiran.

## Kebiasaan aman

- Pakai mode kerja **worktree** bila working tree Anda berisi pekerjaan lain.
- Periksa diff dan hasil pemeriksa kebijakan sebelum menyetujui tahap Coding.
- Nyalakan **pemisahan tugas** begitu tim punya peran terpisah.
- Simpan kunci API konektor hanya di Studio (tersimpan terenkripsi); jangan menaruhnya di repo atau tangkapan layar.
- Untuk ekstensi di produksi, pasang hanya paket yang ditandatangani kunci Studio Anda.

## Lihat juga

- [Pengantar SIMRS Studio](/studio/)
- [Alur Kerja Item](/studio/alur-kerja)
- [Kebijakan Keamanan](/pendahuluan/keamanan)
- [Autentikasi & Hak Akses](/arsitektur/autentikasi-izin)
