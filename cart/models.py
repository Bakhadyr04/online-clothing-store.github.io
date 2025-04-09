# Импортируем модель пользователя из Django
from django.contrib.auth.models import User

# Импортируем модуль models из Django
from django.db import models

# Импортируем модель Item из приложения store
from store.models import Item


# Определяем модель Cart для представления корзины пользователя
class Cart(models.Model):
    # Поле user связывает корзину с пользователем
    user = models.ForeignKey(
        User,  # Указывает на модель User
        on_delete=models.CASCADE,  # Удаление корзины при удалении пользователя
        related_name="carts",  # Устанавливает имя обратной связи
        verbose_name="Покупатель",  # Имя поля
    )
    # Поле items связано с Item через промежуточную модель CartItem
    items = models.ManyToManyField(  # <--- M2M-поле
        Item,  # Указывает на модель Item
        through="CartItem",  # Указывает промежуточную модель CartItem
        through_fields=("cart", "item"),  # Устанавливает поля для связи
        related_name="carts",  # Устанавливает имя обратной связи
        verbose_name="Товары",  # Имя поля
    )
    # Поле для хранения даты создания корзины
    created_at = models.DateTimeField(auto_now_add=True,
                                      verbose_name="Дата создания")

    # Метаданные модели
    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"

    # Свойство для расчета общей стоимости корзины
    @property
    def total_price(self):
        return sum(cart_item.total_price
                   for cart_item in self.cart_items.all())

    # Метод для пересчета общей стоимости корзины
    # def recalculate_total_price(self):
    #     self.total_price = sum(cart_item.total_price for cart_item in self.cart_items.all())
    #     self.save()

    # Метод для строкового представления корзины
    def __str__(self):
        return f"Cart {self.id} for {self.user.username}"

    # Метод для очистки корзины
    def clear(self):
        self.cart_items.all().delete(
        )  # Удаляет все записи CartItem для данной корзины
        self.items.clear()


# Определяем модель CartItem для представления товара в корзине
class CartItem(models.Model):
    # Поле cart связывает товар с корзиной
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="cart_items",
        verbose_name="Корзина",
    )
    # Поле item связывает товар с моделью Item
    item = models.ForeignKey(Item,
                             on_delete=models.CASCADE,
                             verbose_name="Товар")
    # Поле quantity хранит количество данного товара в корзине
    quantity = models.PositiveIntegerField(default=1,
                                           verbose_name="Количество")

    # Метаданные модели
    class Meta:
        verbose_name = "Товар в корзине"
        verbose_name_plural = "Товары в корзине"

    # Свойство для расчета стоимости данной позиции в корзине
    @property
    def total_price(self):
        return self.quantity * self.item.price

    # Метод для строкового представления товара в корзине
    def __str__(self):
        return f"{self.quantity} x {self.item.title}"
