/*global gettext*/
'use strict';
{
    // Дожидаемся полной загрузки страницы
    window.addEventListener('load', function() {
        // Добавляем якорные теги для ссылок Показать/Скрыть
        const fieldsets = document.querySelectorAll('fieldset.collapse');
        for (const [i, elem] of fieldsets.entries()) {
            // Не скрываем, если в этом fieldset есть ошибки
            if (elem.querySelectorAll('div.errors, ul.errorlist').length === 0) {
                elem.classList.add('collapsed'); // Добавляем класс 'collapsed' для скрытия по умолчанию
                const h2 = elem.querySelector('h2'); // Находим заголовок h2 внутри fieldset
                const link = document.createElement('a'); // Создаём новую ссылку
                link.id = 'fieldsetcollapser' + i; // Присваиваем id для уникальности
                link.className = 'collapse-toggle'; // Добавляем класс 'collapse-toggle'
                link.href = '#'; // Устанавливаем ссылку на #
                link.textContent = gettext('Show'); // Текст ссылки "Показать"
                h2.appendChild(document.createTextNode(' (')); // Добавляем текст "(" после заголовка
                h2.appendChild(link); // Добавляем ссылку в заголовок
                h2.appendChild(document.createTextNode(')')); // Добавляем текст ")" после ссылки
            }
        }
        // Функция для переключения Показать/Скрыть
        const toggleFunc = function(ev) {
            if (ev.target.matches('.collapse-toggle')) { // Проверяем, что клик был по ссылке Показать/Скрыть
                ev.preventDefault(); // Предотвращаем стандартное действие ссылки
                ev.stopPropagation(); // Останавливаем всплытие события
                const fieldset = ev.target.closest('fieldset'); // Находим ближайший родительский элемент fieldset
                if (fieldset.classList.contains('collapsed')) {
                    // Если fieldset скрыт, то показываем его
                    ev.target.textContent = gettext('Hide'); // Меняем текст ссылки на "Скрыть"
                    fieldset.classList.remove('collapsed'); // Удаляем класс 'collapsed'
                } else {
                    // Если fieldset показан, то скрываем его
                    ev.target.textContent = gettext('Show'); // Меняем текст ссылки на "Показать"
                    fieldset.classList.add('collapsed'); // Добавляем класс 'collapsed'
                }
            }
        };
        // Добавляем обработчик клика для всех элементов fieldset с классом 'module'
        document.querySelectorAll('fieldset.module').forEach(function(el) {
            el.addEventListener('click', toggleFunc);
        });
    });
}
