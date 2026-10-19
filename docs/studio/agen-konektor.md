# Agen & Konektor

Halaman ini menjelaskan "mesin AI" yang bisa dipakai SIMRS Studio: agen CLI yang memakai langganan pribadi (Claude Code, Codex) dan konektor API yang dibayar per pemakaian, termasuk model lokal. Setelah membaca halaman ini, Anda bisa memilih agen per tahap, menyusun rantai cadangan saat kuota habis, dan membatasi jumlah agen yang berjalan bersamaan.

Semua pengaturan ada di **SIMRS Studio › Pengaturan & Agen**.

## Pilihan agen

| Agen | Dibayar lewat | Cocok untuk |
|---|---|---|
| **Claude Code CLI** | Langganan Claude Pro/Max **pribadi** | Semua tahap, termasuk coding. Agen bawaan |
| **Codex CLI** | Langganan ChatGPT Plus/Pro/Team | Semua tahap, sering dipakai khusus tahap Coding |
| **Konektor API** | Per pemakaian (kunci API) | Tim yang berbagi Studio, cadangan saat kuota langganan habis, atau model lokal |

Agen dipilih **per tahap** di tabel konektor per tahap, misalnya Claude Code untuk dokumen dan Codex untuk coding. Model per tahap juga bisa diatur: Claude Code hanya menerima model Claude (`opus`, `sonnet`, `haiku`, `claude-…`), Codex hanya model OpenAI, sedangkan konektor API memakai model yang diatur di konektornya sendiri.

::: warning Langganan bersifat pribadi
Sesuai ketentuan penyedia, satu langganan tidak dipakai bersama banyak orang. Bila Studio dipakai satu tim, gunakan konektor API per tim.
:::

## Claude Code CLI

1. Pasang di mesin Studio. Installer OpenSIMRS (`./install.sh` / `install.cmd`) sudah menawarkannya; lewati dengan `--tanpa-ai` / `-TanpaAi`. Pemasangan manual:
   ```bash
   npm install -g @anthropic-ai/claude-code
   claude auth login            # pilih akun Claude Pro/Max
   claude auth status --text    # pastikan sudah masuk
   ```
2. Login juga bisa dari aplikasi: **Pengaturan & Agen › Claude Code › Hubungkan akun Claude**. Salin kode dari halaman Claude dan tempel di dialog Studio. Tombol **Putuskan** mengeluarkan akun.

Login harus dilakukan **di pengguna OS yang sama** dengan yang menjalankan `npm run dev`. Bila CLI tidak ada di `PATH`, isi `STUDIO_CLAUDE_BIN` di `studio-service/.env`.

Saat berjalan, Claude Code dibatasi daftar alat: tahap dokumen hanya-baca, tahap coding boleh menyunting berkas dan menjalankan perintah uji tertentu (`node --check`, `npm --prefix … test`, build frontend), dan berkas zona merah ditolak. Lihat [Keamanan & Batasan](/studio/keamanan).

## Codex CLI

1. Pasang: `npm install -g @openai/codex` (juga ditawarkan installer), atau isi `STUDIO_CODEX_BIN`.
2. Di **Pengaturan & Agen › Codex**, klik **Hubungkan akun ChatGPT**. Studio menampilkan kode sekali pakai dan membuka halaman perangkat OpenAI. Masukkan kode setelah login; dialog tertutup sendiri bila berhasil.
3. Pilih **Codex (langganan ChatGPT)** untuk tahap yang diinginkan.

Batasan Codex:

- Codex memakai sandbox-nya sendiri: tahap dokumen hanya-baca, coding hanya di folder kerja dan tanpa jaringan.
- Codex tidak punya daftar larangan per berkas. Karena itu, setelah tugas coding Studio otomatis mengembalikan perubahan pada `.env*`, `studio-service/`, SDK izin, `rahasia.js`, `.github/`, `deploy/`, dan `CLAUDE.md`, serta membatalkan commit buatan agen (perubahannya tetap ada, belum di-commit).
- Studio tidak memakai konfigurasi Codex pribadi Anda (`--ignore-user-config`): model, plugin, memori, dan MCP pribadi tidak ikut.
- Biaya per tugas tidak tersedia dalam US$; Studio hanya mencatat token.
- Diskusi revisi coding dengan Codex selalu memulai sesi baru.

## Konektor API

Tambahkan lewat **Pengaturan & Agen › Tambah konektor**. Kunci API disimpan terenkripsi. Klik **Uji** setelah menyimpan.

Ada tiga jenis penyedia:

- **Anthropic** (Claude Messages API);
- **OpenAI** (Chat Completions);
- **Kompatibel OpenAI**: endpoint apa pun yang meniru API OpenAI.

Pilihan **Penyedia siap pakai** mengisi endpoint dan contoh model secara otomatis:

| Penyedia | Endpoint |
|---|---|
| Anthropic (Claude) | bawaan |
| OpenAI (GPT) | bawaan |
| DeepSeek | `https://api.deepseek.com/v1` |
| Qwen (Alibaba Model Studio) | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| Grok (xAI) | `https://api.x.ai/v1` |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` |
| Mistral | `https://api.mistral.ai/v1` |
| OpenRouter | `https://openrouter.ai/api/v1` |
| Groq | `https://api.groq.com/openai/v1` |
| Ollama (model lokal, tanpa kunci) | `http://localhost:11434/v1` |

Penyedia kompatibel OpenAI lain (vLLM, LM Studio, dan sebagainya) bisa diisi manual. Nama model di preset hanya contoh; cek nama terbaru di situs penyedia.

Konektor API menjalankan loop alatnya sendiri (membaca, mencari, dan menyunting berkas) dengan batas 30 langkah untuk tugas dokumen dan 80 langkah untuk coding. Kemampuan memakai alat berbeda tiap model, jadi coba dulu di tahap dokumen sebelum dipakai untuk Coding.

### Model lokal dengan Ollama

Model lokal cocok untuk faskes yang tidak boleh mengirim data keluar: tanpa kunci API, tanpa biaya per token, dan data tidak keluar dari jaringan RS.

1. Pasang Ollama dan unduh modelnya, misalnya:
   ```bash
   ollama pull qwen3:8b
   ```
2. Tambah konektor dengan penyedia **Ollama**, lalu tulis nama model **persis dengan tag-nya** (mis. `qwen3:8b`). Contoh model di preset: `qwen3:8b`, `gpt-oss:20b`, `qwen3-coder:30b`.
3. Klik **Uji**.

::: tip Pilih model sesuai beban
Model lokal kecil seperti `qwen3:8b` cocok untuk tahap dokumen (permintaan, use case, PRD) atau sebagai cadangan terakhir. Model kecil **belum disarankan** untuk coding modul utuh; gunakan model yang lebih besar atau agen langganan untuk tahap Coding.
:::

## Rantai cadangan saat kuota habis

Kuota langganan dan *rate limit* API bisa habis di tengah pekerjaan. **Rantai cadangan konektor** (Pengaturan & Agen) adalah daftar berurutan berisi Claude Code, Codex, atau konektor API yang aktif.

- Konektor tahap selalu dicoba lebih dulu. Bila gagal **karena kuota** (misalnya pesan *session limit*/*usage limit*, atau HTTP 429/529 dari API), agen beralih ke konektor berikutnya yang belum dicoba. Galat lain tetap membuat tugas gagal.
- Prompt tetap sama. Pada coding, agen pengganti diberi catatan bahwa worktree sudah berisi sebagian perubahan, sehingga ia melanjutkan, bukan mengulang dari nol.
- Konektor yang akhirnya dipakai tercatat di kolom model tugas, dan diskusi item mendapat pesan sistem, misalnya "Kuota Claude Code (langganan) habis — beralih ke Anthropic API".
- Konektor API cadangan tetap tunduk pada batas biaya per tugas, item, dan bulan.

Contoh susunan: tahap memakai **Claude Code (langganan)** → cadangan **konektor API Anthropic** → **Codex**.

**Menunggu kuota.** Bila semua konektor dalam rantai habis, tugas berstatus **Menunggu kuota** dan dilanjutkan otomatis pada jam reset paling awal yang terbaca (tanpa jam reset: 15 menit lagi). Penjadwal memeriksa sekitar tiap 60 detik. Tugas tidak dilanjutkan bila item sudah pindah tahap, ditunda, dibatalkan, atau dihapus, dan berhenti setelah 20 kali tertunda berturut-turut. Tombol **Batalkan** di panel tugas menghentikannya.

**Henti di kuota (%)** (bawaan 95) membuat Studio langsung memakai cadangan, atau menunda tugas sampai jam reset, bila pemakaian langganan Claude Code melewati batas itu.

::: info Pemakaian yang wajar
Rantai cadangan ditujukan untuk jalur berbayar resmi atau penyedia yang berbeda, **bukan** untuk memutar beberapa akun langganan pribadi dari penyedia yang sama. Satu akun per konektor, sesuai ketentuan tiap penyedia.
:::

## Batas pemakaian

| Pengaturan | Bawaan | Keterangan |
|---|---|---|
| **Maksimal agen bersamaan** | 2 | Kosong atau 0 = tanpa batas. Tugas di atas batas berstatus **Menunggu slot agen** dan dimulai otomatis (tertua dulu) saat ada agen yang selesai |
| **Batas tugas per jam** | 30 | Jumlah tugas agen yang boleh dimulai per pengguna per jam |
| **Batas biaya** per tugas / item / bulan | tanpa batas | Dalam US$ setara harga API. Permintaan yang melewati batas ditolak |
| **Henti di kuota (%)** | 95 | Persentase pemakaian langganan Claude Code sebelum beralih ke cadangan |

Naikkan **Maksimal agen bersamaan** hanya bila mesin cukup kuat; setiap agen coding menjalankan uji dan build di mesin yang sama.

## Agen eksternal lewat MCP

Agen lain seperti OpenClaw atau Claude Desktop dapat tersambung lewat server MCP OpenSIMRS:

```json
{ "mcpServers": { "opensimrs": { "command": "node", "args": ["<repo>/studio-service/src/mcp.js"] } } }
```

- **Alat baca**: `baca_berkas`, `cari`, `daftar_berkas`, `baca_skema_db` (struktur tanpa data), `baca_katalog`.
- **Alat Studio**: `daftar_item`, `baca_item`, `kirim_artefak` (dokumen versi baru, tetap perlu persetujuan), `kirim_pesan`.
- Alat tulis berkas hanya aktif bila `STUDIO_MCP_TULIS=aktif`.

## Lihat juga

- [Pengantar SIMRS Studio](/studio/)
- [Alur Kerja Item](/studio/alur-kerja)
- [Keamanan & Batasan](/studio/keamanan)
