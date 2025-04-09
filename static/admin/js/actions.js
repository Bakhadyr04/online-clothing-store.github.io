/*global gettext, interpolate, ngettext*/
'use strict';

{
    // Функция для показа элементов с указанным селектором
    function show(selector) {
        document.querySelectorAll(selector).forEach(function(el) {
            el.classList.remove('hidden'); // Удаляем класс "hidden", чтобы показать элементы
        });
    }

    // Функция для скрытия элементов с указанным селектором
    function hide(selector) {
        document.querySelectorAll(selector).forEach(function(el) {
            el.classList.add('hidden'); // Добавляем класс "hidden", чтобы скрыть элементы
        });
    }

    // Показывает вопросы для выполнения действия
    function showQuestion(options) {
        hide(options.acrossClears); // Скрываем элементы, связанные с очисткой
        show(options.acrossQuestions); // Показываем элементы с вопросами
        hide(options.allContainer); // Скрываем контейнер "Все"
    }

    // Показывает опцию очистки выбора
    function showClear(options) {
        show(options.acrossClears); // Показываем элементы для очистки выбора
        hide(options.acrossQuestions); // Скрываем элементы с вопросами
        document.querySelector(options.actionContainer).classList.remove(options.selectedClass); // Удаляем класс выбранности у контейнера действия
        show(options.allContainer); // Показываем контейнер "Все"
        hide(options.counterContainer); // Скрываем счетчик
    }

    // Сбрасывает интерфейс в начальное состояние
    function reset(options) {
        hide(options.acrossClears); // Скрываем элементы для очистки выбора
        hide(options.acrossQuestions); // Скрываем элементы с вопросами
        hide(options.allContainer); // Скрываем контейнер "Все"
        show(options.counterContainer); // Показываем счетчик
    }

    // Очищает выбор на всей странице
    function clearAcross(options) {
        reset(options); // Сбрасываем интерфейс
        const acrossInputs = document.querySelectorAll(options.acrossInput); // Получаем все элементы для выбора через всю страницу
        acrossInputs.forEach(function(acrossInput) {
            acrossInput.value = 0; // Устанавливаем значение "0" для каждого элемента выбора
        });
        document.querySelector(options.actionContainer).classList.remove(options.selectedClass); // Удаляем класс выбранности у контейнера действия
    }

    // Проверяет состояние чекбоксов и обновляет интерфейс
    function checker(actionCheckboxes, options, checked) {
        if (checked) {
            showQuestion(options); // Показываем вопросы, если чекбокс выбран
        } else {
            reset(options); // Иначе сбрасываем интерфейс
        }
        actionCheckboxes.forEach(function(el) {
            el.checked = checked; // Устанавливаем состояние чекбокса
            el.closest('tr').classList.toggle(options.selectedClass, checked); // Добавляем или удаляем класс выбранности для строки таблицы
        });
    }

    // Обновляет счетчик выбранных элементов и взаимодействует с интерфейсом
    function updateCounter(actionCheckboxes, options) {
        const sel = Array.from(actionCheckboxes).filter(function(el) {
            return el.checked; // Фильтруем выбранные чекбоксы
        }).length;
        const counter = document.querySelector(options.counterContainer); // Получаем контейнер счетчика
        // data-actions-icnt is defined in the generated HTML
        // and contains the total amount of objects in the queryset
        const actions_icnt = Number(counter.dataset.actionsIcnt); // Получаем количество объектов в queryset из атрибута data-actions-icnt
        counter.textContent = interpolate(
            ngettext('%(sel)s of %(cnt)s selected', '%(sel)s of %(cnt)s selected', sel), {
                sel: sel,
                cnt: actions_icnt
            }, true); // Интерполируем текст с учетом количества выбранных элементов и общего числа
        const allToggle = document.getElementById(options.allToggleId); // Получаем чекбокс "Выбрать все"
        allToggle.checked = sel === actionCheckboxes.length; // Устанавливаем состояние чекбокса "Выбрать все"
        if (allToggle.checked) {
            showQuestion(options); // Показываем вопросы, если все элементы выбраны
        } else {
            clearAcross(options); // Иначе очищаем выбор на всей странице
        }
    }

    // Настройки по умолчанию для действий
    const defaults = {
        actionContainer: "div.actions",
        counterContainer: "span.action-counter",
        allContainer: "div.actions span.all",
        acrossInput: "div.actions input.select-across",
        acrossQuestions: "div.actions span.question",
        acrossClears: "div.actions span.clear",
        allToggleId: "action-toggle",
        selectedClass: "selected"
    };

    // Главная функция для управления действиями
    window.Actions = function(actionCheckboxes, options) {
        options = Object.assign({}, defaults, options); // Назначаем параметры по умолчанию и дополнительные параметры
        let list_editable_changed = false; // Флаг для отслеживания изменений в редактируемом списке
        let lastChecked = null; // Последний выбранный чекбокс
        let shiftPressed = false; // Флаг для отслеживания нажатия клавиши Shift

        // Слушатели событий клавиатуры для отслеживания нажатия Shift
        document.addEventListener('keydown', (event) => {
            shiftPressed = event.shiftKey; // Устанавливаем флаг, если нажата клавиша Shift
        });

        document.addEventListener('keyup', (event) => {
            shiftPressed = event.shiftKey; // Сбрасываем флаг при отпускании клавиши Shift
        });

        // Слушатель клика по чекбоксу "Выбрать все"
        document.getElementById(options.allToggleId).addEventListener('click', function(event) {
            checker(actionCheckboxes, options, this.checked); // Проверяем состояние чекбоксов
            updateCounter(actionCheckboxes, options); // Обновляем счетчик
        });

        // Слушатель кликов по ссылкам "Перейти ко всем" (для массовых действий)
        document.querySelectorAll(options.acrossQuestions + " a").forEach(function(el) {
            el.addEventListener('click', function(event) {
                event.preventDefault(); // Отменяем стандартное действие ссылки
                const acrossInputs = document.querySelectorAll(options.acrossInput); // Получаем элементы выбора через всю страницу
                acrossInputs.forEach(function(acrossInput) {
                    acrossInput.value = 1; // Устанавливаем значение "1" для каждого элемента выбора
                });
                showClear(options); // Показываем опцию очистки выбора
            });
        });

        // Слушатель кликов по ссылкам "Отменить" (для массовых действий)
        document.querySelectorAll(options.acrossClears + " a").forEach(function(el) {
            el.addEventListener('click', function(event) {
                event.preventDefault(); // Отменяем стандартное действие ссылки
                document.getElementById(options.allToggleId).checked = false; // Сбрасываем состояние чекбокса "Выбрать все"
                clearAcross(options); // Очищаем выбор на всей странице
                checker(actionCheckboxes, options, false); // Проверяем состояние чекбоксов
                updateCounter(actionCheckboxes, options); // Обновляем счетчик
            });
        });

                    // Функция для определения выбранных чекбоксов (с учетом Shift)
            function affectedCheckboxes(target, withModifier) {
                const multiSelect = (lastChecked && withModifier && lastChecked !== target); // Проверяем, является ли выбор множественным
                if (!multiSelect) {
                    return [target]; // Возвращаем выбранный чекбокс, если множественный выбор не активирован
                }
                const checkboxes = Array.from(actionCheckboxes); // Преобразуем коллекцию чекбоксов в массив
                const targetIndex = checkboxes.findIndex(el => el === target); // Индекс выбранного чекбокса
                const lastCheckedIndex = checkboxes.findIndex(el => el === lastChecked); // Индекс последнего выбранного чекбокса
                const startIndex = Math.min(targetIndex, lastCheckedIndex); // Начальный индекс для выбора чекбоксов
                const endIndex = Math.max(targetIndex, lastCheckedIndex); // Конечный индекс для выбора чекбоксов
                const filtered = checkboxes.filter((el, index) => (startIndex <= index) && (index <= endIndex)); // Фильтруем чекбоксы в заданном диапазоне
                return filtered; // Возвращаем отфильтрованный массив чекбоксов
            }

            // Слушатель изменений в таблице (например, изменение состояния чекбоксов)
            Array.from(document.getElementById('result_list').tBodies).forEach(function(el) {
                el.addEventListener('change', function(event) {
                    const target = event.target; // Целевой элемент, вызвавший событие изменения
                    if (target.classList.contains('action-select')) { // Проверяем, является ли целевой элемент чекбоксом для действий
                        const checkboxes = affectedCheckboxes(target, shiftPressed); // Получаем выбранные чекбоксы с учетом Shift
                        checker(checkboxes, options, target.checked); // Проверяем состояние чекбоксов
                        updateCounter(actionCheckboxes, options); // Обновляем счетчик
                        lastChecked = target; // Запоминаем последний выбранный чекбокс
                    } else {
                        list_editable_changed = true; // Устанавливаем флаг изменений в редактируемом списке
                    }
                });
            });

            // Предупреждение при попытке изменения несохраненных данных
            document.querySelector('#changelist-form button[name=index]').addEventListener('click', function() {
                if (list_editable_changed) { // Проверяем, были ли внесены изменения в редактируемый список
                    const confirmed = confirm(gettext("You have unsaved changes on individual editable fields. If you run an action, your unsaved changes will be lost.")); // Запрашиваем подтверждение перед продолжением действия
                    if (!confirmed) {
                        event.preventDefault(); // Отменяем стандартное действие события (переход по ссылке или отправка формы)
                    }
                }
            });

            // Предупреждение при нажатии на кнопку "Сохранить"
            const el = document.querySelector('#changelist-form input[name=_save]'); // Находим кнопку "Сохранить"
            if (el) {
                el.addEventListener('click', function(event) {
                    if (document.querySelector('[name=action]').value) { // Проверяем, выбрано ли какое-то действие
                        const text = list_editable_changed
                            ? gettext("You have selected an action, but you haven’t saved your changes to individual fields yet. Please click OK to save. You’ll need to re-run the action.")
                            : gettext("You have selected an action, and you haven’t made any changes on individual fields. You’re probably looking for the Go button rather than the Save button."); // Выводим текст предупреждения в зависимости от изменений в редактируемом списке
                        if (!confirm(text)) {
                            event.preventDefault(); // Отменяем стандартное действие события (отправка формы)
                        }
                    }
                });
            }
        };

        // Функция для выполнения кода после загрузки DOM
        function ready(fn) {
            if (document.readyState !== 'loading') {
                fn(); // Вызываем функцию немедленно, если DOM уже загружен
            } else {
                document.addEventListener('DOMContentLoaded', fn); // Иначе ждем загрузки DOM и затем вызываем функцию
            }
        }

        // Вызываем функцию Actions при загрузке страницы, если есть чекбоксы действий
        ready(function() {
            const actionsEls = document.querySelectorAll('tr input.action-select'); // Находим все чекбоксы действий в таблице
            if (actionsEls.length > 0) {
                Actions(actionsEls); // Вызываем функцию Actions для управления этими чекбоксами
            }
        });
    }
}
