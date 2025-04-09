'use strict';

{
    // Объект SelectFilter для преобразования множественного select в интерфейс фильтрации
    window.SelectFilter = {
        // Инициализация SelectFilter для определенного поля
        init: function(field_id, field_name, is_stacked) {
            // Не инициализировать на пустых формах
            if (field_id.match(/__prefix__/)) {
                return;
            }

            const from_box = document.getElementById(field_id);
            from_box.id += '_from'; // изменение ID
            from_box.className = 'filtered'; // добавление класса

            // Обработка соседних элементов
            for (const p of from_box.parentNode.getElementsByTagName('p')) {
                if (p.classList.contains("info")) {
                    from_box.parentNode.removeChild(p); // удаление элемента p.info
                } else if (p.classList.contains("help")) {
                    from_box.parentNode.insertBefore(p, from_box.parentNode.firstChild); // перемещение помощи наверх
                }
            }

            // Создание разметки для интерфейса фильтра
            const selector_div = quickElement('div', from_box.parentNode);
            selector_div.className = is_stacked ? 'selector stacked' : 'selector';

            // Секция доступных элементов
            const selector_available = quickElement('div', selector_div);
            selector_available.className = 'selector-available';
            const title_available = quickElement('h2', selector_available, interpolate(gettext('Available %s') + ' ', [field_name]));
            quickElement(
                'span', title_available, '',
                'class', 'help help-tooltip help-icon',
                'title', interpolate(
                    gettext(
                        'This is the list of available %s. You may choose some by ' +
                        'selecting them in the box below and then clicking the ' +
                        '"Choose" arrow between the two boxes.'
                    ),
                    [field_name]
                )
            );

            const filter_p = quickElement('p', selector_available, '', 'id', field_id + '_filter');
            filter_p.className = 'selector-filter';

            const search_filter_label = quickElement('label', filter_p, '', 'for', field_id + '_input');

            quickElement(
                'span', search_filter_label, '',
                'class', 'help-tooltip search-label-icon',
                'title', interpolate(gettext("Type into this box to filter down the list of available %s."), [field_name])
            );

            filter_p.appendChild(document.createTextNode(' '));

            const filter_input = quickElement('input', filter_p, '', 'type', 'text', 'placeholder', gettext("Filter"));
            filter_input.id = field_id + '_input';

            selector_available.appendChild(from_box);
            const choose_all = quickElement('a', selector_available, gettext('Choose all'), 'title', interpolate(gettext('Click to choose all %s at once.'), [field_name]), 'href', '#', 'id', field_id + '_add_all_link');
            choose_all.className = 'selector-chooseall';

            // Секция выбранных элементов
            const selector_chooser = quickElement('ul', selector_div);
            selector_chooser.className = 'selector-chooser';
            const add_link = quickElement('a', quickElement('li', selector_chooser), gettext('Choose'), 'title', gettext('Choose'), 'href', '#', 'id', field_id + '_add_link');
            add_link.className = 'selector-add';
            const remove_link = quickElement('a', quickElement('li', selector_chooser), gettext('Remove'), 'title', gettext('Remove'), 'href', '#', 'id', field_id + '_remove_link');
            remove_link.className = 'selector-remove';

            // Секция выбранных элементов
            const selector_chosen = quickElement('div', selector_div);
            selector_chosen.className = 'selector-chosen';
            const title_chosen = quickElement('h2', selector_chosen, interpolate(gettext('Chosen %s') + ' ', [field_name]));
            quickElement(
                'span', title_chosen, '',
                'class', 'help help-tooltip help-icon',
                'title', interpolate(
                    gettext(
                        'This is the list of chosen %s. You may remove some by ' +
                        'selecting them in the box below and then clicking the ' +
                        '"Remove" arrow between the two boxes.'
                    ),
                    [field_name]
                )
            );

            const to_box = quickElement('select', selector_chosen, '', 'id', field_id + '_to', 'multiple', '', 'size', from_box.size, 'name', from_box.name);
            to_box.className = 'filtered';
            const clear_all = quickElement('a', selector_chosen, gettext('Remove all'), 'title', interpolate(gettext('Click to remove all chosen %s at once.'), [field_name]), 'href', '#', 'id', field_id + '_remove_all_link');
            clear_all.className = 'selector-clearall';

            from_box.name = from_box.name + '_old'; // изменение имени поля

            // Назначение обработчиков событий для интерфейса фильтрации
            const move_selection = function(e, elem, move_func, from, to) {
                if (elem.classList.contains('active')) {
                    move_func(from, to);
                    SelectFilter.refresh_icons(field_id);
                }
                e.preventDefault();
            };
            choose_all.addEventListener('click', function(e) {
                move_selection(e, this, SelectBox.move_all, field_id + '_from', field_id + '_to');
            });
            add_link.addEventListener('click', function(e) {
                move_selection(e, this, SelectBox.move, field_id + '_from', field_id + '_to');
            });
            remove_link.addEventListener('click', function(e) {
                move_selection(e, this, SelectBox.move, field_id + '_to', field_id + '_from');
            });
            clear_all.addEventListener('click', function(e) {
                move_selection(e, this, SelectBox.move_all, field_id + '_to', field_id + '_from');
            });
            filter_input.addEventListener('keypress', function(e) {
                SelectFilter.filter_key_press(e, field_id);
            });
            filter_input.addEventListener('keyup', function(e) {
                SelectFilter.filter_key_up(e, field_id);
            });
            filter_input.addEventListener('keydown', function(e) {
                SelectFilter.filter_key_down(e, field_id);
            });
            selector_div.addEventListener('change', function(e) {
                if (e.target.tagName === 'SELECT') {
                    SelectFilter.refresh_icons(field_id);
                }
            });
            selector_div.addEventListener('dblclick', function(e) {
                if (e.target.tagName === 'OPTION') {
                    if (e.target.closest('select').id === field_id + '_to') {
                        SelectBox.move(field_id + '_to', field_id + '_from');
                    } else {
                        SelectBox.move(field_id + '_from', field_id + '_to');
                    }
                    SelectFilter.refresh_icons(field_id);
                }
            });
            from_box.closest('form').addEventListener('submit', function() {
                SelectBox.select_all(field_id + '_to');
            });
            // Инициализация SelectBox для обоих select
            SelectBox.init(field_id + '_from');
            SelectBox.init(field_id + '_to');
            // Перемещение выбранных опций из исходного select в целевой
            SelectBox.move(field_id + '_from', field_id + '_to');

            if (!is_stacked) {
                // В горизонтальном режиме задать одинаковую высоту обоим select
                const j_from_box = document.getElementById(field_id + '_from');
                const j_to_box = document.getElementById(field_id + '_to');
                let height = filter_p.offsetHeight + j_from_box.offsetHeight;

                const j_to_box_style = window.getComputedStyle(j_to_box);
                if (j_to_box_style.getPropertyValue('box-sizing') === 'border-box') {
                    // Добавить высоту padding и border
                    height += parseInt(j_to_box_style.getPropertyValue('padding-top'), 10)
                        + parseInt(j_to_box_style.getPropertyValue('padding-bottom'), 10)
                        + parseInt(j_to_box_style.getPropertyValue('border-top-width'), 10)
                        + parseInt(j_to_box_style.getPropertyValue('border-bottom-width'), 10);
                }

                j_to_box.style.height = height + 'px';
            }

            // Обновление иконок
            SelectFilter.refresh_icons(field_id);
        },

        // Проверка наличия выбранных элементов
        any_selected: function(field) {
            // Временное добавление атрибута required и проверка валидности
            field.required = true;
            const any_selected = field.checkValidity();
            field.required = false;
            return any_selected;
        },

        // Обновление состояния иконок
        refresh_icons: function(field_id) {
            const from = document.getElementById(field_id + '_from');
            const to = document.getElementById(field_id + '_to');
            // Активность, если хотя бы один элемент выбран
            document.getElementById(field_id + '_add_link').classList.toggle('active', SelectFilter.any_selected(from));
            document.getElementById(field_id + '_remove_link').classList.toggle('active', SelectFilter.any_selected(to));
            // Активность, если соответствующая область не пуста
            document.getElementById(field_id + '_add_all_link').classList.toggle('active', from.querySelector('option'));
            document.getElementById(field_id + '_remove_all_link').classList.toggle('active', to.querySelector('option'));
        },

        // Обработка нажатия клавиши в поле фильтра при нажатии Enter
        filter_key_press: function(event, field_id) {
            const from = document.getElementById(field_id + '_from');
            // не отправлять форму при нажатии Enter
            if ((event.which && event.which === 13) || (event.keyCode && event.keyCode === 13)) {
                from.selectedIndex = 0;
                SelectBox.move(field_id + '_from', field_id + '_to');
                from.selectedIndex = 0;
                event.preventDefault();
            }
        },

        // Фильтрация при отпускании клавиши в поле фильтра
        filter_key_up: function(event, field_id) {
            const from = document.getElementById(field_id + '_from');
            const temp = from.selectedIndex;
            SelectBox.filter(field_id + '_from', document.getElementById(field_id + '_input').value);
            from.selectedIndex = temp;
        },

        // Навигация с клавиатуры
        filter_key_down: function(event, field_id) {
            const from = document.getElementById(field_id + '_from');
            // стрелка вправо -- перемещение
            if ((event.which && event.which === 39) || (event.keyCode && event.keyCode === 39)) {
                const old_index = from.selectedIndex;
                SelectBox.move(field_id + '_from', field_id + '_to');
                from.selectedIndex = (old_index === from.length) ? from.length - 1 : old_index;
                return;
            }
            // стрелка вниз -- обернуть
            if ((event.which && event.which === 40) || (event.keyCode && event.keyCode === 40)) {
                from.selectedIndex = (from.length === from.selectedIndex + 1) ? 0 : from.selectedIndex + 1;
            }
            // стрелка вверх -- обернуть
            if ((event.which && event.which === 38) || (event.keyCode && event.keyCode === 38)) {
                from.selectedIndex = (from.selectedIndex === 0) ? from.length - 1 : from.selectedIndex - 1;
            }
        }
    };

    // Инициализация SelectFilter для всех select с классом .selectfilter или .selectfilterstacked
    window.addEventListener('load', function(e) {
        document.querySelectorAll('select.selectfilter, select.selectfilterstacked').forEach(function(el) {
            const data = el.dataset;
            SelectFilter.init(el.id, data.fieldName, parseInt(data.isStacked, 10));
        });
    });
}
