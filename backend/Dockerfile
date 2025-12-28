FROM php:8.2-apache

# 1. System dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev unzip git curl \
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

# 7. Permissions
RUN chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# 8. Apache document root config
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# 9. Omeo alalana handeha ny entrypoint.sh
RUN chmod +x entrypoint.sh

# 10. Start server mampiasa ny script
CMD ["./entrypoint.sh"]