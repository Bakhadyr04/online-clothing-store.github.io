# Импортируем необходимые представления из django.contrib.auth.views
from django.contrib.auth.views import (
    LoginView,
    LogoutView,
    PasswordChangeDoneView,
    PasswordChangeView,
    PasswordResetCompleteView,
    PasswordResetConfirmView,
    PasswordResetDoneView,
    PasswordResetView,
)

# Импортируем path и reverse_lazy из django.urls для работы с URL и
# отложенными URL-обратками
from django.urls import path, reverse_lazy

# Импортируем пользовательские представления из текущего приложения
from .views import SignUp, feedback_processing, profile, user_orders

# Указываем пространство имен для приложения, чтобы отличать URL разных
# приложений
app_name = "users"

# Определяем список URL-шаблонов для текущего приложения
urlpatterns = [
    # URL для просмотра заказов пользователя, связанный с представлением
    # user_orders
    path("orders/", user_orders, name="user_orders"),
    # URL для просмотра профиля пользователя, связанный с представлением
    # profile
    path("profile/", profile, name="profile"),
    # URL для обработки обратной связи, связанный с представлением
    # feedback_processing
    path("feedback-processing/",
         feedback_processing,
         name="feedback_processing"),
    # URL для выхода из системы, использующий стандартное представление
    # LogoutView
    path(
        "auth/logout/",
        LogoutView.as_view(template_name="users/logged_out.html"
                           ),  # Указываем шаблон для отображения после выхода
        name="logout",
    ),
    # URL для регистрации нового пользователя, связанный с представлением
    # SignUp
    path("auth/signup/", SignUp.as_view(), name="signup"),
    # URL для входа в систему, использующий стандартное представление LoginView
    path(
        "auth/login/",
        LoginView.as_view(template_name="users/login.html"
                          ),  # Указываем шаблон для отображения формы входа
        name="login",
    ),
    # URL для сброса пароля, использующий стандартное представление
    # PasswordResetView
    path(
        "auth/password_reset/",
        PasswordResetView.as_view(
            # Шаблон для формы сброса пароля
            template_name="users/managment/password_reset_form.html",
            # Шаблон для email сброса пароля
            email_template_name="users/managment/password_reset_email.html",
            success_url=reverse_lazy(
                "users:password_reset_done"
            ),  # URL для перенаправления после успешного сброса
        ),
        name="password_reset_form",
    ),
    # URL для подтверждения сброса пароля, использующий стандартное
    # представление PasswordResetDoneView
    path(
        "auth/password_reset/done/",
        PasswordResetDoneView.as_view(
            # Шаблон для отображения после отправки email
            template_name="users/managment/password_reset_done.html"),
        name="password_reset_done",
    ),
    # URL для завершения сброса пароля, использующий стандартное представление
    # PasswordResetCompleteView
    path(
        "auth/reset/done/",
        PasswordResetCompleteView.as_view(
            # Шаблон для отображения после успешного сброса
            template_name="users/managment/reset_done.html"),
        name="reset_done",
    ),
    # URL для подтверждения сброса пароля, использующий стандартное
    # представление PasswordResetConfirmView
    path(
        "auth/password_reset_confirm/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(
            # Шаблон для формы подтверждения сброса
            template_name="users/managment/password_reset_confirm.html",
            success_url=reverse_lazy(
                "users:password_reset_complete"
            ),  # URL для перенаправления после подтверждения
        ),
        name="password_reset_confirm",
    ),
    # URL для изменения пароля, использующий стандартное представление
    # PasswordChangeView
    path(
        "auth/password_change/",
        PasswordChangeView.as_view(
            # Шаблон для формы изменения пароля
            template_name="users/managment/password_change_form.html",
            success_url=reverse_lazy(
                "users:password_change_done"
            ),  # URL для перенаправления после изменения
        ),
        name="password_change",
    ),
    # URL для подтверждения изменения пароля, использующий стандартное
    # представление PasswordChangeDoneView
    path(
        "auth/password_change/done/",
        PasswordChangeDoneView.as_view(
            # Шаблон для отображения после изменения
            template_name="users/managment/password_change_done.html"),
        name="password_change_done",
    ),
]
