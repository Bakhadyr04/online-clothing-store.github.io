// Core javascript helper functions
'use strict';

// Функция quickElement(tagType, parentReference [, textInChildNode, attribute, attributeValue ...]);
function quickElement() {
    const obj = document.createElement(arguments[0]); // Создаем элемент с указанным тегом
    if (arguments[2]) {
        const textNode = document.createTextNode(arguments[2]); // Создаем текстовый узел, если передан текст
        obj.appendChild(textNode); // Добавляем текстовый узел в элемент
    }
    const len = arguments.length;
    for (let i = 3; i < len; i += 2) {
        obj.setAttribute(arguments[i], arguments[i + 1]); // Устанавливаем атрибуты элемента
    }
    arguments[1].appendChild(obj); // Добавляем элемент в родительский элемент
    return obj; // Возвращаем созданный элемент
}

// Функция removeChildren(a) удаляет все дочерние элементы элемента 'a'
function removeChildren(a) {
    while (a.hasChildNodes()) {
        a.removeChild(a.lastChild); // Удаляем последний дочерний элемент, пока они есть
    }
}

// ----------------------------------------------------------------------------
// Функции для определения позиции элемента на странице, созданные PPK
// См. https://www.quirksmode.org/js/findpos.html
// ----------------------------------------------------------------------------
function findPosX(obj) {
    let curleft = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft - obj.scrollLeft; // Вычисляем позицию по горизонтали с учетом скролла
            obj = obj.offsetParent; // Переходим к следующему родительскому элементу
        }
    } else if (obj.x) {
        curleft += obj.x; // Для старых браузеров
    }
    return curleft; // Возвращаем позицию по горизонтали
}

function findPosY(obj) {
    let curtop = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop - obj.scrollTop; // Вычисляем позицию по вертикали с учетом скролла
            obj = obj.offsetParent; // Переходим к следующему родительскому элементу
        }
    } else if (obj.y) {
        curtop += obj.y; // Для старых браузеров
    }
    return curtop; // Возвращаем позицию по вертикали
}

//-----------------------------------------------------------------------------
// Расширения объекта Date
// ----------------------------------------------------------------------------
{
    // Возвращает часы в 12-часовом формате
    Date.prototype.getTwelveHours = function() {
        return this.getHours() % 12 || 12;
    };

    // Возвращает месяц в двузначном формате
    Date.prototype.getTwoDigitMonth = function() {
        return (this.getMonth() < 9) ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1);
    };

    // Возвращает день месяца в двузначном формате
    Date.prototype.getTwoDigitDate = function() {
        return (this.getDate() < 10) ? '0' + this.getDate() : this.getDate();
    };

    // Возвращает часы в двузначном формате (12-часовой формат)
    Date.prototype.getTwoDigitTwelveHour = function() {
        return (this.getTwelveHours() < 10) ? '0' + this.getTwelveHours() : this.getTwelveHours();
    };

    // Возвращает часы в двузначном формате (24-часовой формат)
    Date.prototype.getTwoDigitHour = function() {
        return (this.getHours() < 10) ? '0' + this.getHours() : this.getHours();
    };

    // Возвращает минуты в двузначном формате
    Date.prototype.getTwoDigitMinute = function() {
        return (this.getMinutes() < 10) ? '0' + this.getMinutes() : this.getMinutes();
    };

    // Возвращает секунды в двузначном формате
    Date.prototype.getTwoDigitSecond = function() {
        return (this.getSeconds() < 10) ? '0' + this.getSeconds() : this.getSeconds();
    };

    // Возвращает сокращенное название месяца
    Date.prototype.getAbbrevMonthName = function() {
        return typeof window.CalendarNamespace === "undefined"
            ? this.getTwoDigitMonth()
            : window.CalendarNamespace.monthsOfYearAbbrev[this.getMonth()];
    };

    // Возвращает полное название месяца
    Date.prototype.getFullMonthName = function() {
        return typeof window.CalendarNamespace === "undefined"
            ? this.getTwoDigitMonth()
            : window.CalendarNamespace.monthsOfYear[this.getMonth()];
    };

    // Форматирует дату и время согласно указанному формату
    Date.prototype.strftime = function(format) {
        const fields = {
            b: this.getAbbrevMonthName(), // Сокращенное название месяца
            B: this.getFullMonthName(),   // Полное название месяца
            c: this.toString(),           // Строка даты и времени по умолчанию
            d: this.getTwoDigitDate(),    // День месяца
            H: this.getTwoDigitHour(),    // Часы (24-часовой формат)
            I: this.getTwoDigitTwelveHour(), // Часы (12-часовой формат)
            m: this.getTwoDigitMonth(),   // Месяц
            M: this.getTwoDigitMinute(),  // Минуты
            p: (this.getHours() >= 12) ? 'PM' : 'AM', // AM/PM
            S: this.getTwoDigitSecond(),  // Секунды
            w: '0' + this.getDay(),      // День недели
            x: this.toLocaleDateString(), // Локализованная дата
            X: this.toLocaleTimeString(), // Локализованное время
            y: ('' + this.getFullYear()).substr(2, 4), // Две последние цифры года
            Y: '' + this.getFullYear(),   // Год полностью
            '%': '%'                      // Знак процента
        };
        let result = '', i = 0;
        while (i < format.length) {
            if (format.charAt(i) === '%') {
                result = result + fields[format.charAt(i + 1)]; // Заменяем метки формата на соответствующие значения
                ++i;
            }
            else {
                result = result + format.charAt(i); // Добавляем обычные символы
            }
            ++i;
        }
        return result; // Возвращаем сформированную строку
    };

    // ----------------------------------------------------------------------------
    // Расширения объекта String
    // ----------------------------------------------------------------------------
    String.prototype.strptime = function(format) {
        const split_format = format.split(/[.\-/]/); // Разбиваем формат на массив по разделителям
        const date = this.split(/[.\-/]/); // Разбиваем строку даты на массив по разделителям
        let i = 0;
        let day, month, year;
        while (i < split_format.length) {
            switch (split_format[i]) {
                case "%d":
                    day = date[i];
                    break;
                case "%m":
                    month = date[i] - 1; // Месяцы в JavaScript начинаются с 0
                    break;
                case "%Y":
                    year = date[i];
                    break;
                case "%y":
                    // Значение %y в диапазоне [00, 68] относится к текущему веку,
                    // а [69, 99] - к предыдущему веку, согласно спецификации Open Group.
                    if (parseInt(date[i], 10) >= 69) {
                        year = date[i];
                    } else {
                        year = (new Date(Date.UTC(date[i], 0))).getUTCFullYear() + 100;
                    }
                    break;
            }
            ++i;
        }
        // Создаем объект Date в UTC, так как разбираемое значение должно быть в UTC, а не локальном времени.
        // Кроме того, календарь использует UTC-функции для извлечения даты.
        return new Date(Date.UTC(year, month, day));
    };
}
