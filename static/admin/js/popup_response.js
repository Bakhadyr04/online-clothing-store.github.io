'use strict';

{
    // Получаем данные инициализации из элемента с id 'django-admin-popup-response-constants'
    const initData = JSON.parse(document.getElementById('django-admin-popup-response-constants').dataset.popupResponse);

    // Выполняем различные действия в зависимости от значения initData.action
    switch (initData.action) {
        case 'change':
            // Если действие 'change', вызываем функцию для закрытия окна редактирования
            opener.dismissChangeRelatedObjectPopup(window, initData.value, initData.obj, initData.new_value);
            break;
        case 'delete':
            // Если действие 'delete', вызываем функцию для закрытия окна удаления
            opener.dismissDeleteRelatedObjectPopup(window, initData.value);
            break;
        default:
            // По умолчанию (добавление), вызываем функцию для закрытия окна добавления
            opener.dismissAddRelatedObjectPopup(window, initData.value, initData.obj);
            break;
    }
}
