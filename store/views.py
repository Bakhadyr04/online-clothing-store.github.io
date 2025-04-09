from django.db.models import Q, F
from django.shortcuts import get_object_or_404, render  # Импорт функций get_object_or_404 и render из django.shortcuts
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action

from .filters import ItemFilter
from .models import Item, ItemTag, ChangeHistory  # Импорт моделей Item и ItemTag из текущего приложения
from .paginator import paginator  # Импорт функции paginator из файла paginator.py

from .serializers import ItemTagSerializer, ItemSerializer


def store(request):
    """
    Представление для главной страницы магазина. Отображает список доступных товаров с пагинацией
    """
    items = Item.objects.filter(is_available=True)  # Получение списка доступных товаров
    context = {
        'page_obj': paginator(request, items, 9),  # Пагинация списка товаров по 9 на странице
        'range': [*range(1, 7)],  # Для случайных CSS стилей, создание списка чисел от 1 до 6
    }
    return render(request, 'store/main_page.html', context)  # Отображение главной страницы с контекстом


def item_details(request, item_slug):
    """
    Представление для страницы с деталями товара
    """
    item = get_object_or_404(Item, slug=item_slug)  # Получение объекта товара по его slug, или 404 если не найден
    context = {
        'item': item,  # Передача объекта товара в контекст
    }
    return render(request, 'store/item_details.html', context)  # Отображение страницы деталей товара


def tag_details(request, slug):
    """
    Представление для страницы с деталями категории (тега)
    """
    tag = get_object_or_404(ItemTag, slug=slug)  # Получение объекта категории (тега) по его slug, или 404 если не найден
    items = Item.objects.filter(tags__in=[tag])  # Получение товаров, относящихся к данной категории
    context = {
        'tag': tag,  # Передача объекта категории в контекст
        'page_obj': paginator(request, items, 3),  # Пагинация списка товаров по 3 на странице
    }
    return render(request, 'store/tag_details.html', context)  # Отображение страницы деталей категории


def tag_list(request):
    """
    Представление для страницы со списком всех категорий (тегов)
    """
    tags = ItemTag.objects.all()  # Получение всех категорий (тегов)
    context = {
        'page_obj': paginator(request, tags, 6),  # Пагинация списка категорий по 6 на странице
    }
    return render(request, 'store/tag_list.html', context)  # Отображение страницы со списком категорий


# Viewset для работы с категориями товара
class ItemTagViewSet(viewsets.ModelViewSet):
    queryset = ItemTag.objects.all()
    serializer_class = ItemTagSerializer    # Указываем сериализатор для модели ItemTag


# Viewset для работы с товарами
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer       # Указываем сериализатор для модели Item
    filter_backends = [DjangoFilterBackend]
    filterset_class = ItemFilter


    @action(methods=['GET'], detail=False) # detail=False работает с коллекцией объектов (на список), доступ без указания PK в URL
    def list_discounted_items(self, request):
        """
        Запрос для фильтрации товаров со скидкой
        """
        # Фильтруем товары, где цена меньше старой цены
        discounted_items = Item.objects.filter(price__lt=F('old_price'))
        '''
        F - объект, который используется для ссылки на поля модели внутри запросов
        Без F вам нужно было бы сначала получить значение одного поля, а затем сравнить его с другим полем.
        F позволяет делать это в самом запросе, на уровне базы данных.
        '''
        serializer = self.get_serializer(discounted_items, many=True)
        return Response(serializer.data)


    @action(methods=['POST'], detail=True) #detail=True работает с одним объектом, доступ через PK
    def update_item_price(self, request, pk=None):
        """
        Запрос для обновления цены товара
        """
        # Обновляем цену для конкретного товара
        item = self.get_object()
        price = request.data.get('price')

        # Валидация на правильность значения цены
        if price is None:
            return Response({'error': 'Цена не предоставлена'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            price = float(price)
            if price < 0:
                return Response({'error': 'Цена должна быть больше нуля'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error': 'Неверное значение цены'}, status=status.HTTP_400_BAD_REQUEST)

        item.price = price
        item.save()
        return Response({'status': 'Цена обновлена', 'price': price}, status=status.HTTP_200_OK)

class ItemQFilterView(APIView):
    def get(self, request, *args, **kwargs):
        """
        ?? Представление для фильтрации ??
        """
        items = Item.objects.filter(
            (Q(price__lt=5000) | Q(is_available=True)) & ~Q(old_price__isnull=True)
        )
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    '''
        Q — это объект из модуля django.db.models, который используется для создания сложных запросов в Django ORM.
        Он позволяет строить запросы с помощью логических операторов AND, OR и NOT (&, |, ~)
    '''

    # Запрос 1 с Q: товары, где:
    @action(methods=['GET'], detail=False)
    def filter_by_name_and_price(self, request):
        """
        Фильтрация товаров по названию и цене. А также исключение товаров
        """
        filtered_items = Item.objects.filter(
            (Q(title__startswith='Джинсы')) &  # Название начинается на 'Джинсы'
            (Q(price__lt=1500) | Q(price__gt=2500)) &  # Цена < 1500 или > 2500
            ~Q(price=F('old_price'))  # ~ Исключаем товары, у которых новая цена равна старой
        )
        serializer = self.get_serializer(filtered_items, many=True)
        return Response(serializer.data)

    # Запрос 2 с Q: товары, где:
    @action(methods=['GET'], detail=False)
    def filter_by_date_and_price_difference(self, request):
        """
        Фильтрация товаров по дате создания и разницей в цене. А также исключение товаров
        """
        filtered_items = Item.objects.filter(
            Q(pub_date__gte='2024-01-01') &  # Созданы после 2024-01-01
            Q(old_price__gt=F('price') + 400) &  # Разница между старой и новой ценой больше 400
            ~(
                    Q(title__startswith='Джинсы') |  # Исключаем товары, где название начинается на 'Джинсы'
                    Q(title__icontains='товар')  # Или название содержит 'товар'
            )
        )
        serializer = self.get_serializer(filtered_items, many=True)
        return Response(serializer.data)


# class ItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Item
#         fields = ['id', 'title', 'description', 'price', 'old_price', 'is_available', 'slug', 'pub_date', 'image']
#


# Представление для отображения истории изменений товара.
def item_history(request, item_slug):
    """
    Представление для отображения истории изменений товара
    """
    item = get_object_or_404(Item, slug=item_slug)
    history = ChangeHistory.objects.filter(object_type='Item', object_id=item.id).order_by('-timestamp')
    context = {
        'item': item,
        'history': history,
    }
    return render(request, 'store/item_history.html', context)






