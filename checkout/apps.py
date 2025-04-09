from django.apps import AppConfig


# Конфигурация приложения Checkout
class CheckoutConfig(AppConfig):
    # Использование BigAutoField для автоматического поля первичного ключа
    default_auto_field = "django.db.models.BigAutoField"
    # Название приложения
    name = "checkout"
    # Название приложения для отображения в административной панели Django
    verbose_name = "Оформление заказа"
