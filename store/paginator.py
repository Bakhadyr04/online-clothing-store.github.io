from django.core.paginator import Paginator  # Импорт класса Paginator из модуля django.core.paginator

def paginator(request, items, items_on_page):
    """
    Функция для создания объекта Paginator и получения запрошенной страницы
    """
    paginator_for_items = Paginator(items, items_on_page)  # Создание объекта Paginator для списка items
    page_number = request.GET.get('page')  # Получение номера страницы из параметров GET запроса 'page'

    return paginator_for_items.get_page(page_number)  # Возвращает объект Page для запрошенной страницы
