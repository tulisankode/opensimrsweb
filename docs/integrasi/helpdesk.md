# Helpdesk (OpenClaw)

Halaman ini untuk tim IT yang menyalakan tombol **Bantuan** di OpenSIMRS. Tombol ini menjawab pertanyaan petugas tentang cara memakai aplikasi dengan bantuan asisten AI yang berjalan di **Gateway OpenClaw**. Setelah mengikuti halaman ini, Anda punya VM helpdesk terpisah, agen yang hanya bisa membaca panduan, dan OpenSIMRS yang tersambung ke gateway itu.

Panduan pemasangan lengkap ada di repo: `deploy/helpdesk/README.md`.

## Arsitektur

```
OpenSIMRS (setting-service) ──jaringan privat / VPN──► VM Helpdesk: Gateway OpenClaw :18789 ──► penyedia model AI
```

- `setting-service` meneruskan pertanyaan petugas ke endpoint `/v1/chat/completions` milik gateway.
- Agen `helpdesk-opensimrs` hanya membaca panduan pengguna dan katalog modul yang disalin ke workspace-nya.
- Tombol Bantuan (ikon headset di header) menampilkan titik hijau bila asisten siap.

## 1. Siapkan VM terpisah

Untuk produksi, gateway **wajib** berjalan di mesin terpisah dari server SIMRS dan database. Jangan memasang OpenClaw di server produksi SIMRS.

- **Spesifikasi**: Ubuntu 24.04 LTS atau Debian 12, 2 vCPU, RAM 4 GB, disk 20 GB. Model lokal (Ollama) umumnya butuh GPU atau RAM 16 GB ke atas.
- **Jaringan**:
  - gateway hanya bisa dijangkau server SIMRS lewat jaringan privat RS atau VPN (Tailscale/WireGuard);
  - tutup port `18789` dari internet;
  - batasi lalu lintas keluar ke penyedia model saja.
- **Pengguna**: buat pengguna khusus (mis. `helpdesk`). Jangan jalankan gateway sebagai root.

## 2. Pasang OpenClaw

Ikuti installer resmi OpenClaw (untuk produksi disarankan kanal *extended-stable*), lalu jalankan `openclaw onboard --install-daemon`. Saat *onboard*:

- **Penyedia model**: pakai **kunci API milik RS**, misalnya DeepSeek, Qwen, Claude, atau GPT. Jangan memakai login langganan pribadi, karena helpdesk dipakai bersama banyak petugas. Untuk data yang tidak boleh keluar RS, pakai Ollama di jaringan RS.
- **Kanal pesan** (WhatsApp, Telegram, dan lainnya): **lewati**. Helpdesk hanya diakses lewat endpoint HTTP dari OpenSIMRS.

Versi dan persyaratan Node yang diuji tercantum di `deploy/helpdesk/README.md`.

## 3. Konfigurasi gateway dan agen terbatas

1. Salin `deploy/helpdesk/openclaw.json5.contoh` ke berkas konfigurasi OpenClaw, lalu sesuaikan:
   - `gateway.bind`: nama mode, bukan alamat IP. Gunakan `tailnet` bila server SIMRS dan VM ada di satu Tailscale, atau `custom` dengan `gateway.customBindHost` berisi IPv4 privat VM. Hindari `lan` di mesin yang punya IP publik;
   - `gateway.auth`: `mode: "token"` beserta token gateway (lihat [Token gateway](#token-gateway)).
2. Verifikasi sandbox agen:
   ```bash
   openclaw sandbox explain --agent helpdesk-opensimrs
   ```
   Jangan lanjut sebelum hasilnya menunjukkan semua sesi tersandbox, workspace **hanya-baca**, dan alat `exec`, tulis berkas, serta peramban **tidak tersedia**.
3. Mulai ulang gateway: `openclaw gateway restart`.

## 4. Sinkronkan panduan

Agen menjawab berdasarkan panduan pengguna, katalog modul, dan `AGENTS.md` dari repo. Salin ke workspace agen dengan skrip:

```bash
# bila repo ada di VM
WORKSPACE=/home/helpdesk/.openclaw/workspaces/helpdesk-opensimrs \
  ./deploy/helpdesk/sinkron-panduan.sh

# atau kirim dari mesin lain lewat rsync/SSH
TUJUAN=helpdesk@vm-helpdesk:/home/helpdesk/.openclaw/workspaces/helpdesk-opensimrs \
  ./deploy/helpdesk/sinkron-panduan.sh
```

Jalankan ulang setiap kali panduan pengguna diperbarui, misalnya setelah rilis. Di produksi, pakai hanya panduan yang sudah ditinjau.

## 5. Hubungkan OpenSIMRS

1. Masuk sebagai **superadmin**, buka **Setting › Konfigurasi Integrasi › Helpdesk AI**, lalu klik **Atur**.
2. Isi **URL Gateway** (`http://<alamat-privat-vm>:18789`), **Token Gateway**, dan **ID agen** (`helpdesk-opensimrs`). Atur juga batas pertanyaan per jam dan batas waktu jawaban.
3. Klik **Uji koneksi**. OpenSIMRS memeriksa token dan memastikan agen terdaftar lewat `/v1/models`, tanpa memakai kuota model.
4. Klik **Simpan**. Perubahan langsung berlaku tanpa menjalankan ulang layanan.

Token disimpan **terenkripsi** di database (kunci `HELPDESK_KUNCI_RAHASIA`, atau `SECRET_KEY` bila kosong) dan hanya ditampilkan 4 karakter terakhirnya. Switch **Helpdesk** di dialog yang sama mematikan tombol Bantuan untuk seluruh instalasi.

Fitur **Asisten Bantuan (Helpdesk AI)** (`helpdesk_ai`, modul Dashboard) aktif bawaan. Superadmin dapat mematikannya per faskes di **Setting › Manajemen Modul**.

::: details Alternatif tanpa antarmuka (otomasi deploy)
`setting-service/.env` dapat berisi `HELPDESK_GATEWAY_URL` dan `HELPDESK_GATEWAY_TOKEN` (opsional `HELPDESK_AGEN`, `HELPDESK_BATAS_PER_JAM`). Nilai ini hanya dipakai selama pengaturan di halaman belum disimpan.
:::

## Token gateway

Token gateway adalah kunci bersama antara `setting-service` dan gateway. **Pemegang token mendapat akses operator penuh ke gateway**, jadi perlakukan seperti sandi root.

- **Membuat**: klik **Buat token acak** di dialog Helpdesk AI. Token dibuat di peramban dengan generator acak kriptografis, lalu perintah untuk VM ditampilkan dan siap disalin. Cara lain: `openssl rand -hex 32`.
- **Memasang di VM**:
  ```bash
  openclaw config set gateway.auth.mode token
  openclaw config set gateway.auth.token "<token>"
  ```
- **Memeriksa** dari server SIMRS (200 = benar, 401 = salah):
  ```bash
  curl -s -o /dev/null -w '%{http_code}\n' http://<vm>:18789/v1/models -H "Authorization: Bearer <token>"
  ```
- **Rotasi** (bila token pernah terlihat orang lain, petugas IT berganti, atau berkala): buat token baru, pasang di VM (token lama langsung ditolak), lalu segera tempel di OpenSIMRS dan **Simpan**. Di antara kedua langkah itu tombol Bantuan menampilkan galat.

::: danger Jangan
- mengirim token lewat chat atau email tanpa enkripsi;
- menaruh token di repo atau tangkapan layar;
- memakai token yang sama untuk gateway lain.
:::

## Log dan pemantauan

- Pertanyaan dan jawaban (sudah disaring) tersimpan **90 hari** di tabel `bantuan_log`.
- Ringkasan untuk superadmin tersedia di `GET /api/v3/setting/bantuan/ringkasan`. Pantau pertanyaan yang gagal atau dijawab "belum tahu", lalu perbaiki panduan modul terkait.
- Sebelum menaikkan versi OpenClaw, uji di VM uji, ulangi `openclaw sandbox explain`, lalu jalankan skrip di `deploy/helpdesk/evaluasi/`.

## Pengembangan lokal

Untuk mencoba di mesin pengembang (bukan produksi):

- installer OpenSIMRS (`./install.sh` atau `install.cmd`) menawarkan pemasangan OpenClaw di langkah alat AI. Biarkan `gateway.bind` bernilai `loopback` agar gateway hanya bisa diakses dari mesin itu;
- tanpa OpenClaw sama sekali, jalankan gateway tiruan yang membalas jawaban kalengan:
  ```bash
  node deploy/helpdesk/gateway-tiruan.mjs     # port 18789
  ```
  Isi `HELPDESK_GATEWAY_URL=http://localhost:18789` dan token uji yang tercantum di `deploy/helpdesk/README.md`. Gateway tiruan hanya untuk menguji tombol, panel, aliran jawaban, penyaring, dan batas laju.

## Lihat juga

- [Deployment](/memulai/deployment)
- [Manajemen Modul & Fitur](/arsitektur/manajemen-modul)
- [SIMRS Studio](/studio/) (fitur AI lain, khusus mesin pengembang)
