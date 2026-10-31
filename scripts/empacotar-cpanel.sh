#!/usr/bin/env bash
# Gera um ZIP pronto para upload no cPanel (Gerenciador de arquivos / FTP).
# Uso (Git Bash, na raiz do projeto): bash scripts/empacotar-cpanel.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OUT_DIR="${ROOT}/dist"
STAMP="$(date +%Y%m%d-%H%M%S)"
ZIP_NAME="area-verde-cpanel-${STAMP}.zip"
ZIP_PATH="${OUT_DIR}/${ZIP_NAME}"

echo "==> Instalando dependências PHP (produção)..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "==> Instalando e compilando assets..."
npm ci
npm run build

rm -f public/hot

mkdir -p "$OUT_DIR"

echo "==> Gerando ${ZIP_NAME}..."
rm -f "$ZIP_PATH"

zip -r "$ZIP_PATH" . \
  -x ".git/*" \
  -x ".github/*" \
  -x "node_modules/*" \
  -x "tests/*" \
  -x "dist/*" \
  -x "docker/*" \
  -x "terraform/*" \
  -x "storage/inertia-devtools/*" \
  -x "storage/logs/*" \
  -x "storage/framework/cache/data/*" \
  -x "storage/framework/sessions/*" \
  -x "storage/framework/views/*" \
  -x "database/*.sqlite" \
  -x "database/*.sqlite-journal" \
  -x ".env" \
  -x ".env.backup" \
  -x ".env.production" \
  -x ".env.local" \
  -x "public/hot" \
  -x "public/storage" \
  -x "docker-compose*.yml" \
  -x "*.log" \
  -x ".idea/*" \
  -x ".vscode/*" \
  -x ".cursor/*"

echo ""
echo "Pacote pronto: ${ZIP_PATH}"
echo "No servidor: extrair, copiar .env.cpanel.example para .env, ajustar DB_* e APP_URL,"
echo "depois rodar as migrations (ver README → Hospedagem no cPanel)."
