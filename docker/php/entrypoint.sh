#!/bin/sh
set -e

role="${CONTAINER_ROLE:-app}"

echo "Waiting for database..."
until php -r "try { new PDO('pgsql:host=' . getenv('DB_HOST') . ';port=' . (getenv('DB_PORT') ?: '5432') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); exit(0); } catch (Throwable \$e) { exit(1); }" 2>/dev/null; do
  sleep 2
done
echo "Database is ready."

if [ "$role" = "app" ]; then
  # Populate shared public volume for nginx without wiping image assets
  if [ -d /opt/public.dist ]; then
    mkdir -p /var/www/html/public
    cp -a /opt/public.dist/. /var/www/html/public/
    chown -R www-data:www-data /var/www/html/public
  fi
  mkdir -p /var/www/html/storage/app /var/www/html/storage/framework/{cache,sessions,views} /var/www/html/storage/logs
  chown -R www-data:www-data /var/www/html/storage
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  php artisan migrate --force
  php artisan storage:link --force 2>/dev/null || true
  exec php-fpm
fi

if [ "$role" = "queue" ]; then
  exec php artisan queue:work --sleep=3 --tries=1 --timeout=0 --no-interaction
fi

echo "Unknown CONTAINER_ROLE: $role" >&2
exit 1
