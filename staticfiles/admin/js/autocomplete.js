'use strict'; // Строгий режим JavaScript для улучшения контроля над кодом

{
    const $ = django.jQuery; // Используем jQuery, загруженный Django

    // Функция инициализации Select2 для элемента $element с заданными options
    const init = function($element, options) {
        const settings = $.extend({
            ajax: {
                // Конфигурация Ajax запроса для Select2
                data: function(params) {
                    return {
                        term: params.term, // Текст запроса для поиска
                        page: params.page, // Номер страницы результатов
                        app_label: $element.data('app-label'), // Название приложения Django
                        model_name: $element.data('model-name'), // Название модели Django
                        field_name: $element.data('field-name') // Название поля модели
                    };
                }
            }
        }, options);

        // Применяем Select2 к $element с заданными settings
        $element.select2(settings);
    };

    // Добавляем метод djangoAdminSelect2 к jQuery.fn (jQuery prototype)
    $.fn.djangoAdminSelect2 = function(options) {
        const settings = $.extend({}, options); // Настройки по умолчанию для всех элементов
        $.each(this, function(i, element) {
            const $element = $(element); // Оборачиваем текущий элемент в jQuery объект
            init($element, settings); // Инициализируем Select2 для текущего элемента
        });
        return this; // Возвращаем jQuery объект для поддержки цепочек вызовов
    };

    // Выполняем код после полной загрузки DOM
    $(function() {
        // Инициализируем все виджеты автозаполнения, кроме тех, что находятся в шаблоне
        // формы, используемом при добавлении нового набора форм.
        $('.admin-autocomplete').not('[name*=__prefix__]').djangoAdminSelect2();
    });

    // Обрабатываем событие formset:added (срабатывает при добавлении нового набора форм)
    $(document).on('formset:added', (function() {
        return function(event, $newFormset) {
            // Инициализируем Select2 для всех элементов с классом .admin-autocomplete в новом наборе форм
            return $newFormset.find('.admin-autocomplete').djangoAdminSelect2();
        };
    })(this)); // Передаем текущий контекст (this) в функцию для правильной работы события
}
