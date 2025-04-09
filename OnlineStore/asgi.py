# Импортируем модуль операционной системы
import os

# Импортируем функцию для получения ASGI-приложения Django
from django.core.asgi import get_asgi_application

# Устанавливаем значение переменной окружения 'DJANGO_SETTINGS_MODULE' на
# 'OnlineStore.settings'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "OnlineStore.settings")

# Получаем ASGI-приложение Django и присваиваем его переменной application
application = get_asgi_application()
