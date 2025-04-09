'use strict';
{
    // Функция ready(fn) вызывает функцию fn, когда DOM загружен и готов к использованию.
    // Если DOM уже загружен, функция вызывается сразу.
    // Источник: http://youmightnotneedjquery.com/#ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn(); // Если DOM уже загружен, сразу вызываем функцию.
        } else {
            document.addEventListener('DOMContentLoaded', fn); // В противном случае ждём события загрузки DOM.
        }
    }

    // Вызываем функцию ready с колбэком, который устанавливает обработчики событий.
    ready(function() {
        // Функция handleClick(event) обрабатывает клики по ссылкам с классом 'cancel-link'.
        function handleClick(event) {
            event.preventDefault(); // Предотвращаем стандартное действие ссылки.

            const params = new URLSearchParams(window.location.search); // Получаем параметры запроса URL.
            if (params.has('_popup')) {
                window.close(); // Если присутствует параметр '_popup', закрываем всплывающее окно.
            } else {
                window.history.back(); // Иначе возвращаемся назад в истории браузера.
            }
        }

        // Добавляем обработчики событий клика ко всем элементам с классом 'cancel-link'.
        document.querySelectorAll('.cancel-link').forEach(function(el) {
            el.addEventListener('click', handleClick);
        });
    });
}
