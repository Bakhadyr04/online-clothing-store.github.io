# Импортируем модуль админки из django
from django.contrib import admin
# Импортируем модели Cart и CartItem из текущего приложения
from .models import Cart, CartItem


# Определяем класс CartItemInline для включения связанных объектов CartItem в админке
class CartItemInline(admin.TabularInline):
    # Указываем модель CartItem
    model = CartItem
    # Указываем количество пустых форм для добавления новых CartItem
    extra = 1


# Декоратор для настройки отображения методов
@admin.display(description='Общая цена')                                                    # 5
# Определяем функцию total_price_field для отображения общей цены корзины
def total_price_field(obj):
    return obj.total_price


# Декоратор для настройки отображения методов
@admin.display(description='Список товаров')                                                # 5
# Определяем функцию cart_items_list для отображения списка товаров в корзине
def cart_items_list(obj):
    return [f"{item.quantity} x {item.item.title}" for item in obj.cart_items.all()]


# Определяем класс CartItemAdmin для настройки отображения модели CartItem в админке
class CartItemAdmin(admin.ModelAdmin):
    # Настройка для отображения полей в списке объектов
    list_display = ('item', 'cart', 'quantity', 'total_price_field')                       # 1
    # Настройка для полей поиска
    search_fields = ('item__title', 'cart__user__username')                                # 11
    # Настройка для фильтрации объектов
    list_filter = ('item', 'cart__user')                                                   # 2
    # Настройка для использования полей в виде ID вместо выбора из списка
    raw_id_fields = ('item', 'cart')                                                       # 9
    # Настройка для указания полей только для чтения
    readonly_fields = ('total_price_field',)                                               # 10

    # Определяем метод для отображения общей цены позиции в корзине
    def total_price_field(self, obj):
        return obj.total_price

    # Настройка для описания метода в списке
    total_price_field.short_description = 'Общая цена'                                      # 6


# Определяем класс CartAdmin для настройки отображения модели Cart в админке
class CartAdmin(admin.ModelAdmin):
    # Настройка для отображения полей в списке объектов
    list_display = ('user', 'created_at', 'cart_items_list', 'total_price_field')           # 1
    # Настройка для фильтрации объектов
    list_filter = ('created_at',)                                                           # 2
    # Настройка для полей поиска
    search_fields = ('user__username', 'user__email', 'created_at')                         # 11
    # Настройка для указания полей только для чтения
    readonly_fields = ('total_price',)                                                      # 10
    # Настройка для навигации по датам
    date_hierarchy = 'created_at'                                                           # 4
    # Настройка для указания полей, которые будут ссылками на редактирование
    list_display_links = ('user',)                                                          # 8
    # Настройка для использования полей в виде ID вместо выбора из списка
    raw_id_fields = ('user',)                                                               # 9
    # Настройка для включения связанных объектов CartItem в админке
    inlines = [CartItemInline]                                                              # 3
    # Настройка для отображения М2М полей в виде горизонтальных фильтров
    #filter_horizontal = ('cart_items',)                                    # 7

    # Определяем метод для отображения списка товаров в корзине
    def cart_items_list(self, obj):
        return [f"{item.quantity} x {item.item.title}" for item in obj.cart_items.all()]

    # Определяем метод для отображения общей цены корзины
    def total_price_field(self, obj):
        return obj.total_price

    # Настройка для описания метода в списке
    cart_items_list.short_description = 'Список товаров'                                    # 6
    # Настройка для описания метода в списке
    total_price_field.short_description = 'Общая цена'                                      # 6


# Регистрируем модели Cart и CartItem в админке с соответствующими классами настройки
admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem, CartItemAdmin)
