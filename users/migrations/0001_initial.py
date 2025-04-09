# Сгенерировано Django 3.2.10 2024-06-16 14:58

from django.db import migrations, models


class Migration(migrations.Migration):
    # Информация о миграции
    initial = True

    # Зависимости миграции (в данном случае отсутствуют)
    dependencies = []

    # Операции, которые должны быть выполнены при применении миграции
    operations = [
        migrations.CreateModel(
            name="Feedback",  # Название создаваемой модели
            fields=[  # Определение полей модели
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                # Поле ID с автоинкрементом
                (
                    "feedback_name",
                    models.CharField(max_length=50,
                                     verbose_name="Имя покупателя"),
                ),
                # Поле с именем покупателя
                (
                    "feedback_email",
                    models.EmailField(max_length=254,
                                      verbose_name="Почта покупателя"),
                ),
                # Поле с почтой покупателя
                (
                    "feedback_message",
                    models.TextField(verbose_name="Текст"),
                ),  # Поле с текстом обратной связи
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True,
                                         verbose_name="Дата создания"),
                ),
                # Поле с датой создания (автоматически добавляемая при создании
                # записи)
            ],
            options={  # Дополнительные настройки модели
                "verbose_name":
                "Обратная связь покупателя",  # Одиночное название модели
                "verbose_name_plural":
                "Обратная связь покупателя",  # Множественное название модели
            },
        ),
    ]
