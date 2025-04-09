'use strict';

{
    const $ = django.jQuery;

    // Получаем константы предзаполненных полей из элемента данных
    const fields = $('#django-admin-prepopulated-fields-constants').data('prepopulatedFields');

    // Для каждого поля выполняем следующие действия
    $.each(fields, function(index, field) {
        // Добавляем класс 'prepopulated_field' к соответствующему полю в пустой форме
        $('.empty-form .form-row .field-' + field.name + ', .empty-form.form-row .field-' + field.name).addClass('prepopulated_field');

        // Применяем предзаполнение к полю
        $(field.id).data('dependency_list', field.dependency_list).prepopulate(
            field.dependency_ids, field.maxLength, field.allowUnicode
        );
    });
}
