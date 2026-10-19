# Roadmap

Halaman ini merangkum arah pengembangan OpenSIMRS: urutan segmen yang dikerjakan, fase dan perkiraan timeline, backlog utama, serta cara ikut mengerjakannya. Sumbernya adalah [docs/ROADMAP.md](https://github.com/tulisankode/opensimrs/blob/main/docs/ROADMAP.md) di repo, yang terakhir diperbarui pada **15 Oktober 2026** (rilis `1.0.0-alpha.1`).

::: info Roadmap terus bergerak
Sejumlah modul yang di roadmap masih tercatat "Segera" sudah masuk `main` setelah 15 Oktober 2026, mis. Program Puskesmas, Kamar Operasi, ICU, Gizi, CSSD, dan Bank Darah RS. Periksa [Catatan Rilis](/pendahuluan/catatan-rilis#belum-dirilis) dan katalog di **Setting › Manajemen Modul** untuk status terbaru.
:::

## Arah produk

OpenSIMRS adalah SIMRS yang **tumbuh bersama faskes**: satu basis kode untuk dokter praktik mandiri sampai rumah sakit kelas A. Kuncinya adalah Manajemen Modul bertingkat:

```
Segmen faskes ──preset──▶ Modul ──▶ Fitur ──▶ Bagian (unit terkecil, mis. satu form asesmen)
                    ▲
          override per faskes (hanya superadmin)
```

- Segmen menentukan modul, fitur, dan bagian yang **aktif bawaan**, sehingga faskes kecil tidak dibebani menu rumah sakit.
- Satu alur data dipakai semua segmen; yang berbeda hanya tampilan dan langkah yang diaktifkan.
- Integrasi nasional (SATUSEHAT, BPJS) dan sistem pendukung (LIS) menjadi bagian inti, bukan tambahan.

### Urutan prioritas segmen

Pengembangan dimulai dari segmen paling sederhana. Sebuah segmen harus benar-benar siap pakai sebelum fokus utama pindah ke segmen berikutnya. Pekerjaan untuk segmen lain tetap boleh berjalan paralel bila ada kontributornya.

| Urutan | Segmen | Kode katalog |
|---|---|---|
| 1 | Dokter praktik mandiri | `praktik_mandiri` |
| 2 | Klinik pratama | `klinik_pratama` |
| 3 | Klinik utama | `klinik_utama` |
| 4 | Puskesmas | `puskesmas` |
| 5 | RS kelas D | `rs_d` |
| 6 | RS kelas C | `rs_c` |
| 7 | RS kelas B | `rs_b` |
| 8 | RS kelas A | `rs_a` |

## Status per Oktober 2026

### Sudah tersedia

| Area | Isi |
|---|---|
| **Manajemen Modul** | Katalog relasional, preset 8 segmen, override superadmin dengan riwayat, fitur wajib, syarat modul, bagian khusus jenis poli (gigi/mata). Simpan konfigurasi menyinkronkan izin peran admin. |
| **Praktik mandiri** | SOAP Ringkas satu layar, Pendaftaran Ringkas, kasir tanpa shift, General Consent opsional. |
| **Rawat jalan** | Pendaftaran → antrian poli (layar TV/kiosk + suara) → RME → resep/lab/penunjang → selesai → antrean farmasi otomatis → kasir. |
| **Rawat inap & IGD** | Registrasi, SPRI, perpindahan bed/bangsal, discharge, tagihan kamar otomatis saat pulang. |
| **Farmasi & inventory** | Resep, telaah, racikan, penyerahan, penjualan bebas, stok depo, gudang, PO, penerimaan, retur, opname. |
| **Penagihan** | Tindakan, obat, lab, penunjang, dan kamar tertagih otomatis tanpa tagihan ganda; kuitansi dan rincian tagihan dengan diskon/voucher. |
| **Laboratorium** | Order dari RME, validasi → tagihan, cetak hasil berkop dengan flag, bridging LIS. |
| **Penunjang** | Fisioterapi, Radiologi, MCU, Patologi Anatomi, Mikrobiologi. |
| **Integrasi** | SATUSEHAT (kunjungan rawat jalan selesai), BPJS PCare (FKTP) & VClaim (peserta, rujukan, SEP). |
| **Data demo & alat bantu** | 8 faskes fiktif satu per segmen, seeder transaksi via API, LIS tiruan, CI. |

### Batasan yang perlu diketahui implementator

- Status rilis **alfa**: uji menyeluruh dan jalankan paralel dengan sistem lama sebelum dipakai penuh.
- Otorisasi per peran dan penegakan Manajemen Modul sebagian besar masih di frontend (B-10, B-11).
- Belum ada wizard instalasi bersih tanpa data demo (B-40).

## Fase dan timeline

Timeline disusun untuk **model komunitas**: pengelola inti kecil dan kontributor sukarela. Tanggal adalah perkiraan; yang mengikat adalah **urutan dan kriteria selesai**. Timeline ditinjau ulang setiap akhir kuartal.

| Fase | Periode (perkiraan) | Target rilis | Fokus |
|---|---|---|---|
| **0. Pembukaan komunitas** | Okt – Nov 2026 | `1.0.0-alpha.x` | Dokumentasi, instalasi yang mulus, kebersihan repo, label dan issue awal |
| **1. Praktik mandiri siap pakai** | Nov 2026 – Jan 2027 | `1.0.0-beta.1` | Alur satu dokter penuh tanpa menu yang tidak relevan |
| **2. Klinik pratama & puskesmas** | Feb – Apr 2027 | `1.0.0` (stabil pertama) | Multi-poli, multi-petugas, lab dasar, gudang → apotek, PCare, keamanan backend |
| **3. Klinik utama & RS kelas D** | Mei – Jul 2027 | `1.1.0` | Rawat inap, IGD, VClaim/SEP, spesialis |
| **4. RS kelas C & B** | Agu – Des 2027 | `1.2.0` – `1.3.0` | Kamar operasi, ICU, gizi, koding RM, CSSD, PACS radiologi |
| **5. RS kelas A & layanan darah** | 2028 | `1.4.0`+ | Bank darah, UTD/UPTD, akuntansi & remunerasi, antrean online BPJS |

### Kriteria selesai per fase

::: details Fase 0 — Pembukaan komunitas
Orang baru bisa memasang dan menjalankan data demo hanya dengan Petunjuk Instalasi. Minimal 20 issue berlabel `good first issue`. B-40, B-41, B-51 selesai.
:::

::: details Fase 1 — Praktik mandiri siap pakai
Daftar → periksa → resep → serahkan obat → bayar → laporan berjalan di satu faskes demo tanpa bantuan developer. B-01 s.d. B-06 selesai. Satu faskes nyata menjadi pilot.
:::

::: details Fase 2 — Klinik pratama & puskesmas
Otorisasi per peran dan Manajemen Modul ditegakkan di backend (B-10, B-11). PCare tervalidasi di sandbox BPJS. Program Puskesmas (B-17) tersedia minimal KIA dan imunisasi.
:::

::: details Fase 3 — Klinik utama & RS kelas D
Alur IGD → rawat inap → pulang → klaim lengkap. Rencana kontrol (B-24) dan lab rujukan (B-25) tersedia.
:::

::: details Fase 4 — RS kelas C & B
Modul terkait berstatus "Tersedia" beserta preset segmennya.
:::

::: details Fase 5 — RS kelas A & layanan darah
Semua modul katalog berstatus "Tersedia".
:::

**Pekerjaan lintas fase** bisa dikerjakan kapan saja secara paralel: keamanan dan otorisasi, pengujian otomatis, kualitas data, dokumentasi, serta aksesibilitas dan performa antarmuka.

## Backlog utama

Daftar di bawah adalah ringkasan. Daftar lengkap beserta status, label, dan catatan lokasi kode ada di [bagian Backlog ROADMAP.md](https://github.com/tulisankode/opensimrs/blob/main/docs/ROADMAP.md#6-backlog).

### Fase 0 — Pembukaan komunitas

| ID | Item | Prioritas | Label |
|---|---|---|---|
| B-40 | Wizard/seeder instalasi awal tanpa data demo | P1 | `bantuan dibutuhkan` |
| B-41 | Bersihkan galat sintaks lama `vue-tsc` di `components/icons/*` | P2 | `good first issue` |
| B-51 | Seragamkan port di `.env.example` tiap layanan | P2 | `good first issue` |
| B-56 | Uji unit untuk layanan yang belum punya tes | P2 | `good first issue` |
| B-57 | Ganti screenshot carousel login dengan tampilan terbaru (data demo) | P3 | `good first issue` |

### Fase 1 — Praktik mandiri

| ID | Item | Prioritas |
|---|---|---|
| B-01 | Satu lokasi stok untuk praktik mandiri | P1 |
| B-02 | Penerimaan barang supplier langsung ke depo | P1 |
| B-04 | Tagihan otomatis ditutup setelah lunas | P1 |
| B-03 | Gudang tidak boleh muncul sebagai tujuan order resep | P2 |
| B-05 | Satukan sumber PPN obat | P2 |
| B-42, B-44 | Angka tagihan di header RME dan rincian Detail Tagihan kasir | P2 |
| B-06, B-43 | Komponen tarif bawaan, normalisasi titel pasien | P3 |

### Fase 2 — Klinik pratama & puskesmas

| ID | Item | Prioritas |
|---|---|---|
| B-10 | Otorisasi per peran di backend | P1 |
| B-11 | Penegakan Manajemen Modul di backend | P1 |
| B-12, B-13 | Rollback antrian bila registrasi gagal; race condition No. RM | P1 |
| B-14 | Pencarian penjamin TUNAI dibatasi per faskes | P1 |
| B-45 | Perbaikan order dan nilai rujukan laboratorium | P1 |
| B-16, B-17, B-48 | PCare lanjutan, Program Puskesmas, MCU lanjutan | P2 |

### Fase 3 — Klinik utama & RS kelas D

| ID | Item | Prioritas |
|---|---|---|
| B-20 | Diagnosis dan keluhan dari IGD terbawa ke rawat inap | P1 |
| B-21 | Discharge idempoten | P1 |
| B-22, B-23 | Kode status pulang "Dirujuk"; daftar tindakan bisa dikosongkan | P2 |
| B-24, B-25 | Rencana Kontrol & SPRI via VClaim; lab rujukan | P2 |

### Fase 4–5 — Rumah sakit menengah & besar

| ID | Item | Prioritas |
|---|---|---|
| B-32 | Kamar Operasi, ICU, Gizi, Koding RM, CSSD | P2 |
| B-35 | Antrean Online BPJS (Mobile JKN) | P2 |
| B-46, B-47 | Patologi Anatomi & Mikrobiologi lanjutan; Radiologi lanjutan termasuk PACS/DICOM | P2 |
| B-33, B-34 | Bank Darah RS & UTD/UPTD; akuntansi & remunerasi | P3 |

### Pertanyaan terbuka

| ID | Pertanyaan |
|---|---|
| Q-01 | Perlukah segmen khusus UTD/UPTD Darah dan praktik fisioterapis mandiri? |
| Q-02 | Modul Training masuk produk inti, atau diturunkan menjadi add-on? |
| Q-03 | Marketplace, Subscription, dan Web Admin Mobile adalah fitur tingkat platform. Di repo mana dan oleh siapa dikembangkan? |
| Q-04 | Kontrak API LIS perlu dibakukan bersama penyedia LIS agar integrasi bisa dipakai LIS lain. |

## Label issue

| Label | Untuk siapa | Ciri pekerjaan |
|---|---|---|
| `good first issue` | Mahasiswa dan kontributor baru | Lingkup kecil dan jelas (±1–2 hari), satu layanan/berkas, cara uji tertulis, tidak menyentuh alur klinis kritis |
| `bantuan dibutuhkan` | Kontributor berpengalaman, IT faskes | Pekerjaan penting yang belum ada yang mengerjakan; bisa lintas layanan |
| `butuh tenaga medis/klinis` | Dokter, perawat, apoteker, analis, perekam medis | Validasi alur klinis, istilah, formulir, atau aturan; cukup memberi masukan di issue |
| `integrasi` | Kontributor yang paham API eksternal | SATUSEHAT, BPJS, LIS, PACS/DICOM, alat laboratorium |
| `dokumentasi` | Siapa saja | Perbaikan panduan, tangkapan layar, terjemahan istilah |
| `keamanan` | Kontributor berpengalaman | Otorisasi, kebocoran data, rahasia. Kerentanan aktif dilaporkan secara privat. |
| `RFC` | Pengelola dan komunitas | Usulan perubahan besar, didiskusikan minimal 7 hari |

Label pendukung:

- **Prioritas:** `P1` (menghalangi pemakaian nyata pada fase berjalan), `P2` (penting untuk fase berjalan/berikutnya), `P3` (peningkatan).
- **Area:** `modul:<kode>` sesuai kode katalog (mis. `modul:farmasi`), ditambah `area:frontend`, `area:database`, `area:devops`.
- **Status:** `menunggu keputusan` (belum boleh dikerjakan), `siap dikerjakan`, `sedang dikerjakan`.

## Cara mengklaim pekerjaan

1. **Pilih** issue berlabel `siap dikerjakan` yang sesuai kemampuan. Mahasiswa sebaiknya mulai dari `good first issue`. Item backlog yang belum punya issue boleh dibuatkan issue-nya dengan menyebut ID-nya (mis. `B-41`).
2. **Klaim** dengan berkomentar di issue, mis. *"Saya ingin mengerjakan ini, perkiraan selesai 5 hari."* Tunggu pengelola menetapkan (assign) Anda. Pegang **maksimal dua** issue aktif.
3. **Mulai** dengan membaca bagian kode yang disebut di issue. Tanyakan di issue bila ada yang belum jelas.
4. **Buka draft PR lebih awal** (setelah 1–3 hari kerja) dan sebut ID backlog di judul PR, mis. `fix(lab): B-45 status batal order lab`.
5. **Kabari** bila terhambat. Klaim yang **tidak ada kabar selama 14 hari** dianggap dilepas.
6. **Selesai** saat PR digabung: item dipindah ke CHANGELOG dan ditandai selesai di roadmap.

::: tip Untuk kegiatan akademik
Untuk tugas kuliah, kerja praktik, atau skripsi, sebutkan di issue agar pengelola bisa membantu memilih lingkup yang pas dan memberi umpan balik tepat waktu.
:::

## Keputusan desain yang sudah diambil

Keputusan berikut tidak diubah tanpa diskusi lewat RFC, karena kode lain sudah bergantung padanya.

| Keputusan | Alasan |
|---|---|
| Katalog modul disimpan di `database/data/katalog-modul.json` dan disinkronkan ke tabel `ref_*` lewat migrasi | Satu sumber kebenaran yang bisa ditinjau di PR, dengan integritas relasi di database |
| Konfigurasi faskes hanya menyimpan **selisih** dari preset segmen | Perubahan preset otomatis berlaku ke faskes yang tidak meng-override |
| Hanya peran `super admin` yang boleh mengubah Manajemen Modul | Modul berdampak ke kontrak layanan dan alur klinis |
| Layar ringkas memakai endpoint dan struktur data yang sama dengan form lengkap | Resume, SATUSEHAT, tagihan, dan laporan tidak perlu tahu layar mana yang dipakai |
| Item tagihan yang dihitung ulang sistem diganti, bukan ditambah | Penyimpanan ulang dan discharge ulang tidak menagih dua kali |
| Gagal kirim ke LIS = gagal validasi order lab | Mencegah order tertagih tetapi tidak pernah sampai ke laboratorium |
| Satu monorepo untuk semua layanan | Satu fitur lintas layanan cukup satu PR |
| Data demo memakai identitas fiktif per segmen | Data uji realistis tanpa memuat data pasien nyata |

## Langkah berikutnya

- [Panduan Kontribusi](/pendahuluan/kontribusi): alur fork, branch, dan Pull Request.
- [Catatan Rilis](/pendahuluan/catatan-rilis): apa saja yang sudah dirilis.
- [Tata Kelola](/komunitas/tata-kelola): cara mengajukan RFC.
- [Kanal Komunitas](/komunitas/): diskusikan prioritas bersama komunitas.
