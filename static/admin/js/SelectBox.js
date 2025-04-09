'use strict';

{
    // Объект SelectBox для работы с HTML-элементами select
    const SelectBox = {
        // Кэш для хранения данных об элементах select
        cache: {},

        // Инициализация SelectBox для определенного элемента select
        init: function(id) {
            const box = document.getElementById(id);
            SelectBox.cache[id] = [];
            const cache = SelectBox.cache[id];
            // Заполнение кэша данными из элемента select
            for (const node of box.options) {
                cache.push({value: node.value, text: node.text, displayed: 1});
            }
        },

        // Перерисовка элемента select на основе кэша
        redisplay: function(id) {
            const box = document.getElementById(id);
            const scroll_value_from_top = box.scrollTop;
            box.innerHTML = '';
            // Перебор элементов кэша и добавление их в элемент select
            for (const node of SelectBox.cache[id]) {
                if (node.displayed) {
                    const new_option = new Option(node.text, node.value, false, false);
                    // Установка всплывающей подсказки для опции
                    new_option.title = node.text;
                    box.appendChild(new_option);
                }
            }
            box.scrollTop = scroll_value_from_top;
        },

        // Фильтрация элементов select по тексту
        filter: function(id, text) {
            const tokens = text.toLowerCase().split(/\s+/);
            // Фильтрация элементов кэша по всем токенам
            for (const node of SelectBox.cache[id]) {
                node.displayed = 1;
                const node_text = node.text.toLowerCase();
                for (const token of tokens) {
                    if (!node_text.includes(token)) {
                        node.displayed = 0;
                        break; // Прерывание цикла при первом несовпадении
                    }
                }
            }
            // Перерисовка элемента select после фильтрации
            SelectBox.redisplay(id);
        },

        // Удаление элемента из кэша по значению
        delete_from_cache: function(id, value) {
            let delete_index = null;
            const cache = SelectBox.cache[id];
            // Поиск и удаление элемента из кэша
            for (const [i, node] of cache.entries()) {
                if (node.value === value) {
                    delete_index = i;
                    break;
                }
            }
            cache.splice(delete_index, 1);
        },

        // Добавление элемента в кэш
        add_to_cache: function(id, option) {
            SelectBox.cache[id].push({value: option.value, text: option.text, displayed: 1});
        },

        // Проверка наличия элемента в кэше
        cache_contains: function(id, value) {
            for (const node of SelectBox.cache[id]) {
                if (node.value === value) {
                    return true;
                }
            }
            return false;
        },

        // Перемещение выбранных элементов между select
        move: function(from, to) {
            const from_box = document.getElementById(from);
            // Перебор всех опций в исходном select
            for (const option of from_box.options) {
                const option_value = option.value;
                // Проверка, выбран ли элемент и содержится ли в кэше
                if (option.selected && SelectBox.cache_contains(from, option_value)) {
                    // Добавление элемента в кэш назначения и удаление из кэша источника
                    SelectBox.add_to_cache(to, {value: option_value, text: option.text, displayed: 1});
                    SelectBox.delete_from_cache(from, option_value);
                }
            }
            // Перерисовка обоих select после перемещения
            SelectBox.redisplay(from);
            SelectBox.redisplay(to);
        },

        // Перемещение всех элементов между select
        move_all: function(from, to) {
            const from_box = document.getElementById(from);
            // Перебор всех опций в исходном select
            for (const option of from_box.options) {
                const option_value = option.value;
                // Проверка, содержится ли элемент в кэше источника
                if (SelectBox.cache_contains(from, option_value)) {
                    // Добавление элемента в кэш назначения и удаление из кэша источника
                    SelectBox.add_to_cache(to, {value: option_value, text: option.text, displayed: 1});
                    SelectBox.delete_from_cache(from, option_value);
                }
            }
            // Перерисовка обоих select после перемещения всех элементов
            SelectBox.redisplay(from);
            SelectBox.redisplay(to);
        },

        // Сортировка элементов в кэше
        sort: function(id) {
            SelectBox.cache[id].sort(function(a, b) {
                a = a.text.toLowerCase();
                b = b.text.toLowerCase();
                if (a > b) {
                    return 1;
                }
                if (a < b) {
                    return -1;
                }
                return 0;
            });
        },

        // Выбор всех элементов в select
        select_all: function(id) {
            const box = document.getElementById(id);
            for (const option of box.options) {
                option.selected = true;
            }
        }
    };

    // Присвоение объекта SelectBox глобальной переменной window.SelectBox
    window.SelectBox = SelectBox;
}
