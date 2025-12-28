FROM php:8.2-apache

# 1. Mametraka ny fitaovana ilaina (System dependencies)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql

# 2. Ampidiro ny Apache mod_rewrite (ilaina amin'ny Laravel routes)
RUN a2enmod rewrite

# 3. Faritana ny toerana hiasana
WORKDIR /var/www/html

# 4. Mametraka ny Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Adikao ny rakitra rehetra avy amin'ny solosainao
COPY . .

# 6. Mametraka ny Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# 7. Omeo alalana ny folder storage sy cache (Permissions)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 8. Configure Apache Document Root ho any amin'ny /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# 9. MANERY AN'I APACHE HAMAKY NY PORT OMEN'I RENDER (TENA ILAY IZAO)
# Ity baiko ity dia manolo ny "80" ho lasa "$PORT" ao amin'ny config an'ny Apache
RUN sed -i 's/Listen 10000/Listen 80/g' /etc/apache2/ports.conf && \
    sed -i 's/:10000/:80/g' /etc/apache2/sites-available/000-default.conf

# 10. Mamoaka ny port 10000 (standard ao amin'ny Render)
EXPOSE 80

# 11. Manomboka ny Migration sy ny Apache
# Ampiasaina ny "sh -c" mba hahafahan'ny Docker mamaky ny variable $PORT amin'ny fotoana hanombohany
CMD sh -c "php artisan migrate --force && apache2-foreground"