# Импортируем функцию path для создания URL-адресов
from django.urls import path
# Импортируем представления из текущего приложения
from .views import add_to_cart, cart, delete_cart_item, update_cart_item, update_cart_item_form

# Устанавливаем пространство имен для приложения
app_name = 'cart'

# Определяем список URL-адресов
urlpatterns = [
    path('', cart, name='cart'),                                                             # URL для отображения корзины
    path('add/<slug:item_slug>/', add_to_cart, name='add_to_cart'),                          # URL для добавления товара в корзину
    path('delete/<slug:item_slug>/', delete_cart_item, name='delete_cart_item'),             # URL для удаления товара из корзины
    path('update_cart_item/', update_cart_item, name='update_cart_item'),                    # URL для обновления количества товара в корзине через AJAX
    path('update/<int:cart_item_id>/', update_cart_item_form, name='update_cart_item_form'), # URL для формы обновления количества товара
]
