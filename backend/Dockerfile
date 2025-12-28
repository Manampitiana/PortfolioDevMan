FROM php:8.2-apache

# 1. Mametraka ny fitaovana ilaina amin'ny rafitra (System dependencies)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# 2. Ampidiro ny Apache mod_rewrite (ilaina amin'ny Laravel routes)
RUN a2enmod rewrite

# 3. Faritana ny toerana hiasana
WORKDIR /var/www/html

# 4. Mametraka ny Composer (fitaovana fitantanana dependencies)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Adikao ny rakitra rehetra avy amin'ny solosainao
COPY . .

# 6. Mametraka ny Laravel dependencies (tsy misy dev tools)
RUN composer install --no-dev --optimize-autoloader

# 7. Omeo alalana ny folder storage sy cache (Permissions)
# Tena ilaina izany mba hialana amin'ny Error 500
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 8. Configure Apache Document Root ho any amin'ny /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# 9. Faritana ny Port hivoahan'ny serasera
EXPOSE 80

# 10. Manomboka ny Migration sy ny Apache
# Ny "apache2-foreground" no mitazona ny container ho velona
CMD php artisan migrate --force && apache2-foreground