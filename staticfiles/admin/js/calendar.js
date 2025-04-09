'use strict'; // Строгий режим JavaScript для улучшения контроля над кодом

{
    // CalendarNamespace -- Предоставляет набор вспомогательных функций для работы с HTML-календарем
    const CalendarNamespace = {
        monthsOfYear: [
            gettext('January'),     // Получаем локализованное название месяца
            gettext('February'),    // для каждого месяца года
            gettext('March'),
            gettext('April'),
            gettext('May'),
            gettext('June'),
            gettext('July'),
            gettext('August'),
            gettext('September'),
            gettext('October'),
            gettext('November'),
            gettext('December')
        ],
        monthsOfYearAbbrev: [
            pgettext('abbrev. month January', 'Jan'),   // Получаем сокращенное локализованное название месяца
            pgettext('abbrev. month February', 'Feb'),  // для каждого месяца года
            pgettext('abbrev. month March', 'Mar'),
            pgettext('abbrev. month April', 'Apr'),
            pgettext('abbrev. month May', 'May'),
            pgettext('abbrev. month June', 'Jun'),
            pgettext('abbrev. month July', 'Jul'),
            pgettext('abbrev. month August', 'Aug'),
            pgettext('abbrev. month September', 'Sep'),
            pgettext('abbrev. month October', 'Oct'),
            pgettext('abbrev. month November', 'Nov'),
            pgettext('abbrev. month December', 'Dec')
        ],
        daysOfWeek: [
            pgettext('one letter Sunday', 'S'),     // Получаем однобуквенное локализованное название дней недели
            pgettext('one letter Monday', 'M'),     // для каждого дня недели
            pgettext('one letter Tuesday', 'T'),
            pgettext('one letter Wednesday', 'W'),
            pgettext('one letter Thursday', 'T'),
            pgettext('one letter Friday', 'F'),
            pgettext('one letter Saturday', 'S')
        ],
        firstDayOfWeek: parseInt(get_format('FIRST_DAY_OF_WEEK')), // Получаем первый день недели из Django settings

        // Функция определения високосного года
        isLeapYear: function(year) {
            return (((year % 4) === 0) && ((year % 100) !== 0 ) || ((year % 400) === 0));
        },

        // Функция получения количества дней в месяце
        getDaysInMonth: function(month, year) {
            let days;
            if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
                days = 31; // Месяцы с 31 днем
            }
            else if (month === 4 || month === 6 || month === 9 || month === 11) {
                days = 30; // Месяцы с 30 днями
            }
            else if (month === 2 && CalendarNamespace.isLeapYear(year)) {
                days = 29; // Февраль в високосный год имеет 29 дней
            }
            else {
                days = 28; // Февраль в обычный год имеет 28 дней
            }
            return days;
        },

        // Функция отрисовки HTML-календаря
        draw: function(month, year, div_id, callback, selected) { // month = 1-12, year = 1-9999
            const today = new Date(); // Текущая дата
            const todayDay = today.getDate(); // День текущей даты
            const todayMonth = today.getMonth() + 1; // Месяц текущей даты
            const todayYear = today.getFullYear(); // Год текущей даты
            let todayClass = ''; // Класс для стилизации сегодняшней даты

            // Проверяем, является ли текущий месяц выбранным месяцем
            let isSelectedMonth = false;
            if (typeof selected !== 'undefined') {
                isSelectedMonth = (selected.getUTCFullYear() === year && (selected.getUTCMonth() + 1) === month);
            }

            month = parseInt(month);
            year = parseInt(year);
            const calDiv = document.getElementById(div_id); // Получаем элемент для отображения календаря
            removeChildren(calDiv); // Удаляем все дочерние элементы календаря

            const calTable = document.createElement('table'); // Создаем таблицу для календаря
            quickElement('caption', calTable, CalendarNamespace.monthsOfYear[month - 1] + ' ' + year); // Добавляем заголовок таблицы

            const tableBody = quickElement('tbody', calTable); // Создаем тело таблицы

            // Рисуем заголовок с днями недели
            let tableRow = quickElement('tr', tableBody);
            for (let i = 0; i < 7; i++) {
                quickElement('th', tableRow, CalendarNamespace.daysOfWeek[(i + CalendarNamespace.firstDayOfWeek) % 7]);
            }

            const startingPos = new Date(year, month - 1, 1 - CalendarNamespace.firstDayOfWeek).getDay(); // Позиция начала месяца в таблице
            const days = CalendarNamespace.getDaysInMonth(month, year); // Количество дней в выбранном месяце

            let nonDayCell;

            // Рисуем пустые ячейки перед первым числом месяца
            tableRow = quickElement('tr', tableBody);
            for (let i = 0; i < startingPos; i++) {
                nonDayCell = quickElement('td', tableRow, ' ');
                nonDayCell.className = "nonday"; // Добавляем класс для пустых ячеек
            }

            // Функция для обработчика клика по дню календаря
            function calendarMonth(y, m) {
                function onClick(e) {
                    e.preventDefault();
                    callback(y, m, this.textContent); // Вызываем callback с выбранной датой
                }
                return onClick;
            }

            // Рисуем дни месяца
            let currentDay = 1;
            for (let i = startingPos; currentDay <= days; i++) {
                if (i % 7 === 0 && currentDay !== 1) {
                    tableRow = quickElement('tr', tableBody); // Начинаем новую строку каждую неделю
                }
                if ((currentDay === todayDay) && (month === todayMonth) && (year === todayYear)) {
                    todayClass = 'today'; // Отмечаем сегодняшний день
                } else {
                    todayClass = '';
                }

                // Отмечаем выбранный день в выбранном месяце
                if (isSelectedMonth && currentDay === selected.getUTCDate()) {
                    if (todayClass !== '') {
                        todayClass += " ";
                    }
                    todayClass += "selected";
                }

                const cell = quickElement('td', tableRow, '', 'class', todayClass); // Создаем ячейку дня
                const link = quickElement('a', cell, currentDay, 'href', '#'); // Создаем ссылку для числа
                link.addEventListener('click', calendarMonth(year, month)); // Добавляем обработчик клика
                currentDay++;
            }

            // Рисуем пустые ячейки после конца месяца (для корректности HTML)
            while (tableRow.childNodes.length < 7) {
                nonDayCell = quickElement('td', tableRow, ' ');
                nonDayCell.className = "nonday";
            }

            calDiv.appendChild(calTable); // Добавляем таблицу в элемент для отображения календаря
        }
    };

    // Calendar -- Конструктор объекта календаря
    function Calendar(div_id, callback, selected) {
        this.div_id = div_id; // ID элемента для отображения календаря
        this.callback = callback; // Функция обратного вызова при выборе даты
        this.today = new Date(); // Текущая дата
        this.currentMonth = this.today.getMonth() + 1; // Текущий месяц
        this.currentYear = this.today.getFullYear(); // Текущий год
        if (typeof selected !== 'undefined') {
            this.selected = selected; // Выбранная дата (если указана)
        }

    // Методы прототипа объекта Calendar
    Calendar.prototype = {
        // Отрисовка текущего месяца
        drawCurrent: function() {
            CalendarNamespace.draw(this.currentMonth, this.currentYear, this.div_id, this.callback, this.selected);
        },

        // Отрисовка конкретного месяца и года
        drawDate: function(month, year, selected) {
            this.currentMonth = month; // Установка нового месяца
            this.currentYear = year;   // Установка нового года

            if(selected) {
                this.selected = selected; // Установка новой выбранной даты (если указана)
            }

            this.drawCurrent(); // Вызов метода отрисовки текущего месяца
        },

        // Отрисовка предыдущего месяца
        drawPreviousMonth: function() {
            if (this.currentMonth === 1) {
                this.currentMonth = 12;
                this.currentYear--;
            }
            else {
                this.currentMonth--;
            }
            this.drawCurrent(); // Вызов метода отрисовки текущего месяца после изменения
        },

        // Отрисовка следующего месяца
        drawNextMonth: function() {
            if (this.currentMonth === 12) {
                this.currentMonth = 1;
                this.currentYear++;
            }
            else {
                this.currentMonth++;
            }
            this.drawCurrent(); // Вызов метода отрисовки текущего месяца после изменения
        },

        // Отрисовка предыдущего года
        drawPreviousYear: function() {
            this.currentYear--;
            this.drawCurrent(); // Вызов метода отрисовки текущего месяца после изменения
        },

        // Отрисовка следующего года
        drawNextYear: function() {
            this.currentYear++;
            this.drawCurrent(); // Вызов метода отрисовки текущего месяца после изменения
        }
    };

    // Регистрация объектов в глобальной области видимости
    window.Calendar = Calendar;
    window.CalendarNamespace = CalendarNamespace;
}