from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, ItemTagViewSet, ItemQFilterView

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'item-tags', ItemTagViewSet, basename='itemtag')

urlpatterns = [
    path('items/qfilter', ItemQFilterView.as_view(), name='item_qfilter'),
    path('', include(router.urls)),  # Добавление маршрутов API
]
