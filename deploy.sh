#!/bin/bash
set -e

NODE="/opt/alt/alt-nodejs20/root/usr/bin/node"
NPM="/opt/alt/alt-nodejs20/root/usr/bin/npm"
NPX="/opt/alt/alt-nodejs20/root/usr/bin/npx"
DEPLOY_DIR="$HOME/histlingo"

echo "=== HistLingo Deploy ==="

# Garante que o diretório existe
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Clona ou atualiza o repositório
if [ -d ".git" ]; then
  echo "[1/7] Atualizando repositório..."
  git pull origin main
else
  echo "[1/7] Clonando repositório..."
  git clone https://github.com/BrayanFerreiraDacruz/HistLingo.git .
fi

# Instala dependências do backend
echo "[2/7] Instalando dependências backend..."
$NPM ci --omit=dev

# Instala dependências do frontend
echo "[3/7] Instalando dependências frontend..."
cd histlingo-web && $NPM ci && cd ..

# Build do frontend
echo "[4/7] Buildando frontend..."
cd histlingo-web && $NPM run build && cd ..

# Copia build do frontend para pasta public
echo "[5/7] Copiando frontend para public/..."
mkdir -p public
cp -r histlingo-web/dist/. public/

# Gera Prisma Client e build backend
echo "[6/7] Gerando Prisma + buildando backend..."
$NPX prisma generate
$NPM run build

# Roda migrations
echo "[7/7] Rodando migrations do banco..."
$NPX prisma migrate deploy

echo ""
echo "=== Deploy concluido! ==="
echo "Inicie com: $NODE dist/main"
