FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

RUN a2enmod rewrite

WORKDIR /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache

ENV PORT=10000

RUN sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf \
 && sed -i "s/<VirtualHost \\*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

EXPOSE 10000

CMD php artisan migrate --force || true && apache2-foreground
