#!/bin/sh
set -e

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Creating superuser (if needed)..."
python manage.py createsuperuser \
  --noinput \
  --username "$DJANGO_SUPERUSER_USERNAME" \
  --email "$DJANGO_SUPERUSER_EMAIL" || true

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

echo "Starting server..."
python manage.py runserver 0.0.0.0:8000
