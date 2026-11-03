#!/usr/bin/env bash
# Genera los archivos .env de un cliente nuevo (una barbería) y una checklist
# de alta. Uso: ./scripts/new-client.sh
#
# Este proyecto se vende como una instancia por cliente (dominio, diseño y
# base de datos propios), no como multi-tenant. Este script arma la
# configuración inicial para acelerar cada alta.
set -euo pipefail

read -rp "Nombre de la barbería (ej: El Vasco): " SHOP_NAME
read -rp "Dominio del sitio público (ej: elvasco.tuapp.com): " DOMAIN
read -rp "Dominio/URL de la API (ej: api-elvasco.tuapp.com): " API_DOMAIN
read -rp "Email del administrador (dueño): " ADMIN_EMAIL
read -rp "WhatsApp del negocio (sin +, ej: 5491123456789): " WHATSAPP_NUMBER

ADMIN_PASSWORD=$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-16)
JWT_SECRET=$(openssl rand -hex 32)

OUT_DIR="clients/$(echo "$SHOP_NAME" | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9-')"
mkdir -p "$OUT_DIR"

cat > "$OUT_DIR/backend.env" <<EOF
NODE_ENV=production
PORT=3000

DATABASE_URL=
DB_HOST=
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=$JWT_SECRET
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD

BARBERSHOP_NAME=$SHOP_NAME
WHATSAPP_NUMBER=$WHATSAPP_NUMBER

CORS_ORIGIN=https://$DOMAIN
EOF

cat > "$OUT_DIR/frontend.env" <<EOF
VITE_API_URL=https://$API_DOMAIN
VITE_BARBERSHOP_NAME=$SHOP_NAME
VITE_WHATSAPP_NUMBER=$WHATSAPP_NUMBER
EOF

cat > "$OUT_DIR/CHECKLIST.md" <<EOF
# Alta de $SHOP_NAME

## 1. Infraestructura
- [ ] Crear proyecto en Railway (o el hosting que uses) para backend + Postgres
- [ ] Crear proyecto/deploy para el frontend (Vercel/Netlify/Railway static)
- [ ] Apuntar el dominio $DOMAIN al frontend
- [ ] Apuntar $API_DOMAIN al backend
- [ ] Cargar las variables de \`backend.env\` en el backend
- [ ] Cargar las variables de \`frontend.env\` en el frontend

## 2. Branding (personalizar por cliente)
- [ ] Reemplazar la foto del hero en \`frontend/src/pages/Booking.jsx\` por una foto real de $SHOP_NAME
- [ ] Actualizar \`frontend/index.html\` (title, apple-mobile-web-app-title)
- [ ] Actualizar \`frontend/vite.config.js\` y \`public/manifest-admin.webmanifest\` (name/short_name)
- [ ] Reemplazar \`frontend/public/favicon.svg\` e \`icons/\` si el cliente tiene logo propio
- [ ] Revisar la paleta de colores en \`frontend/src/styles/tokens.css\` si el cliente pide otra identidad

## 3. Backend
- [ ] Verificar que \`NODE_ENV=production\` esté seteado (las migraciones Y el
      usuario administrador se crean solos al arrancar con esa variable —
      no hace falta correr ningún comando a mano)
- [ ] Revisar los logs del primer arranque: debe decir
      "Usuario administrador verificado: $ADMIN_EMAIL". Si dice que
      ADMIN_EMAIL/ADMIN_PASSWORD no están configurados, revisar las env vars
- [ ] Cargar los servicios y horarios reales desde el panel de admin

## 4. Entrega al dueño
- [ ] Mandar por WhatsApp: link de $DOMAIN/admin/login, el email y la contraseña generada
- [ ] Pedirle que toque "Instalar app" (o Compartir → Agregar a inicio en iPhone) para tener acceso directo
- [ ] Pedirle que cambie la contraseña apenas entra (hoy no hay pantalla para esto — ver nota abajo)

## Datos generados
- Email admin: $ADMIN_EMAIL
- Contraseña inicial: $ADMIN_PASSWORD
- JWT_SECRET: (ver backend.env, no compartir)

> Nota: todavía no existe una pantalla de "cambiar contraseña" en el panel.
> Por ahora, si el dueño quiere otra contraseña, cambiá ADMIN_PASSWORD en
> las variables de entorno del backend y reiniciá el servicio — se
> actualiza sola al arrancar, no hace falta correr ningún script.
EOF

echo ""
echo "Listo. Archivos generados en $OUT_DIR/"
echo "  - backend.env"
echo "  - frontend.env"
echo "  - CHECKLIST.md"
echo ""
echo "Contraseña inicial del admin: $ADMIN_PASSWORD"
