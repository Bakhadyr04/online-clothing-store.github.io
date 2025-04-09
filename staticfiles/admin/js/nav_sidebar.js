'use strict';

{
    // Получаем элемент переключения боковой панели навигации
    const toggleNavSidebar = document.getElementById('toggle-nav-sidebar');

    // Проверяем, существует ли элемент переключения
    if (toggleNavSidebar !== null) {
        // Получаем все ссылки в боковой панели навигации
        const navLinks = document.querySelectorAll('#nav-sidebar a');

        // Функция для отключения фокусировки на ссылках
        function disableNavLinkTabbing() {
            for (const navLink of navLinks) {
                navLink.tabIndex = -1;
            }
        }

        // Функция для включения фокусировки на ссылках
        function enableNavLinkTabbing() {
            for (const navLink of navLinks) {
                navLink.tabIndex = 0;
            }
        }

        // Получаем основной контент
        const main = document.getElementById('main');

        // Получаем состояние боковой панели из localStorage
        let navSidebarIsOpen = localStorage.getItem('django.admin.navSidebarIsOpen');

        // Если состояние не установлено, устанавливаем его в 'true'
        if (navSidebarIsOpen === null) {
            navSidebarIsOpen = 'true';
        }

        // Если боковая панель закрыта (состояние 'false'), отключаем фокусировку на ссылках
        if (navSidebarIsOpen === 'false') {
            disableNavLinkTabbing();
        }

        // Изменяем класс main в зависимости от состояния боковой панели
        main.classList.toggle('shifted', navSidebarIsOpen === 'true');

        // Добавляем слушатель события на кнопку переключения боковой панели
        toggleNavSidebar.addEventListener('click', function() {
            // Изменяем состояние боковой панели и обновляем фокусировку на ссылках
            if (navSidebarIsOpen === 'true') {
                navSidebarIsOpen = 'false';
                disableNavLinkTabbing();
            } else {
                navSidebarIsOpen = 'true';
                enableNavLinkTabbing();
            }

            // Сохраняем состояние боковой панели в localStorage
            localStorage.setItem('django.admin.navSidebarIsOpen', navSidebarIsOpen);

            // Изменяем класс main для анимации сдвига контента
            main.classList.toggle('shifted');
        });
    }
}
