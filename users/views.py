# Импортируем необходимые модули
import asyncio

import telegram
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView
from OnlineStore.settings import TELEGRAM_CHAT_ID, TELEGRAM_TOKEN
from checkout.models import Order
from .forms import CreationForm, FeedbackForm
from .models import Feedback


@login_required
def user_orders(request):
    """
    Представление для отображения списка заказов пользователя.
    Декоратор @login_required требует аутентификации пользователя.
    """
    orders = Order.objects.filter(
        user=request.user)  # Получаем заказы текущего пользователя
    context = {
        "orders": orders,  # Передаем заказы в контекст шаблона
    }
    return render(request, "users/user_orders.html",
                  context)  # Отображаем шаблон user_orders.html с контекстом


@login_required
def profile(request):
    """
    Представление для отображения профиля пользователя.
    Декоратор @login_required требует аутентификации пользователя.
    """
    return render(request,
                  "users/profile.html")  # Отображаем шаблон profile.html


class SignUp(CreateView):
    """
    Класс-представление для регистрации нового пользователя.
    Использует форму CreationForm.
    """

    form_class = CreationForm  # Форма для регистрации
    success_url = reverse_lazy(
        "store:home")  # URL для перенаправления после успешной регистрации
    template_name = "users/signup.html"  # Шаблон для отображения формы регистрации


async def send_telegram_message(message):
    """
    Асинхронная функция для отправки сообщения в Telegram.
    """
    bot = telegram.Bot(
        token=TELEGRAM_TOKEN)  # Создаем экземпляр бота с указанным токеном
    chat_id = TELEGRAM_CHAT_ID  # ID чата, куда будет отправлено сообщение
    # Отправляем сообщение в чат
    await bot.send_message(chat_id=chat_id, text=message)


def feedback_processing(request):
    """
    Представление для приема и обработки обратной связи от пользователей.
    """
    if request.method == "POST":  # Проверяем, что запрос был методом POST
        form = FeedbackForm(request.POST)  # Заполняем форму данными из запроса
        if form.is_valid():  # Проверяем, что форма валидна
            feedback = Feedback(
                feedback_name=form.cleaned_data["feedback_name"],
                feedback_email=form.cleaned_data["feedback_email"],
                feedback_message=form.cleaned_data["feedback_message"],
            )
            feedback.save()  # Сохраняем данные обратной связи в базе данных

            # Отправляем сообщение в Telegram
            message = f"Новое сообщение от {feedback.feedback_name} ({feedback.feedback_email}): {feedback.feedback_message}"
            asyncio.run(send_telegram_message(
                message))  # Асинхронно отправляем сообщение

            return render(request, "users/feedback_success.html"
                          )  # Отображаем шаблон успешной отправки
    return render(
        request, "users/feedback_failed.html"
    )  # Отображаем шаблон неудачной отправки, если что-то пошло не так
