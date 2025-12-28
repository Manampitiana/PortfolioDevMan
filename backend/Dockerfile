FROM php:8.2-apache

# 1. Install system dependencies (PostgreSQL sy fitaovana hafa)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql

# 2. Ampidiro ny Apache mod_rewrite (ilaina amin'ny Laravel routes)
RUN a2enmod rewrite

# 3. Set working directory
WORKDIR /var/www/html

# 4. Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Copy project files
COPY . .

# 6. Install dependencies (tsy misy dev tools)
RUN composer install --no-dev --optimize-autoloader

# 7. Omeo alalana ny folder storage sy cache (tena ilaina!)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 8. Configure Apache document root ho any amin'ny /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# 9. Expose port 80 (ny Render no hitantana ny port avy eo)
EXPOSE 80

# 10. Start Apache
CMD ["apache2-foreground"]