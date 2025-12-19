#!/bin/sh

# Wait for database to be ready (optional, but good practice)
# You might want to use a tool like wait-for-it or netcat here if needed.
# For now, we assume the DB is ready or Django will retry.

echo "Applying database migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
exec python manage.py runserver 0.0.0.0:8000
