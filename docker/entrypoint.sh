#!/bin/sh
set -e
cd /app

urlencode() {
  node -e 'process.stdout.write(encodeURIComponent(process.argv[1] || ""))' "$1"
}

require_env() {
  if [ -z "$(printenv "$1")" ]; then
    echo "Missing required environment variable: $1" >&2
    exit 1
  fi
}

if [ -z "${DATABASE_URL:-}" ]; then
  if [ -n "${DB_HOST:-}" ] && [ -n "${DB_USERNAME:-}" ] && [ -n "${DB_PASSWORD:-}" ] && [ -n "${DB_DATABASE:-}" ]; then
    db_user="$(urlencode "$DB_USERNAME")"
    db_password="$(urlencode "$DB_PASSWORD")"
    db_host="$DB_HOST"
    db_port="${DB_PORT:-5432}"
    db_name="$(urlencode "$DB_DATABASE")"
    export DATABASE_URL="postgresql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}?schema=agua"
  else
    require_env DATABASE_URL
  fi
fi

if [ "${SKIP_DB_MIGRATE:-0}" != "1" ]; then
  prisma migrate deploy --schema=prisma/alarmes-agua/schema.prisma
fi

exec node dist/main.js
