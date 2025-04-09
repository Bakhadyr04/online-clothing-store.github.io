from django.db import models  # Импортируем модуль моделей Django


class Feedback(models.Model):
    """Модель обратной связи покупателя."""

    feedback_name = models.CharField(
        max_length=50,
        verbose_name="Имя покупателя")  # Поле для имени покупателя
    feedback_email = models.EmailField(
        verbose_name="Почта покупателя"
    )  # Поле для электронной почты покупателя
    feedback_message = models.TextField(
        verbose_name="Текст")  # Поле для текста обратной связи
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания")  # Поле для даты создания записи

    class Meta:
        verbose_name = "Обратная связь покупателя"  # Отображаемое имя модели в админке
        # Множественное отображаемое имя модели в админке
        verbose_name_plural = "Обратная связь покупателя"

    def __str__(self):
        return self.feedback_message[:
                                     30]  # Возвращаем первые 30 символов текста обратной связи при преобразовании объекта в строку
