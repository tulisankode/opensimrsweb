import { defineConfig } from 'vitepress'

// Dokumentasi resmi OpenSIMRS — https://docs.opensimrs.com
// Struktur mengikuti dokumentasi proyek open source umumnya (Laravel, Express): Pendahuluan → Memulai → Arsitektur →
// Modul → Integrasi → SIMRS Studio → Referensi API → Komunitas.

const sidebar = [
  {
    text: 'Pendahuluan',
    items: [
      { text: 'Apa itu OpenSIMRS?', link: '/pendahuluan/' },
      { text: 'Catatan Rilis', link: '/pendahuluan/catatan-rilis' },
      { text: 'Roadmap', link: '/pendahuluan/roadmap' },
      { text: 'Panduan Kontribusi', link: '/pendahuluan/kontribusi' },
      { text: 'Kebijakan Keamanan', link: '/pendahuluan/keamanan' },
    ],
  },
  {
    text: 'Memulai',
    items: [
      { text: 'Instalasi', link: '/memulai/instalasi' },
      { text: 'Konfigurasi', link: '/memulai/konfigurasi' },
      { text: 'Struktur Direktori', link: '/memulai/struktur-direktori' },
      { text: 'Data Demo', link: '/memulai/data-demo' },
      { text: 'Spesifikasi Hardware', link: '/memulai/spesifikasi-hardware' },
      { text: 'Deployment', link: '/memulai/deployment' },
      { text: 'Akses Lewat Domain', link: '/memulai/akses-domain' },
      { text: 'Pembaruan & Cadangan', link: '/memulai/pembaruan-cadangan' },
    ],
  },
  {
    text: 'Arsitektur',
    items: [
      { text: 'Gambaran Sistem', link: '/arsitektur/gambaran' },
      { text: 'Autentikasi & Hak Akses', link: '/arsitektur/autentikasi-izin' },
      { text: 'Basis Data & Migrasi', link: '/arsitektur/basis-data-migrasi' },
      { text: 'Konvensi API', link: '/arsitektur/konvensi-api' },
      { text: 'Manajemen Modul & Fitur', link: '/arsitektur/manajemen-modul' },
      { text: 'Audit Trail', link: '/arsitektur/audit-trail' },
    ],
  },
  {
    text: 'Modul',
    items: [
      { text: 'Peta Modul', link: '/modul/' },
      { text: 'Pendaftaran & Antrian', link: '/modul/pendaftaran-antrian' },
      { text: 'Rawat Jalan', link: '/modul/rawat-jalan' },
      { text: 'Rawat Inap', link: '/modul/rawat-inap' },
      { text: 'IGD', link: '/modul/igd' },
      { text: 'Farmasi & Stok', link: '/modul/farmasi-stok' },
      { text: 'Laboratorium', link: '/modul/laboratorium' },
      { text: 'Radiologi', link: '/modul/radiologi' },
      { text: 'Kasir & Penjamin', link: '/modul/kasir-penjamin' },
      { text: 'Penunjang Medis', link: '/modul/penunjang-medis' },
      { text: 'Penunjang Umum', link: '/modul/penunjang-umum' },
      { text: 'Manajemen & Mutu', link: '/modul/manajemen' },
    ],
  },
  {
    text: 'Integrasi',
    items: [
      { text: 'BPJS Kesehatan', link: '/integrasi/bpjs' },
      { text: 'SATUSEHAT', link: '/integrasi/satusehat' },
      { text: 'LIS & PACS', link: '/integrasi/lis-pacs' },
      { text: 'HDIS (Hemodialisa)', link: '/integrasi/hdis' },
      { text: 'Helpdesk (OpenClaw)', link: '/integrasi/helpdesk' },
    ],
  },
  {
    text: 'SIMRS Studio',
    items: [
      { text: 'Pengantar', link: '/studio/' },
      { text: 'Alur Kerja Item', link: '/studio/alur-kerja' },
      { text: 'Agen & Konektor', link: '/studio/agen-konektor' },
      { text: 'Keamanan & Batasan', link: '/studio/keamanan' },
    ],
  },
  {
    text: 'Referensi API',
    items: [
      { text: 'Ringkasan', link: '/api/' },
      { text: 'Autentikasi', link: '/api/autentikasi' },
      { text: 'Endpoint per Layanan', link: '/api/layanan' },
    ],
  },
  {
    text: 'Komunitas',
    items: [
      { text: 'Kanal Komunitas', link: '/komunitas/' },
      { text: 'Tata Kelola', link: '/komunitas/tata-kelola' },
      { text: 'Kode Etik', link: '/komunitas/kode-etik' },
    ],
  },
]

export default defineConfig({
  lang: 'id-ID',
  title: 'OpenSIMRS',
  titleTemplate: ':title — Dokumentasi OpenSIMRS',
  description: 'Dokumentasi resmi OpenSIMRS, Sistem Informasi Manajemen Rumah Sakit open source untuk Indonesia.',
  cleanUrls: true,
  // Tautan ke aplikasi lokal (http://localhost:5520 dst.) memang disengaja; tautan internal lain tetap diperiksa.
  ignoreDeadLinks: 'localhostLinks',
  lastUpdated: true,
  sitemap: { hostname: 'https://docs.opensimrs.com' },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#1a66e0' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Dokumentasi OpenSIMRS' }],
    ['meta', { property: 'og:image', content: 'https://docs.opensimrs.com/logo.png' }],
  ],
  themeConfig: {
    logo: '/logo-ikon.png',
    siteTitle: 'OpenSIMRS',
    nav: [
      { text: 'Panduan', link: '/memulai/instalasi', activeMatch: '/(memulai|arsitektur|pendahuluan)/' },
      { text: 'Modul', link: '/modul/', activeMatch: '/modul/' },
      { text: 'Integrasi', link: '/integrasi/bpjs', activeMatch: '/integrasi/' },
      { text: 'SIMRS Studio', link: '/studio/', activeMatch: '/studio/' },
      { text: 'API', link: '/api/', activeMatch: '/api/' },
      {
        text: 'v1.x',
        items: [
          { text: 'Catatan Rilis', link: '/pendahuluan/catatan-rilis' },
          { text: 'Roadmap', link: '/pendahuluan/roadmap' },
          { text: 'Kontribusi', link: '/pendahuluan/kontribusi' },
        ],
      },
      { text: 'Situs Utama', link: 'https://opensimrs.com' },
    ],
    sidebar: {
      '/pendahuluan/': sidebar,
      '/memulai/': sidebar,
      '/arsitektur/': sidebar,
      '/modul/': sidebar,
      '/integrasi/': sidebar,
      '/studio/': sidebar,
      '/api/': sidebar,
      '/komunitas/': sidebar,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/tulisankode/opensimrs' },
      { icon: 'discord', link: 'https://discord.gg/qAWhdzGJTW' },
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Cari', buttonAriaLabel: 'Cari dokumentasi' },
          modal: {
            displayDetails: 'Tampilkan rincian',
            resetButtonTitle: 'Hapus pencarian',
            backButtonTitle: 'Tutup pencarian',
            noResultsText: 'Tidak ada hasil untuk',
            footer: { selectText: 'pilih', navigateText: 'navigasi', closeText: 'tutup' },
          },
        },
      },
    },
    outline: { level: [2, 3], label: 'Di halaman ini' },
    docFooter: { prev: 'Sebelumnya', next: 'Berikutnya' },
    lastUpdated: { text: 'Terakhir diperbarui', formatOptions: { dateStyle: 'medium' } },
    darkModeSwitchLabel: 'Tema',
    lightModeSwitchTitle: 'Ganti ke tema terang',
    darkModeSwitchTitle: 'Ganti ke tema gelap',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Kembali ke atas',
    langMenuLabel: 'Bahasa',
    notFound: {
      title: 'HALAMAN TIDAK DITEMUKAN',
      quote: 'Halaman yang Anda cari tidak ada atau sudah dipindahkan.',
      linkText: 'Kembali ke beranda dokumentasi',
    },
    footer: {
      message: 'Dirilis dengan lisensi MIT. Kontak: <a href="mailto:dev@opensimrs.com">dev@opensimrs.com</a>',
      copyright: 'Hak cipta © 2026 kontributor OpenSIMRS',
    },
  },
})
