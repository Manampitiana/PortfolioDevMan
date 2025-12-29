# 1️⃣ Base image
FROM php:8.2-apache

# 2️⃣ Install system dependencies & PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev unzip git curl libpng-dev libonig-dev libxml2-dev \
 && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# 3️⃣ Enable Apache rewrite
RUN a2enmod rewrite

# 4️⃣ Allow .htaccess overrides
RUN printf "<Directory /var/www/html/public>\n\
AllowOverride All\n\
Require all granted\n\
</Directory>\n" >> /etc/apache2/apache2.conf

# 5️⃣ Set working directory
WORKDIR /var/www/html

# 6️⃣ Copy Composer from official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 7️⃣ Copy project files
COPY . .

# 8️⃣ Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# 9️⃣ Setup permissions for storage & cache
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 777 storage bootstrap/cache

# 10️⃣ Copy default images (logo/favicons) to storage/public
RUN mkdir -p storage/app/public \
 && cp -r storage/images/* storage/app/public/ \
 && chown -R www-data:www-data storage/app/public

# 11️⃣ Configure Apache DocumentRoot
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# 12️⃣ Change listening port to match Render
ENV PORT=10000
RUN sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf \
 && sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf
EXPOSE ${PORT}

# 13️⃣ Run Laravel commands, create storage link, migrate & seed DB, start Apache
CMD php artisan config:clear \
 && php artisan route:clear \
 && php artisan view:clear \
 && php artisan storage:link || true \
 && php artisan migrate --force \
 && php artisan db:seed --class=AdminSeeder --force \
 && apache2-foreground
