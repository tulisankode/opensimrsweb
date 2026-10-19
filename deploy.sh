#!/usr/bin/env bash
# Deploy situs di server (nginx): git pull → build dokumentasi → salin ke folder web.
#   ./deploy.sh
# Folder tujuan bisa diubah: DOCS_DIR=/var/www/opensimrs-docs LANDING_DIR=/var/www/opensimrs-landing ./deploy.sh
# nginx: root docs.opensimrs.com → $DOCS_DIR, root opensimrs.com → $LANDING_DIR (contoh lengkap di README.md).
set -euo pipefail
cd "$(dirname "$0")"

DOCS_DIR="${DOCS_DIR:-/var/www/opensimrs-docs}"
LANDING_DIR="${LANDING_DIR:-/var/www/opensimrs-landing}"

salin() { # salin <sumber/> <tujuan>: isi tujuan disamakan persis dengan sumber
  if command -v rsync >/dev/null 2>&1; then sudo rsync -a --delete "$1" "$2/"
  else sudo find "$2" -mindepth 1 -delete && sudo cp -a "$1". "$2/"; fi
}

echo "==> git pull"
git pull --ff-only

echo "==> npm ci & build dokumentasi"
npm ci --no-audit --no-fund
npm run docs:build

echo "==> salin ke $DOCS_DIR dan $LANDING_DIR"
sudo mkdir -p "$DOCS_DIR" "$LANDING_DIR"
salin docs/.vitepress/dist/ "$DOCS_DIR"
salin landing/ "$LANDING_DIR"

echo "Selesai: dokumentasi → $DOCS_DIR, landing page → $LANDING_DIR"
