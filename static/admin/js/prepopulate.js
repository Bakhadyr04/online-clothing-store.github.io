'use strict';

{
    // Зависимости: URLify определён в глобальной области видимости

    // Расширяем функциональность jQuery для предзаполнения полей
    const $ = django.jQuery;
    $.fn.prepopulate = function(dependencies, maxLength, allowUnicode) {
        /*
            Depends on urlify.js
            Populates a selected field with the values of the dependent fields,
            URLifies and shortens the string.
            dependencies - array of dependent fields ids
            maxLength - maximum length of the URLify'd string
            allowUnicode - Unicode support of the URLify'd string
        */
        return this.each(function() {
            const prepopulatedField = $(this);

            const populate = function() {
                // Проверяем, изменилось ли значение поля пользователем
                if (prepopulatedField.data('_changed')) {
                    return;
                }

                // Собираем значения из зависимых полей
                const values = [];
                $.each(dependencies, function(i, field) {
                    field = $(field);
                    if (field.val().length > 0) {
                        values.push(field.val());
                    }
                });

                // Применяем URLify к собранным значениям и устанавливаем в поле
                prepopulatedField.val(URLify(values.join(' '), maxLength, allowUnicode));
            };

            // Устанавливаем флаг _changed и обрабатываем событие изменения значения поля
            prepopulatedField.data('_changed', false);
            prepopulatedField.on('change', function() {
                prepopulatedField.data('_changed', true);
            });

            // Если поле пустое, привязываем обработчики событий к зависимым полям
            if (!prepopulatedField.val()) {
                $(dependencies.join(',')).on('keyup change focus', populate);
            }
        });
    };
}
