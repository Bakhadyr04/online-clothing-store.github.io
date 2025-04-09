# Импортируем класс AppConfig из модуля django.apps
from django.apps import AppConfig


# Создаем класс StoreConfig, который наследуется от AppConfig
class StoreConfig(AppConfig):
    # Указываем тип автополя для моделей
    default_auto_field = "django.db.models.BigAutoField"
    # Указываем имя приложения
    name = "store"
    # Устанавливаем имя для приложения, которое будет отображаться в
    # административной панели Django
    verbose_name = "Магазин"

    def ready(self):
        pass
