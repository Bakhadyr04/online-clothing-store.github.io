# Импортируем модуль операционной системы
import os

# Импортируем функцию для получения WSGI-приложения Django
from django.core.wsgi import get_wsgi_application

# Устанавливаем переменную окружения для настроек Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "OnlineStore.settings")

# Получаем WSGI-приложение для запуска веб-сервера
application = get_wsgi_application()
