FROM php:8.2-apache

# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

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

# 7. Permissions (Tena ilaina mba hialana amin'ny Error 500)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# 8. Apache configuration
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# 9. Manamboatra ny Port mavitrika (Dynamic Port Binding)
# Ity script ity dia mandeha isaky ny manomboka ny container
RUN echo '#!/bin/bash\n\
sed -i "s/Listen 80/Listen ${PORT:-80}/g" /etc/apache2/ports.conf\n\
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT:-80}>/g" /etc/apache2/sites-available/000-default.conf\n\
php artisan migrate --force\n\
apache2-foreground' > /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

# 10. Expose port (izay napetraka ao amin'ny Render Dashboard)
EXPOSE 80

CMD ["/usr/local/bin/entrypoint.sh"]