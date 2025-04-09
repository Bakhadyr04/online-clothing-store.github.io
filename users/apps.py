# Импортируем базовый класс AppConfig из django.apps
from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    # Определяем тип автоматического поля для моделей по умолчанию
    # В данном случае используется BigAutoField, подходящий для больших баз
    # данных

    name = "users"
    # Указываем имя текущего приложения, как оно задано в INSTALLED_APPS в
    # файле settings.py

    verbose_name = "Пользователи"
    # Устанавливаем имя для приложения, которое будет отображаться в административной панели
    # Это имя будет использовано для обозначения приложения в административном
    # интерфейсе Django
