# Импортируем TemplateView из модуля django.views.generic.base
from django.views.generic.base import TemplateView


# Определяем класс AboutAuthorView, который наследуется от TemplateView
class AboutAuthorView(TemplateView):
    # Указываем путь к шаблону, который будет использоваться для отображения
    # информации об авторе
    template_name = "about/author.html"


# Определяем класс AboutProjectView, который также наследуется от TemplateView
class AboutProjectView(TemplateView):
    # Указываем путь к шаблону, который будет использоваться для отображения
    # информации о проекте
    template_name = "about/project.html"
