from django.contrib import messages  # Импортируем функционал для работы с сообщениями пользователю
from django.contrib.auth.decorators import login_required  # Декоратор для требования аутентификации
from django.shortcuts import get_object_or_404, redirect, render  # Функции для работы с запросами и рендерингом

from cart.views import Cart  # Импортируем класс Cart из приложения корзины
from .forms import OrderCreateForm  # Импортируем форму создания заказа
from .models import Order, OrderItem, ShippingAddress  # Импортируем модели заказа, позиций заказа и адреса доставки


@login_required  # Требуем аутентификацию пользователя для доступа к этому представлению
def checkout(request):
    """
    Представление чекаута.
    Отображает страницу оформления заказа.
    """
    cart = Cart.objects.get(user=request.user)  # Получаем корзину текущего пользователя
    form = OrderCreateForm()  # Создаем форму для оформления заказа
    context = {'cart': cart, 'form': form}  # Формируем контекст для передачи в шаблон

    return render(request, 'checkout/checkout.html', context)  # Отображаем страницу оформления заказа


@login_required  # Требуем аутентификацию пользователя для доступа к этому представлению
def thank_you(request, order_id):
    """
    Страница благодарности за заказ.
    """
    order = get_object_or_404(Order, id=order_id, user=request.user)  # Получаем заказ пользователя по его ID
    return render(request, 'checkout/thank_you.html', {'order': order})  # Отображаем страницу благодарности


@login_required  # Требуем аутентификацию пользователя для доступа к этому представлению
def create_order(request):
    """
    Создание экземпляров Order и ShippingAddress из формы и редирект в профиль пользователя,
    либо передаем форму обратно.
    """
    cart = get_object_or_404(Cart, user=request.user)  # Получаем корзину текущего пользователя

    if cart.items.exists() and request.method == 'POST':  # Проверяем наличие товаров в корзине и метод запроса
        form = OrderCreateForm(request.POST)  # Инициализируем форму данными из POST запроса
        if form.is_valid():  # Проверяем валидность данных формы
            # Создаем заказ на основе данных из формы и текущего пользователя
            order = Order.objects.create(
                payment_method=form.cleaned_data['payment_method'],
                user=request.user,
            )

            # Создаем адрес доставки для заказа на основе данных из формы
            ShippingAddress.objects.create(
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name'],
                email=form.cleaned_data['email'],
                phone=form.cleaned_data['phone'],
                address_line_1=form.cleaned_data['address_line_1'],
                address_line_2=form.cleaned_data['address_line_2'],
                order=order,
            )

            # Создаем позиции заказа на основе товаров в корзине
            for cart_item in cart.cart_items.all():  # Используем cart_items для доступа к элементам корзины
                OrderItem.objects.create(
                    order=order,
                    item=cart_item.item,
                    quantity=cart_item.quantity,
                    price=cart_item.item.price
                )

            cart.clear()  # Очищаем корзину после создания заказа
            return redirect('checkout:thank_you', order_id=order.id)  # Перенаправляем на страницу благодарности
    else:
        form = OrderCreateForm()  # Инициализируем пустую форму, если условия не выполнены

    # Выводим сообщение об ошибке, если форма не валидна
    messages.warning(request, 'Форма не была корректно обработана, введите данные еще раз')

    context = {'form': form, 'cart': cart}  # Формируем контекст для передачи в шаблон
    return render(request, 'checkout/checkout.html', context)  # Отображаем страницу оформления заказа с формой
