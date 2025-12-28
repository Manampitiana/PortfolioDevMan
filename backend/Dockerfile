FROM php:8.2-apache

# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql

# 2. Apache mod_rewrite
RUN a2enmod rewrite

# 3. Set working directory
WORKDIR /var/www/html

# 4. Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Copy project files
COPY . .

# 6. Install dependencies
RUN composer install --no-dev --optimize-autoloader

# 7. Omeo alalana ny folder storage sy cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 8. Configure Apache document root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# 9. MANERY AN'I APACHE HAMAKY NY PORT OMEN'I RENDER (TENA ILAY IZAO)
RUN sed -i 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf
RUN sed -i 's/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g' /etc/apache2/sites-available/000-default.conf

# 10. Start Migration sy Apache
# Ampiasaina ny "sh -c" mba hahafahan'ny Docker mamaky ny variable $PORT
CMD sh -c "php artisan migrate --force && apache2-foreground"