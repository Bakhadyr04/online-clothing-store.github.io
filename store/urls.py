from django.urls import path, include  # Импорт функции path из модуля django.urls
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, ItemTagViewSet, ItemQFilterView
from .views import item_details, store, tag_details, tag_list  # Импорт представлений (views) из текущего приложения
from . import views

app_name = 'store'  # Присвоение имени приложения для идентификации URL в шаблонах и представлениях

# Создание маршрутизатора
# Чтобы API работал, мы должны зарегистрировать эти viewsets в urls.py. Это делается через router:
router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'item-tags', ItemTagViewSet, basename='itemtag')
# router.register(r'items/qfilter', ItemQFilterView, basename='item_qfilter')

urlpatterns = [
    path('', store, name='home'),  # URL для главной страницы магазина, вызывает представление store
    #path('', include(router.urls)),  # Подключение роутера к urls
    path('api/', include(router.urls)),  # Добавление маршрутов API
    path('categories/', tag_list, name='tag_list'),  # URL для страницы со списком категорий, вызывает представление tag_list
    path('category-details/<slug:slug>/', tag_details, name='tag_details'),  # URL для страницы деталей категории по её slug, вызывает представление tag_details
    path('<slug:item_slug>/', item_details, name='item_details'),  # URL для страницы деталей товара по его slug, вызывает представление item_details
    path('api/items/qfilter', ItemQFilterView.as_view(), name='item_qfilter'),
    path('item/<slug:item_slug>/history/', views.item_history, name='item_history'),
]
