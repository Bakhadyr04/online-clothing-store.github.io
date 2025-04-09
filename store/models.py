# Импортируем модуль для работы с моделями Django
from django.db import models
from django.utils.text import slugify
# Импортируем функцию для локализации строковых данных
from django.utils.translation import gettext_lazy as _
# Импортируем менеджер для работы с тегами
from taggit.managers import TaggableManager
# Импортируем базовые классы для тегов
from taggit.models import GenericTaggedItemBase, TagBase

from django.contrib.auth.models import User
from django.utils import timezone

from simple_history.models import HistoricalRecords

from django.core.exceptions import ValidationError
import re


# Определяем модель тега товара
class ItemTag(TagBase):
    # Поле для изображения категории
    image = models.ImageField(
        upload_to='categories/',  # Путь для сохранения изображения
        verbose_name='Изображение',  # Имя поля
        blank=True  # Поле необязательно для заполнения
    )
    # Поле для описания категории
    description = models.TextField(
        blank=True,  # Поле необязательно для заполнения
        verbose_name='Описание',  # Имя поля
    )

    class Meta:
        verbose_name = _("Категория")  # Отображаемое имя в единственном числе
        verbose_name_plural = _("Категории")  # Отображаемое имя во множественном числе

# Определяем модель связи тега с товаром
class TaggedItem(GenericTaggedItemBase):
    # Внешний ключ на модель ItemTag с удалением зависимостей
    tag = models.ForeignKey(
        ItemTag,
        on_delete=models.CASCADE,
        related_name="items",  # Обратная связь для доступа к тегам через модель ItemTag
        verbose_name='Категория',  # Имя поля
    )

# Определяем модель товара
class Item(models.Model):
    title = models.CharField(max_length=200, verbose_name='Название')  # Название товара
    description = models.TextField(verbose_name='Описание')  # Описание товара
    slug = models.CharField(
        unique=True,  # Уникальное значение
        max_length=50,  # Максимальная длина
    )
    pub_date = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')  # Дата добавления товара
    price = models.DecimalField(
        max_digits=8,  # Максимальное количество цифр в числе
        decimal_places=2,  # Количество знаков после запятой
        verbose_name='Новая цена',  # Имя поля
    )
    old_price = models.DecimalField(
        max_digits=8,  # Максимальное количество цифр в числе
        decimal_places=2,  # Количество знаков после запятой
        verbose_name='Старая цена',  # Имя поля
        blank=True,  # Поле необязательно для заполнения
        null=True,  # Поле может содержать значение null
    )
    image = models.ImageField(
        verbose_name='Изображение',  # Имя поля
        upload_to='items/',  # Путь для сохранения изображения
        blank=True,  # Поле необязательно для заполнения
        default='path/to/default/image.jpg'
    )
    is_available = models.BooleanField(
        default=True,  # Значение по умолчанию
        verbose_name='Доступно',  # "Говорящее" имя поля
    )
    tags = TaggableManager(through=TaggedItem, related_name="tagged_items", verbose_name='Категории')  # Менеджер для работы с тегами
    history = HistoricalRecords()  # Добавляем историю изменений модели

    def clean(self):
        errors = {}

        # Проверка цены
        if self.price is not None and self.price <= 0:
            errors['price'] = 'Цена должна быть больше нуля.'

        # Проверка длины title
        if len(self.title) <= 3:
            errors['title'] = 'Название должно быть не менее 3 символов.'

        # Проверка длины description
        if len(self.description) <= 3:
            errors['description'] = 'Описание должно быть не менее 3 символов.'

        # Проверка символов в title
        if not re.match(r'^[a-zA-Zа-яА-Я0-9\s]+$', self.title):
            errors['title'] = 'Название должно содержать только буквы и цифры.'

        # Проверка символов в description
        if not re.match(r'^[a-zA-Zа-яА-Я0-9\s]+$', self.description):
            errors['description'] = 'Описание должно содержать только буквы и цифры.'

        # Если есть ошибки, выбрасываем исключение
        if errors:
            raise ValidationError(errors)


    def save(self, *args, **kwargs):
        self.full_clean()  # Вызываем валидацию перед сохранением объекта

        if not self.slug:
            self.slug = slugify(self.title)  # Генерация slug из названия товара

        super().save(*args, **kwargs)  # Вызов метода save родительского класса



    def __str__(self):
        return self.title  # Возвращает название товара при приведении к строке

    class Meta:
        ordering = ['-price']  # Сортировка товаров по убыванию цены
        verbose_name = 'Товар'  # Имя модели в единственном числе
        verbose_name_plural = 'Товары'  # Имя модели во множественном числе




#Создаем модель ChangeHistory для хранения информации об изменениях объектов

class ChangeHistory(models.Model):
    object_type = models.CharField(max_length=255)
    object_id = models.PositiveIntegerField()
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    change_type = models.CharField(max_length=50, choices=[('add', 'Add'), ('update', 'Update'), ('delete', 'Delete')])
    old_value = models.JSONField(null=True, blank=True)
    new_value = models.JSONField(null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.object_type} {self.change_type} at {self.timestamp}"
