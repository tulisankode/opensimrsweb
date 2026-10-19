# Kanal Komunitas

Komunitas OpenSIMRS berkumpul di tiga kanal diskusi resmi, sedangkan pekerjaan teknis dilacak di GitHub. Halaman ini memuat daftar kanal resmi, aturan main forum, cara moderasi, dan cara mulai berkontribusi.

## Kanal resmi

Kanal komunitas resmi **hanya tiga**. Kanal lain yang mengatasnamakan OpenSIMRS bukan kanal resmi.

| Kanal | Tujuan | Tautan |
|---|---|---|
| **Grup Telegram** | Pengumuman dan diskusi umum | [Gabung grup Telegram](https://t.me/+uW2ZQA1V7Dc3OTVl) |
| **Server Discord** | Diskusi teknis per kanal: `#pengembangan`, `#implementasi`, `#qa`, `#produk`, `#bantuan-instalasi` | [Gabung server Discord](https://discord.gg/qAWhdzGJTW) |
| **Grup WhatsApp** | Koordinasi cepat implementator/faskes dan pengumuman penting | [Gabung grup WhatsApp](https://chat.whatsapp.com/EULeLrLPMcC6vNKV4AxHQj?mode=gi_t) |

Selain ketiga kanal di atas:

| Saluran | Dipakai untuk |
|---|---|
| **GitHub Issues & Pull Request** di [github.com/tulisankode/opensimrs](https://github.com/tulisankode/opensimrs) | Pelacakan pekerjaan teknis: bug, backlog, RFC, review kode. **Bukan** forum diskusi. |
| **Email [dev@opensimrs.id](mailto:dev@opensimrs.id)** | Pertanyaan umum, laporan keamanan, dan laporan pelanggaran kode etik |
| **Website [OpenSIMRS.my.id](https://opensimrs.my.id)** | Website resmi proyek |

::: tip Mau bertanya soal instalasi?
Gunakan kanal `#bantuan-instalasi` di Discord. Bila masalahnya ternyata bug, buat issue di GitHub agar jawabannya terdokumentasi dan bisa dicari orang lain.
:::

## Aturan main forum

Aturan ini berlaku di ketiga kanal, sebagai pelengkap [Kode Etik](/komunitas/kode-etik).

1. **Sopan dan berbahasa Indonesia** yang baik. Istilah teknis dalam bahasa Inggris boleh dipakai seperlunya.
2. **Dilarang membagikan**:
   - data pasien atau rekam medis dalam bentuk apa pun;
   - tangkapan layar yang memuat identitas pasien (nama, NIK, No. RM, nomor BPJS, alamat, foto);
   - kredensial (kata sandi, token, API key, *client secret*) dan isi berkas `.env`;
   - alamat IP atau host server faskes.

   Gunakan [data demo](/memulai/data-demo) (`npm run db:demo:seed`) untuk contoh dan tangkapan layar. Bila terlanjur terkirim, segera hapus pesannya dan rotasi kredensial yang bocor.
3. **Celah keamanan dilaporkan secara privat** ke `dev@opensimrs.id` sesuai [Kebijakan Keamanan](/pendahuluan/keamanan), **bukan** di grup.
4. **Pertanyaan teknis yang berulang** atau laporan bug diarahkan ke **GitHub Issue**. Moderator dapat meminta penanya membuat issue dan menautkannya di kanal.
5. **Tanpa spam dan promosi.** Promosi produk/jasa, lowongan, atau tautan berbayar hanya dengan izin moderator.
6. **Tetap pada topik kanal.** Di Discord, pilih kanal yang sesuai; di WhatsApp, utamakan koordinasi dan pengumuman, bukan diskusi panjang.
7. **Hormati waktu relawan.** Maintainer dan anggota menjawab secara sukarela.

## Moderasi dan sanksi

Pelanggaran ditangani bertahap:

| Tahap | Tindakan |
|---|---|
| 1 | **Peringatan**: pesan dihapus bila perlu, pengirim diingatkan |
| 2 | **Mute** atau pembatasan sementara |
| 3 | **Dikeluarkan** dari kanal |

Pelanggaran berat (menyebarkan data pasien, pelecehan, penipuan) dapat langsung dikenai tahap 3 dan dilaporkan ke maintainer. Keberatan atas tindakan moderasi dikirim ke `dev@opensimrs.id`.

### Peran admin dan moderator

| Peran | Tugas |
|---|---|
| **Admin kanal** | Mengelola pengaturan grup/server, tautan undangan, dan menunjuk moderator. Dipegang Core Maintainer. |
| **Moderator** | Menegakkan aturan forum, menyambut anggota baru, mengarahkan pertanyaan ke kanal/issue yang tepat, dan menghapus konten yang melanggar. Ditunjuk dari Contributor aktif. |

Admin dan moderator tetap tunduk pada aturan yang sama dan wajib menjaga kerahasiaan laporan yang mereka terima.

## Cara bergabung dan mulai berkontribusi

1. Bergabung ke salah satu kanal resmi dan **perkenalkan diri**: bidang yang diminati dan latar belakang singkat.
2. Kenali bidang kontribusi Anda (implementator, developer, tester/QA, product development) di [Panduan Kontribusi](/pendahuluan/kontribusi#siapa-saja-bisa-berkontribusi).
3. Pasang dan coba OpenSIMRS dengan [Instalasi](/memulai/instalasi) dan [Data Demo](/memulai/data-demo).
4. Pilih pekerjaan pertama di [Roadmap](/pendahuluan/roadmap) atau issue berlabel `good first issue`, `butuh tenaga medis/klinis`, atau `dokumentasi`.

### Rekognisi

- Kontributor yang kontribusinya diterima dicantumkan di catatan rilis dan daftar kontributor repositori, termasuk kontribusi non-kode (laporan implementasi, validasi klinis, skenario uji).
- Reviewer dan Maintainer per bidang diumumkan di kanal komunitas.
- Untuk kerja praktik, tugas kuliah, atau skripsi, maintainer dapat membantu memilih lingkup dan memberi umpan balik; sebutkan di issue yang Anda klaim.

## Langkah berikutnya

- [Tata Kelola](/komunitas/tata-kelola): peran dan cara pengambilan keputusan.
- [Kode Etik](/komunitas/kode-etik): perilaku yang diharapkan di semua ruang komunitas.
- [Panduan Kontribusi](/pendahuluan/kontribusi): alur fork, branch, dan Pull Request.
