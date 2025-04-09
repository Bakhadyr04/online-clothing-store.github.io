# Импортируем необходимые модули и функции из Django
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST
from store.models import Item  # Импортируем модель товара из приложения store
from .models import Cart, CartItem  # Импортируем модели корзины и элемента корзины из текущего приложения
from .forms import UpdateCartItemForm  # Импортируем форму для обновления элемента корзины


# Представление для вывода всех объектов товаров корзины и самой корзины
@login_required  # Декоратор для требования аутентификации пользователя
def cart(request):
    # Получаем корзину текущего пользователя
    cart = Cart.objects.filter(user=request.user).first()

    # Если у пользователя нет корзины, создаем новую
    if not cart:
        cart = Cart.objects.create(user=request.user)

    # Формируем контекст для передачи в шаблон
    context = {
        'cart_items': CartItem.objects.filter(cart=cart),  # Получаем все элементы корзины для текущей корзины
        'cart': cart  # Передаем объект корзины в контекст
    }

    # Отображаем шаблон cart.html с переданным контекстом
    return render(request, 'cart/cart.html', context)


 # Представление для добавления товара в корзину, либо увеличения его количества на 1
@login_required  # Декоратор для требования аутентификации пользователя
def add_to_cart(request, item_slug):
    # Получаем товар по его slug
    item = get_object_or_404(Item, slug=item_slug)

    # Получаем корзину пользователя или создаем новую, если её нет
    cart, _ = Cart.objects.get_or_create(user=request.user)

    # Получаем или создаем элемент корзины для данного товара
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        item=item
    )

    # Если элемент корзины не был создан заново, увеличиваем его количество на 1
    if not created:
        cart_item.quantity += 1
        cart_item.save()

    # Перенаправляем пользователя на страницу корзины
    return redirect('cart:cart')


 # Представление для удаления объекта товара в корзине
@login_required  # Декоратор для требования аутентификации пользователя
def delete_cart_item(request, item_slug):
    # Находим элемент корзины по товару и пользователю
    cart_item = CartItem.objects.get(
        cart=Cart.objects.get(user=request.user),
        item=get_object_or_404(Item, slug=item_slug)
    )

    # Удаляем элемент корзины
    cart_item.delete()

    # Перенаправляем пользователя на страницу корзины
    return redirect('cart:cart')


# Представление для обработки AJAX-запроса и последующего обновления БД
# и отправки на страницу JSON-ответа с необходимыми данными
@require_POST  # Декоратор для требования POST-запроса
@login_required  # Декоратор для требования аутентификации пользователя
def update_cart_item(request):
    # Получаем данные из формы обновления элемента корзины
    form = UpdateCartItemForm(request.POST)

    # Проверяем валидность данных формы
    if form.is_valid():
        cart_item_id = form.cleaned_data['cart_item_id']  # Получаем ID элемента корзины из формы
        new_quantity = form.cleaned_data['quantity']  # Получаем новое количество товара из формы

        # Находим элемент корзины по его ID и пользователю
        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart__user=request.user)

        # Обновляем количество товара в элементе корзины
        cart_item.quantity = new_quantity
        cart_item.save()

        # Пересчитываем общую стоимость корзины
        cart_item.cart.recalculate_total_price()

        # Возвращаем JSON-ответ с успешными данными обновления
        return JsonResponse({
            'success': True,
            'cart_item_id': cart_item.id,
            'cart_item_quantity': cart_item.quantity,
            'cart_item_total_price': cart_item.total_price,
            'cart_total_price': cart_item.cart.total_price
        })
    else:
        # Возвращаем JSON-ответ с сообщением об ошибке в данных формы
        return JsonResponse({
            'success': False,
            'error': 'Invalid data submitted'
        })


# Представление для обновления количества товара в корзине
@login_required  # Декоратор для требования аутентификации пользователя
def update_cart_item_form(request, cart_item_id):
    # Находим элемент корзины по его ID и пользователю
    cart_item = get_object_or_404(CartItem, id=cart_item_id, cart__user=request.user)

    # Если запрос пришел методом POST, обрабатываем данные формы обновления
    if request.method == 'POST':
        form = UpdateCartItemForm(request.POST, instance=cart_item)
        if form.is_valid():
            form.save()  # Сохраняем данные формы
            return redirect('cart:cart')  # Перенаправляем пользователя на страницу корзины
    else:
        form = UpdateCartItemForm(instance=cart_item)  # Создаем форму для обновления данных элемента корзины

    # Формируем контекст для передачи в шаблон обновления элемента корзины
    context = {
        'form': form,
        'cart_item': cart_item
    }

    # Отображаем шаблон update_cart_item.html с переданным контекстом
    return render(request, 'cart/update_cart_item.html', context)
