from django.conf import settings  # Импортируем настройки Django
from django.conf.urls.static import (
    static, )  # Импортируем функцию static для обслуживания статических файлов
from django.contrib import admin  # Импортируем модуль администрирования Django
from django.urls import (
    include,
    path,
)  # Импортируем функции include и path для маршрутизации URL

urlpatterns = [
    path("admin/", admin.site.urls),  # URL для панели администратора Django
    path("cart/", include("cart.urls")),  # URL для приложения корзины
    path("about/", include("about.urls")),  # URL для страницы "О нас"
    path("checkout/", include("checkout.urls")),  # URL для оформления заказа
    path("users/", include("users.urls")),  # URL для пользовательских профилей
    path("", include("store.urls")),  # Основной URL для магазина
    path("", include("django.contrib.auth.urls")
         ),  # URL для авторизации и управления пользователями
    path("api/", include("store.api_urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT
                          )  # Добавляем URL для медиафайлов в режиме отладки
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT
    )  # Добавляем URL для статических файлов в режиме отладки
