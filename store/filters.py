from django.db.models import F
from django_filters import rest_framework as filters
from .models import Item


class ItemFilter(filters.FilterSet):
    min_price = filters.NumberFilter(
        field_name='price',
        lookup_expr='gte',
        label="Минимальная цена")
    max_price = filters.NumberFilter(
        field_name='price',
        lookup_expr='lte',
        label="Максимальная цена")
    tags = filters.CharFilter(
        field_name='tags__name',
        lookup_expr='in',
        label="Теги",
        method='filter_by_tags')
    discounted = filters.BooleanFilter(
        method='filter_discounted',
        label="Товары со скидкой")
    is_available = filters.BooleanFilter(
        field_name='is_available',
        label="Доступность")
    start_date = filters.DateFilter(
        field_name='pub_date',
        lookup_expr='gte',
        label="Начальная дата")
    end_date = filters.DateFilter(
        field_name='pub_date',
        lookup_expr='lte',
        label="Конечная дата")

    def filter_by_tags(self, queryset, name, value):
        """
        Фильтрация товаров на основе переданных тегов
        """
        tag_list = value.split(',')
        return queryset.filter(tags__name__in=tag_list).distinct()

    def filter_discounted(self, queryset, name, value):
        """
        Фильтрация товаров только со скидкой
        """
        if value:
            return queryset.filter(price__lt=F('old_price'))
        return queryset

    class Meta:
        model = Item
        fields = [
            'min_price',
            'max_price',
            'tags',
            'discounted',
            'is_available',
            'start_date',
            'end_date'
        ]
