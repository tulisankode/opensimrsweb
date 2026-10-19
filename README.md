# Situs OpenSIMRS

Repositori ini berisi dua situs statis OpenSIMRS, terpisah dari kode aplikasi ([tulisankode/opensimrs](https://github.com/tulisankode/opensimrs)):

| Folder | Situs | Domain | Teknologi |
|---|---|---|---|
| `landing/` | Landing page | https://opensimrs.com | HTML + CSS statis, tanpa build |
| `docs/` | Dokumentasi resmi | https://docs.opensimrs.com | [VitePress](https://vitepress.dev) 1.6 |

## Menjalankan di komputer sendiri

Butuh Node.js 18 atau lebih baru.

```bash
npm install
npm run docs:dev        # dokumentasi → http://localhost:5180
npm run landing:dev     # landing page → http://localhost:5182
```

Landing page juga bisa langsung dibuka dengan mengklik dua kali `landing/index.html`.

## Build

```bash
npm run docs:build      # hasil: docs/.vitepress/dist
npm run docs:preview    # pratinjau hasil build
```

Landing page tidak perlu build. Unggah seluruh isi folder `landing/` apa adanya.

## Deploy

### Cloudflare Pages (disarankan, gratis)

Buat dua proyek Pages dari repositori ini:

| Proyek | Build command | Output directory | Custom domain |
|---|---|---|---|
| `opensimrs-docs` | `npm run docs:build` | `docs/.vitepress/dist` | `docs.opensimrs.com` |
| `opensimrs-landing` | *(kosong)* | `landing` | `opensimrs.com` |

Atur variabel lingkungan `NODE_VERSION=20` pada proyek dokumentasi.

### Server sendiri (nginx)

```nginx
server {
  server_name docs.opensimrs.com;
  root /var/www/opensimrs-docs;        # isi docs/.vitepress/dist
  location / { try_files $uri $uri.html $uri/ =404; }   # cleanUrls VitePress
  error_page 404 /404.html;
}
server {
  server_name opensimrs.com;
  root /var/www/opensimrs-landing;     # isi folder landing/
  index index.html;
}
```

Pasang HTTPS dengan certbot, atau letakkan di belakang Cloudflare.

## Menulis dokumentasi

Baca [PANDUAN-PENULISAN.md](./PANDUAN-PENULISAN.md). Menu sidebar diatur di `docs/.vitepress/config.mts`. Setiap halaman baru harus didaftarkan di sana. `npm run docs:build` gagal bila ada tautan internal yang rusak, jadi jalankan sebelum membuat pull request.

## Lisensi

MIT, sama dengan OpenSIMRS.
