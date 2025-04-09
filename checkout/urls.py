# Импортируем функцию path для создания URL-адресов
from django.urls import path
# Импортируем представления из текущего приложения
from .views import checkout, create_order, thank_you

# Устанавливаем пространство имен для приложения
app_name = 'checkout'

# Определяем список URL-адресов
urlpatterns = [
    path('', checkout, name='checkout'),                              # Страница оформления заказа
    path('create-order/', create_order, name='create_order'),         # Создание нового заказа
    path('thank-you/<int:order_id>/', thank_you, name='thank_you'),   # Страница благодарности с номером заказа
]
