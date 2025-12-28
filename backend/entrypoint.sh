#!/bin/bash

# 1. Ovaina ny port an'ny Apache ho lasa izay omen'ny Render ($PORT)
sed -i "s/80/${PORT}/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# 2. Alefaso ny migration
php artisan migrate --force

# 3. Alefaso ny Apache
apache2-foreground