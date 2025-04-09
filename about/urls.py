# Импортируем функцию path для определения маршрутов URL
from django.urls import path

# Импортируем представления из текущего пакета (папки)
from .views import AboutAuthorView, AboutProjectView

# Задаем пространство имен для URL, чтобы можно было ссылаться на них
# через app_name
app_name = "about"

# Определяем список маршрутов URL для приложения
urlpatterns = [
    # URL для страницы проекта. Связываем маршрут 'project/' с представлением AboutProjectView.
    # as_view() используется для создания экземпляра класса представления.
    path("project/", AboutProjectView.as_view(), name="about_project"),
    # URL для страницы автора. Связываем маршрут 'me/' с представлением
    # AboutAuthorView.
    path("me/", AboutAuthorView.as_view(), name="about_me"),
]
