// Рендеринг кнопки PayPal в элемент #paypal-button-container
paypal.Buttons({
    // Функция createOrder вызывает сервер для создания транзакции
    createOrder: function(data, actions) {
        return fetch('/demo/checkout/api/paypal/order/create/', {
            method: 'post'
        }).then(function(res) {
            return res.json(); // Преобразуем ответ в JSON
        }).then(function(orderData) {
            return orderData.id; // Возвращаем идентификатор созданного заказа
        });
    },

    // Функция onApprove вызывает сервер для завершения транзакции после одобрения
    onApprove: function(data, actions) {
        return fetch('/demo/checkout/api/paypal/order/' + data.orderID + '/capture/', {
            method: 'post'
        }).then(function(res) {
            return res.json(); // Преобразуем ответ в JSON
        }).then(function(orderData) {
            // Обработка различных случаев после захвата заказа
            var errorDetail = Array.isArray(orderData.details) && orderData.details[0];

            // Если возникла ошибка INSTRUMENT_DECLINED, попробуем возобновить транзакцию
            if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                return actions.restart(); // Вызываем функцию restart() для возобновления транзакции
            }

            // Если есть другие ошибки, показываем сообщение о неудаче
            if (errorDetail) {
                var msg = 'Извините, ваша транзакция не может быть обработана.';
                if (errorDetail.description) msg += '\n\n' + errorDetail.description;
                if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
                return alert(msg); // Показываем сообщение об ошибке (лучше избегать alert в production)
            }

            // Если транзакция успешна, показываем подтверждение и перенаправляем на страницу благодарности
            console.log('Результат захвата', orderData, JSON.stringify(orderData, null, 2));
            var transaction = orderData.purchase_units[0].payments.captures[0];
            alert('Транзакция ' + transaction.status + ': ' + transaction.id + '\n\nСм. консоль для всех доступных деталей');

            actions.redirect('thank_you.html'); // Перенаправляем пользователя на страницу благодарности
        });
    }
}).render('#paypal-button-container'); // Рендерим кнопку PayPal в элемент #paypal-button-container на странице
