# 1️⃣ Base image
FROM php:8.2-apache

# 2️⃣ Install system dependencies & PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
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

# 6️⃣ Copy Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 7️⃣ Copy project files
COPY . .

# 8️⃣ Install Laravel dependencies (including Cloudinary)
RUN composer install --no-dev --optimize-autoloader

# 9️⃣ Publish Cloudinary config
RUN php artisan vendor:publish --provider="CloudinaryLabs\CloudinaryLaravel\CloudinaryServiceProvider" || true

# 🔟 Setup permissions for storage & cache
RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache \
    storage/app/public \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 777 storage bootstrap/cache storage/app/public

# 🔹 Configure Apache DocumentRoot
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# 🔹 Change listening port (Render)
ENV PORT=10000
RUN sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf \
 && sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

EXPOSE ${PORT}

# 🔹 Laravel commands: clear cache, storage link, migrate, seed, start Apache
CMD php artisan config:clear \
 && php artisan route:clear \
 && php artisan view:clear \
 && php artisan storage:link || true \
 && php artisan migrate --force || true \
 && php artisan db:seed --class=AdminSeeder --force || true \
 && apache2-foreground