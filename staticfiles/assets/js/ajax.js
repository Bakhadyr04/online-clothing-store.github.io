$(document).ready(function() {
    $('.minus, .plus').click(function () {
        // Получаем поле ввода количества и текущее значение
        var $input = $(this).siblings('.quantity-input');
        var count = parseInt($input.val());

        // Определяем, была ли нажата кнопка минус или плюс
        if ($(this).hasClass('minus')) {
            count = count <= 1 ? 1 : count - 1; // Убедимся, что количество не уходит ниже 1
        } else {
            count = count + 1;
        }

        // Обновляем поле ввода количества новым значением
        $input.val(count);

        // Получаем необходимые данные для AJAX запроса
        var cartItemId = $(this).data('cart-item-id');
        var newQuantityInput = document.getElementById('new-quantity-input-' + cartItemId);
        var cartItemIdInput = document.getElementById('cart-item-id-input-' + cartItemId);
        var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
        var cartId = $('#cart-total-price').data('cart-id');

        // Обновляем скрытые поля новыми значениями
        newQuantityInput.value = count;
        cartItemIdInput.value = cartItemId;

        // Выполняем AJAX запрос для обновления элемента корзины
        $.ajax({
            url: '/cart/update_cart_item/',
            method: "POST",
            data: {
                cart_id: cartId,
                new_quantity: newQuantityInput.value,
                cart_item_id: cartItemIdInput.value,
                csrfmiddlewaretoken: csrfToken,
            },
            success: function (data) {
                // Обработка успешного ответа от сервера
                if (data.success) {
                    // Обновляем элементы интерфейса данными из ответа сервера
                    $('#cart-item-count').text(data.cart_item_count); // Обновляем количество товаров в корзине
                    $input.val(data.cart_item_quantity); // Обновляем значение поля ввода количества
                    $('.cart-item-total-price[data-cart-item-id="' + cartItemId + '"]').text(data.cart_item_total_price); // Обновляем общую стоимость товара
                    $('#cart-total-price').text(data.cart_total_price); // Обновляем общую стоимость корзины

                    console.log('Успешно обновлено');
                } else {
                    console.log('Не удалось обновить товар в корзине');
                }
            },
            error: function () {
                // Обработка ошибки
                console.log('Не удалось обновить товар в корзине');
            },
        });
    });
});
