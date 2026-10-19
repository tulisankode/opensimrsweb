# Panduan Penulisan Dokumentasi OpenSIMRS

Dokumentasi di `docs/` dibangun dengan [VitePress](https://vitepress.dev) dan terbit di **https://docs.opensimrs.id**. Gaya penulisannya mengikuti dokumentasi proyek open source yang matang (Laravel, Express, Vue): ringkas, berurutan dari konsep ke praktik, dan selalu memberi contoh yang bisa langsung dicoba.

## Bahasa & istilah
- Bahasa Indonesia yang baik dan benar, kalimat aktif, sapa pembaca dengan "Anda".
- Istilah domain dalam bahasa Indonesia: *pasien, kunjungan, penjamin, tagihan, faskes, rekam medis, rawat jalan, rawat inap*.
- Istilah teknis yang lazim tetap dalam bahasa aslinya dan dicetak `kode` bila berupa nama berkas, perintah, variabel, atau endpoint: `npm run dev`, `SECRET_KEY`, `/api/v3/auth/login`.
- Nama produk selalu **OpenSIMRS**. Fitur pengembang berbasis AI disebut **SIMRS Studio**.

## Struktur halaman
1. Judul `# …` satu kali di awal, lalu satu paragraf pengantar: halaman ini untuk siapa dan apa hasilnya.
2. Bagian `##` dan sub-bagian `###` (masuk daftar isi kanan). Jangan lompat tingkat.
3. Akhiri dengan bagian **Langkah berikutnya** atau **Lihat juga** berisi tautan internal yang relevan.
4. Panjang wajar: satu halaman satu topik. Bila lebih dari ±400 baris, pecah menjadi beberapa halaman.

## Komponen VitePress yang dipakai
- Kotak info: `::: tip`, `::: info`, `::: warning`, `::: danger`, `::: details Judul`.
- Tab kode untuk varian OS/perintah:
  ```md
  ::: code-group
  ```bash [macOS / Linux]
  ./install.sh
  ```
  ```powershell [Windows]
  .\install.cmd
  ```
  :::
  ```
- Tabel untuk daftar port, variabel, endpoint, izin.
- Tautan internal tanpa ekstensi: `[Instalasi](/memulai/instalasi)`.

## Sumber kebenaran
Isi diambil dari repo [tulisankode/opensimrs](https://github.com/tulisankode/opensimrs) (dokumen di `docs/`, `README.md`, `CONTRIBUTING.md`, `COMMUNITY.md`, `SECURITY.md`, `GOVERNANCE.md`, `CHANGELOG.md`, `database/data/katalog-modul.json`, dan kodenya). **Jangan mengarang fitur, endpoint, opsi, atau angka.** Bila sebuah fitur berstatus belum tersedia/dalam pengembangan, tulis demikian. Bila tidak yakin, periksa kodenya; bila tetap tidak pasti, lebih baik tidak ditulis.

## Larangan (repo & situs ini publik)
- Tidak boleh ada kredensial, kunci, token, sandi selain akun demo resmi (`superadmin` / `Demo@2026`).
- Tidak boleh ada IP/host server faskes atau server internal, maupun domain pribadi pengembang.
- Tidak boleh ada data atau screenshot pasien asli. Contoh data harus jelas fiktif: email `@contoh.id`, HP `080000000000`, NIK berawalan `9999`, domain contoh `simrs.contoh.id`.
