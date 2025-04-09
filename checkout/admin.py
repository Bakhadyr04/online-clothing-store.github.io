from django.contrib import admin
from .models import Order, OrderItem, ShippingAddress

# Класс для настройки административного интерфейса модели Order
class OrderAdmin(admin.ModelAdmin):
    # Отображаемые поля в списке объектов модели Order
    list_display = ('user', 'created_at', 'shipping_address', 'status',
                    'order_items', 'payment_method', 'total_price_field',)
    # Фильтры для списка объектов модели Order
    list_filter = ('status', 'payment_method',)
    # Поля для поиска объектов модели Order
    search_fields = ('user__username', 'shipping_address__first_name', 'shipping_address__last_name',)
    # Иерархия по дате создания объектов модели Order
    date_hierarchy = 'created_at'

    # Метод для отображения списка товаров в заказе
    def order_items(self, obj):
        return [o for o in obj.items.all()]

    # Метод для отображения общей стоимости заказа
    def total_price_field(self, obj):
        return obj.total_price

    # Настройка названия для поля общей стоимости
    total_price_field.short_description = 'Общая цена'
    # Настройка названия для поля списка товаров
    order_items.short_description = 'Список товаров'

# Класс для настройки административного интерфейса модели OrderItem
class OrderItemAdmin(admin.ModelAdmin):
    # Отображаемые поля в списке объектов модели OrderItem
    list_display = ('item', 'order', 'quantity', 'total_price_field',)
    # Фильтры для списка объектов модели OrderItem
    list_filter = ('order__status',)
    # Поля для поиска объектов модели OrderItem
    search_fields = ('item__title', 'order__user__username',)

    # Метод для отображения общей стоимости позиции товара в заказе
    def total_price_field(self, obj):
        return obj.total_price

    # Настройка названия для поля общей стоимости
    total_price_field.short_description = 'Общая цена'

# Класс для настройки административного интерфейса модели ShippingAddress
class ShippingAddressAdmin(admin.ModelAdmin):
    # Отображаемые поля в списке объектов модели ShippingAddress
    list_display = ('id', 'first_name', 'last_name', 'email',
                    'phone', 'address_line_1', 'address_line_2',)
    # Поля для поиска объектов модели ShippingAddress
    search_fields = ('first_name', 'last_name', 'email',)

# Регистрация моделей и их административных интерфейсов
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShippingAddress, ShippingAddressAdmin)
