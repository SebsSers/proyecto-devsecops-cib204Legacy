#!/usr/bin/env bash
# ============================================================
#  iniciar-app.sh  -  Inicia la app movil (Expo) en modo web.
#  Funciona sin importar en que carpeta estes: entra solo a
#  app-movil/, corrige permisos si hace falta, instala y arranca.
#  Uso:  bash iniciar-app.sh
# ============================================================
set -e
DIR="$(cd "$(dirname "$0")/app-movil" && pwd)"
cd "$DIR"

# Si no se puede escribir en la carpeta (le falta el bit de escritura, o
# quedo con otro dueno), corrige los permisos antes de instalar.
if ! ( : > .permtest 2>/dev/null && rm -f .permtest ); then
  echo "Ajustando permisos de app-movil/ ..."
  chmod -R u+w "$DIR" 2>/dev/null \
    || sudo chown -R "$(id -u)":"$(id -g)" "$DIR" 2>/dev/null \
    || true
fi

echo "Instalando librerias de la app (la primera vez tarda 1-3 min)..."
npm install

echo "Iniciando la app en modo web (puerto 8081)..."
npx expo start --web
