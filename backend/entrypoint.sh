#!/bin/sh

# 1. Miandry kely ny DB ho vonona (optionnel)
echo "Running migrations..."
php artisan migrate --force

# 2. Manomboka ny Apache ao amin'ny foreground
echo "Starting Apache..."
exec apache2-foreground