# Импортируем класс AppConfig из django.apps
from django.apps import AppConfig


# Определяем конфигурационный класс CartConfig для приложения 'cart'
class CartConfig(AppConfig):
    # Указываем тип поля по умолчанию для автоинкрементных полей модели
    default_auto_field = "django.db.models.BigAutoField"
    # Указываем имя приложения
    name = "cart"
    # Указываем имя приложения для административной панели
    verbose_name = "Корзина"
