# Импортируем модуль администратора Django
import xlsxwriter
from django.contrib import admin
from django.http import HttpResponse
from django.utils.safestring import mark_safe
from import_export import resources
from import_export.admin import ExportMixin
from simple_history.admin import SimpleHistoryAdmin

# Импортируем модели Item и ItemTag из текущего приложения
from .models import Item, ItemTag


# Создание кастомного ресурса для модели Item
class ItemResource(resources.ModelResource):
    def get_export_queryset(self, queryset, *args, **kwargs):
        """
        1. Метод для фильтрации данных перед экспортом
        """
        # Здесь можно фильтровать, например, показывать только доступные товары
        return queryset.filter(is_available=True)

    def dehydrate_price(self, item):
        """
        2. Метод для кастомизации поля при экспорте
        """
        # Преобразуем цену в формат с двумя знаками после запятой
        return f"${item.price:.2f}"

    def dehydrate_is_available(self, item):
        """
        3. Метод для создания динамического поля
        """
        # Возвращаем текстовое значение вместо True/False
        return "В наличии" if item.is_available else "Нет в наличии"

    class Meta:
        model = Item
        fields = ('title', 'price', 'is_available', 'description')  # Указываем нужные поля


# Класс для настройки административного интерфейса модели Item
class ItemAdmin(ExportMixin, SimpleHistoryAdmin):
    resource_class = ItemResource  # Подключаем ресурс для экспорта
    # Определяем, какие поля будут отображаться в списке записей
    list_display = ('title', 'image_preview', 'short_description', 'slug', 'price',
                    'old_price', 'is_available', 'tag_list',)
    # Поля, по которым можно выполнить поиск
    search_fields = ('title', 'description', 'tags__name',)
    # Фильтры для списка записей
    list_filter = ('is_available', 'tags',)
    # Предоставляет более гибкую настройку и позволяет группировать поля
    # в разделы с заголовками и дополнительными настройками
    fieldsets = (
        ('Товар и описание', {
            'fields': ('title', 'image', 'description', 'slug')
        }),
        ('Цены и доступность', {
            'fields': ('price', 'old_price', 'is_available', 'tags')
        }),
    )
    list_per_page = 5 # Количество товаров на странице в админке

    def image_preview(self, obj):
        """
        Метод для отображения изображения в админке
        """
        if obj.image:
            return mark_safe(
                # mark_safe позволяет Django интерпретировать HTML
                f'<img src="{obj.image.url}" width="80" />')
        return 'No Image'

    image_preview.short_description = 'Изображение'  # Подпись колонки

    def short_description(self, obj):
        """
        Метод для вывода сокращенного описания, если оно длиннее 100 символов
        """
        if len(obj.description) > 100:
            return obj.description[:100] + '...'
        else:
            return obj.description

    # def get_queryset(self, request):
    #     return super().get_queryset(request).prefetch_related('tags')

    def get_queryset(self, request):
        """
        Метод для получения запроса с предварительной загрузкой тегов
        """
        qs = super().get_queryset(request)
        return qs.filter(is_available=True)

    def tag_list(self, obj):
        """
        Метод для вывода списка категорий (тегов), связанных с товаром
        """
        return u", ".join(o.name for o in obj.tags.all())

    # Настройка отображения названий колонок в административной панели
    short_description.short_description = 'Описание'
    tag_list.short_description = 'Список категорий'


# Класс для настройки административного интерфейса модели ItemTag
class ItemTagAdmin(admin.ModelAdmin):
    # Определяем, какие поля будут отображаться в списке записей
    list_display = ('name', 'slug', 'short_description', 'item_list',)

    def short_description(self, obj):
        """
        Метод для вывода сокращенного описания, если оно длиннее 100 символов
        """
        if len(obj.description) > 100:
            return obj.description[:100] + '...'
        else:
            return obj.description

    def item_list(self, obj):
        """
        Метод для вывода списка товаров, связанных с тегом
        """
        return [Item.objects.get(pk=o.get('object_id')) for o in obj.items.values()]

    # Настройка отображения названий колонок в административной панели
    short_description.short_description = 'Описание'
    item_list.short_description = 'Список товаров'


# Регистрация моделей с настройками административного интерфейса
admin.site.register(Item, ItemAdmin)
admin.site.register(ItemTag, ItemTagAdmin)


def export_as_xlsx(self, queryset=None):
    """
    Переопределяем экспорт в XLSX
    """

    # Создаем HTTP-ответ с контентом типа XLSX
    response = HttpResponse(content_type=
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    # Указываем, что файл будет скачан как XLSX
    response['Content-Disposition'] = 'attachment; filename="items.xlsx"'

    # Создаем книгу и лист
    workbook = xlsxwriter.Workbook(response)
    worksheet = workbook.add_worksheet()

    # Получаем данные для экспорта
    dataset = self.export(queryset=queryset)

    # Записываем заголовки
    for col_num, header in enumerate(dataset.headers):
        worksheet.write(0, col_num, header)

    # Записываем данные
    for row_num, row in enumerate(dataset.dict, start=1):
        for col_num, value in enumerate(row.values()):
            worksheet.write(row_num, col_num, value)

    workbook.close()

    return response
