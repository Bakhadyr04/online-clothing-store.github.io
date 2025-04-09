from django.contrib import admin
from .models import Feedback  # Импортируем модель Feedback из текущего приложения


class FeedbackAdmin(admin.ModelAdmin):
    list_display = (
        "feedback_name",
        "feedback_email",
        "feedback_message",
        "created_at",
    )
    # Определяем, какие поля отображать в админке на странице списка объектов модели
    # Это помогает администратору быстро увидеть основные данные по каждой
    # записи

    ordering = ("-created_at", )
    # Указываем порядок сортировки записей по полю created_at
    # Здесь используется "-" перед полем, чтобы сортировка была по убыванию
    # (от новых к старым)


admin.site.register(Feedback, FeedbackAdmin)
# Регистрируем модель Feedback в административной панели Django с использованием FeedbackAdmin
# Теперь модель Feedback будет доступна для управления через интерфейс
# администратора
