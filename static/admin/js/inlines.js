/*global DateTimeShortcuts, SelectFilter*/
/**
 * Django admin inlines
 *
 * Основано на jQuery Formset 1.1
 * @author Stanislaus Madueke (stan DOT madueke AT gmail DOT com)
 * @requires jQuery 1.2.6 or later
 *
 * Авторские права (c) 2009, Stanislaus Madueke
 * Все права защищены.
 *
 * Добавлены элементы из проекта GSoC 2009 Зейна Мемона
 * и изменены для Django Яннисом Лейделом, Трэвисом Свисгудом и Жюлиеном Фалипом.
 *
 * Лицензия New BSD License
 * См.: https://opensource.org/licenses/bsd-license.php
 */
'use strict';
{
    const $ = django.jQuery;  // Используем jQuery, загруженный Django

    // Функция для создания и управления формсетами
    $.fn.formset = function(opts) {
        // Расширяем настройки по умолчанию переданными параметрами
        const options = $.extend({}, $.fn.formset.defaults, opts);
        const $this = $(this);  // Текущий элемент jQuery, к которому применяется плагин
        const $parent = $this.parent();  // Родительский элемент для текущего формсета

        // Функция для обновления индексов элементов
        const updateElementIndex = function(el, prefix, ndx) {
            const id_regex = new RegExp("(" + prefix + "-(\\d+|__prefix__))");
            const replacement = prefix + "-" + ndx;
            if ($(el).prop("for")) {
                $(el).prop("for", $(el).prop("for").replace(id_regex, replacement));
            }
            if (el.id) {
                el.id = el.id.replace(id_regex, replacement);
            }
            if (el.name) {
                el.name = el.name.replace(id_regex, replacement);
            }
        };

        // Получаем элементы для управления количеством форм
        const totalForms = $("#id_" + options.prefix + "-TOTAL_FORMS").prop("autocomplete", "off");
        let nextIndex = parseInt(totalForms.val(), 10);
        const maxForms = $("#id_" + options.prefix + "-MAX_NUM_FORMS").prop("autocomplete", "off");
        const minForms = $("#id_" + options.prefix + "-MIN_NUM_FORMS").prop("autocomplete", "off");
        let addButton;

        /**
         * Функция для добавления кнопки "Добавить еще"
         */
        const addInlineAddButton = function() {
            if (addButton === null) {
                if ($this.prop("tagName") === "TR") {
                    // Если формы представлены в виде строк таблицы, добавляем кнопку в новую строку таблицы
                    const numCols = $this.eq(-1).children().length;
                    $parent.append('<tr class="' + options.addCssClass + '"><td colspan="' + numCols + '"><a href="#">' + options.addText + "</a></tr>");
                    addButton = $parent.find("tr:last a");
                } else {
                    // Иначе добавляем кнопку сразу после последней формы
                    $this.filter(":last").after('<div class="' + options.addCssClass + '"><a href="#">' + options.addText + "</a></div>");
                    addButton = $this.filter(":last").next().find("a");
                }
            }
            addButton.on('click', addInlineClickHandler);
        };

        // Обработчик клика по кнопке "Добавить еще"
        const addInlineClickHandler = function(e) {
            e.preventDefault();
            const template = $("#" + options.prefix + "-empty");
            const row = template.clone(true);
            row.removeClass(options.emptyCssClass)
                .addClass(options.formCssClass)
                .attr("id", options.prefix + "-" + nextIndex);
            addInlineDeleteButton(row);
            row.find("*").each(function() {
                updateElementIndex(this, options.prefix, totalForms.val());
            });
            // Вставляем новую форму после редактирования
            row.insertBefore($(template));
            // Обновляем количество общих форм
            $(totalForms).val(parseInt(totalForms.val(), 10) + 1);
            nextIndex += 1;
            // Скрываем кнопку добавления, если достигнут лимит и добавление невозможно
            if ((maxForms.val() !== '') && (maxForms.val() - totalForms.val()) <= 0) {
                addButton.parent().hide();
            }
            // Показываем кнопки удаления, если количество форм больше минимального
            toggleDeleteButtonVisibility(row.closest('.inline-group'));

            // Вызываем коллбэк после добавления формы, если он задан
            if (options.added) {
                options.added(row);
            }
            $(document).trigger('formset:added', [row, options.prefix]);
        };

        /**
         * Функция для добавления кнопки удаления
         */
        const addInlineDeleteButton = function(row) {
            if (row.is("tr")) {
                // Если формы представлены в виде строк таблицы, добавляем кнопку в последнюю ячейку
                row.children(":last").append('<div><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></div>");
            } else if (row.is("ul") || row.is("ol")) {
                // Если формы представлены как список (ul или ol), добавляем в последний элемент списка
                row.append('<li><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></li>");
            } else {
                // Иначе добавляем кнопку удаления как последний элемент контейнера формы
                row.children(":first").append('<span><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></span>");
            }
            // Добавляем обработчик клика для кнопки удаления
            row.find("a." + options.deleteCssClass).on('click', inlineDeleteHandler.bind(this));
        };

        // Обработчик удаления формы
        const inlineDeleteHandler = function(e1) {
            e1.preventDefault();
            const deleteButton = $(e1.target);
            const row = deleteButton.closest('.' + options.formCssClass);
            const inlineGroup = row.closest('.inline-group');
            // Удаляем родительскую форму и соответствующую строку с ошибками
            const prevRow = row.prev();
            if (prevRow.length && prevRow.hasClass('row-form-errors')) {
                prevRow.remove();
            }
            row.remove();
            nextIndex -= 1;
            // Вызываем коллбэк после удаления формы, если он задан
            if (options.removed) {
                options.removed(row);
            }
            $(document).trigger('formset:removed', [row, options.prefix]);
            // Обновляем количество общих форм
            const forms = $("." + options.formCssClass);
            $("#id_" + options.prefix + "-TOTAL_FORMS").val(forms.length);
            // Показываем кнопку добавления, если количество форм меньше максимального
            if ((maxForms.val() === '') || (maxForms.val() - forms.length) > 0) {
                addButton.parent().show();
            }
            // Обновляем имена и id для всех оставшихся элементов формы
            let i, formCount;
            const updateElementCallback = function() {
                updateElementIndex(this, options.prefix, i);
            };
            for (i = 0, formCount = forms.length; i < formCount; i++) {
                updateElementIndex($(forms).get(i), options.prefix, i);
                $(forms.get(i)).find("*").each(updateElementCallback);
            }
        };

        // Функция для переключения видимости кнопок удаления
        const toggleDeleteButtonVisibility = function(inlineGroup) {
            if ((minForms.val() !== '') && (minForms.val() - totalForms.val()) >= 0) {
                inlineGroup.find('.inline-deletelink').hide();
            } else {
                inlineGroup.find('.inline-deletelink').show();
            }
        };

        // Добавляем CSS классы к каждой форме в формсете, исключая пустые и оригинальные
        $this.each(function(i) {
            $(this).not("." + options.emptyCssClass).addClass(options.formCssClass);
        });

        // Создаем кнопки удаления для всех форм в формсете
        $this.filter('.' + options.formCssClass + ':not(.has_original):not(.' + options.empty

        // Создаем кнопки удаления для всех форм в формсете
        $this.filter('.' + options.formCssClass + ':not(.has_original):not(.' + options.emptyCssClass + ')').each(function() {
        // Каждый раз вызываем функцию addInlineDeleteButton() для добавления кнопки удаления
            addInlineDeleteButton($(this));
        });
        // Переключаем видимость кнопок удаления в зависимости от минимального количества форм
        toggleDeleteButtonVisibility($this);

        // Создаем кнопку добавления, изначально скрытую
        addButton = options.addButton;
        addInlineAddButton();

        // Показываем кнопку добавления, если есть возможность добавлять дополнительные элементы
        const showAddButton = maxForms.val() === '' || (maxForms.val() - totalForms.val()) > 0;
        if ($this.length && showAddButton) {
            addButton.parent().show();
        } else {
            addButton.parent().hide();
        }

        return this;
    };

    // Настройки плагина по умолчанию
    $.fn.formset.defaults = {
        prefix: "form", // Префикс формы Django
        addText: "add another", // Текст для ссылки добавления
        deleteText: "remove", // Текст для ссылки удаления
        addCssClass: "add-row", // CSS класс для ссылки добавления
        deleteCssClass: "delete-row", // CSS класс для ссылки удаления
        emptyCssClass: "empty-row", // CSS класс для пустой строки
        formCssClass: "dynamic-form", // CSS класс для каждой формы в формсете
        added: null, // Функция, вызываемая после добавления новой формы
        removed: null, // Функция, вызываемая после удаления формы
        addButton: null // Существующая кнопка добавления для использования
    };


    // Табличные формы встраиваемых объектов
    $.fn.tabularFormset = function(selector, options) {
        const $rows = $(this);

        // Функция для повторной инициализации DateTimeShortcuts
        const reinitDateTimeShortCuts = function() {
            // Переинициализируем календарь и часы
            if (typeof DateTimeShortcuts !== "undefined") {
                $(".datetimeshortcuts").remove();
                DateTimeShortcuts.init();
            }
        };

        // Функция для обновления SelectFilter
        const updateSelectFilter = function() {
            // Если есть SelectFilter, инициализируем его
            if (typeof SelectFilter !== 'undefined') {
                $('.selectfilter').each(function(index, value) {
                    const namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], false);
                });
                $('.selectfilterstacked').each(function(index, value) {
                    const namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], true);
                });
            }
        };

        // Функция для инициализации предварительно заполненных полей
        const initPrepopulatedFields = function(row) {
            row.find('.prepopulated_field').each(function() {
                const field = $(this),
                    input = field.find('input, select, textarea'),
                    dependency_list = input.data('dependency_list') || [],
                    dependencies = [];
                $.each(dependency_list, function(i, field_name) {
                    dependencies.push('#' + row.find('.form-row .field-' + field_name).find('input, select, textarea').attr('id'));
                });
                if (dependencies.length) {
                    input.prepopulate(dependencies, input.attr('maxlength'));
                }
            });
        };

        // Используем функцию formset для строковых форм встраиваемых объектов
        $rows.formset({
            prefix: options.prefix,
            addText: options.addText,
            formCssClass: "dynamic-" + options.prefix,
            deleteCssClass: "inline-deletelink",
            deleteText: options.deleteText,
            emptyCssClass: "empty-form",
            added: function(row) {
                initPrepopulatedFields(row);
                reinitDateTimeShortCuts();
                updateSelectFilter();
            },
            addButton: options.addButton
        });

        return $rows;
    };

    // Стопочные формы встраиваемых объектов
    $.fn.stackedFormset = function(selector, options) {
        const $rows = $(this);

        // Функция для обновления метки встраиваемого объекта
        const updateInlineLabel = function(row) {
            $(selector).find(".inline_label").each(function(i) {
                const count = i + 1;
                $(this).html($(this).html().replace(/(#\d+)/g, "#" + count));
            });
        };

        // Функция для повторной инициализации DateTimeShortcuts
        const reinitDateTimeShortCuts = function() {
            // Переинициализируем календарь и часы
            if (typeof DateTimeShortcuts !== "undefined") {
                $(".datetimeshortcuts").remove();
                DateTimeShortcuts.init();
            }
        };

        // Функция для обновления SelectFilter
        const updateSelectFilter = function() {
            // Если есть SelectFilter, инициализируем его
            if (typeof SelectFilter !== "undefined") {
                $(".selectfilter").each(function(index, value) {
                    const namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], false);
                });
                $(".selectfilterstacked").each(function(index, value) {
                    const namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], true);
                });
            }
        };

        // Функция для инициализации предварительно заполненных полей
        const initPrepopulatedFields = function(row) {
            row.find('.prepopulated_field').each(function() {
                const field = $(this),
                    input = field.find('input, select, textarea'),
                    dependency_list = input.data('dependency_list') || [],
                    dependencies = [];
                $.each(dependency_list, function(i, field_name) {
                    dependencies.push('#' + row.find('.form-row .field-' + field_name).find('input, select, textarea').attr('id'));
                });
                if (dependencies.length) {
                    input.prepopulate(dependencies, input.attr('maxlength'));
                }
            });
        };

        // Используем функцию formset для стопочных форм встраиваемых объектов
        $rows.formset({
            prefix: options.prefix,
            addText: options.addText,
            formCssClass: "dynamic-" + options.prefix,
            deleteCssClass: "inline-deletelink",
            deleteText: options.deleteText,
            emptyCssClass: "empty-form",
            removed: updateInlineLabel,
            added: function(row) {
                initPrepopulatedFields(row);
                reinitDateTimeShortCuts();
                updateSelectFilter();
                updateInlineLabel(row);
            },
            addButton: options.addButton
        });

        return $rows;
    };

    // Готовность документа
    $(document).ready(function() {
        // Для каждого встроенного формсета на странице
        $(".js-inline-admin-formset").each(function() {
            // Получаем данные и параметры формсета
            const data = $(this).data(),
                inlineOptions = data.inlineFormset;
            let selector;
            // В зависимости от типа встроенного формсета (stacked или tabular) инициализируем соответствующую функцию
            switch (data.inlineType) {
                case "stacked":
                    selector = inlineOptions.name + "-group .inline-related";
                    $(selector).stackedFormset(selector, inlineOptions.options);
                    break;
                case "tabular":
                    selector = inlineOptions.name + "-group .tabular.inline-related tbody:first > tr.form-row";
                    $(selector).tabularFormset(selector, inlineOptions.options);
                    break;
            }
        });
    });
}