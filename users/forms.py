from django import forms  # Импортируем модуль форм Django
from django.contrib.auth import (
    get_user_model, )  # Импортируем функцию для получения модели пользователя
from django.contrib.auth.forms import (
    UserCreationForm, )  # Импортируем стандартную форму создания пользователя
from .models import Feedback  # Импортируем модель Feedback из текущего приложения

User = (
    get_user_model()
)  # Получаем текущую модель пользователя, которая может быть заменена в проекте


class CreationForm(UserCreationForm):
    """Форма для создания нового пользователя."""

    class Meta(UserCreationForm.Meta):
        model = User  # Указываем модель пользователя для этой формы
        fields = (
            "first_name",
            "last_name",
            "username",
            "email",
        )  # Указываем поля, которые будут отображаться в форме


class FeedbackForm(forms.ModelForm):
    """Форма для обратной связи покупателя."""

    class Meta:
        model = Feedback  # Указываем модель Feedback для этой формы
        fields = [
            "feedback_name",
            "feedback_email",
            "feedback_message",
        ]  # Указываем поля, которые будут отображаться в форме
