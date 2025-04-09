'use strict';
{
    // Массив тегов элементов формы, на которые можно установить фокус.
    const inputTags = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];

    // Получаем имя модели из атрибута data-modelName элемента с id 'django-admin-form-add-constants'.
    const modelName = document.getElementById('django-admin-form-add-constants').dataset.modelName;

    // Если имя модели существует, выполняем дальнейшие действия.
    if (modelName) {
        // Находим форму по её id, который строится на основе имени модели.
        const form = document.getElementById(modelName + '_form');

        // Проходимся по всем элементам формы.
        for (const element of form.elements) {
            // HTMLElement.offsetParent возвращает null, если элемент не отображается на странице.
            // Проверяем, что элемент является одним из разрешённых тегов для фокуса,
            // не отключён и имеет родителя, отображаемого на странице (offsetParent !== null).
            if (inputTags.includes(element.tagName) && !element.disabled && element.offsetParent) {
                element.focus(); // Устанавливаем фокус на найденный элемент.
                break; // Прерываем цикл после установки фокуса на первый подходящий элемент.
            }
        }
    }
}
