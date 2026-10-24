# PHP 8.4.27 — fixes CVE-2026-109618 and CVE-2026-109619 (php.net 2026-10-21)
# Do not float to php:8.4 or php:latest without verifying the patch version.

FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --prefer-dist \
    --ignore-platform-reqs

FROM node:22-bookworm AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
COPY --from=vendor /app/vendor ./vendor
RUN npm run build

FROM php:8.4.27-fpm-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libpq-dev \
        libzip-dev \
        libicu-dev \
        libpng-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        pgsql \
        mbstring \
        bcmath \
        intl \
        zip \
        opcache \
        pcntl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY --chown=www-data:www-data . .
COPY --from=vendor --chown=www-data:www-data /app/vendor ./vendor
COPY --from=frontend --chown=www-data:www-data /app/public/build ./public/build

COPY docker/php/php.ini /usr/local/etc/php/conf.d/99-area-verde.ini
COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh \
    && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && cp -a public /opt/public.dist \
    && chown -R www-data:www-data /var/www/html storage bootstrap/cache /opt/public.dist \
    && chmod -R ug+rwx storage bootstrap/cache \
    && composer dump-autoload --optimize --no-dev --no-interaction

# php-fpm master runs as root and workers as www-data (image default)
EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
