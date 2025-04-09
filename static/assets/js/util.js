(function($) {

	/**
	 * Генерирует отступленный список ссылок из навигации. Предназначен для использования с panel().
	 * @return {jQuery} jQuery объект.
	 */
	$.fn.navList = function() {

		var	$this = $(this),    // Сохраняем текущий jQuery объект
			$a = $this.find('a'),  // Находим все ссылки внутри элемента
			b = [];  // Создаем пустой массив для хранения сгенерированных строк

		$a.each(function() {

			var	$this = $(this),  // Сохраняем текущий jQuery объект ссылки
				indent = Math.max(0, $this.parents('li').length - 1),  // Вычисляем уровень вложенности элемента li
				href = $this.attr('href'),  // Получаем значение атрибута href
				target = $this.attr('target');  // Получаем значение атрибута target

			b.push(
				'<a ' +
					'class="link depth-' + indent + '"' +  // Добавляем класс с учетом уровня вложенности
					( (typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +  // Добавляем атрибут target, если он задан
					( (typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +  // Добавляем атрибут href, если он задан
				'>' +
					'<span class="indent-' + indent + '"></span>' +  // Добавляем элемент для отображения отступа
					$this.text() +  // Добавляем текст ссылки
				'</a>'
			);

		});

		return b.join('');  // Возвращаем объединенный массив строк как строку HTML

	};

	/**
	 * Преобразует элемент в панель.
	 * @param {object} userConfig Пользовательская конфигурация.
	 * @return {jQuery} jQuery объект.
	 */
	$.fn.panel = function(userConfig) {

		// Если нет элементов, возвращаем текущий объект jQuery
		if (this.length == 0)
			return $this;

		// Если элементов больше одного, применяем panel() к каждому из них и возвращаем текущий объект jQuery
		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i]).panel(userConfig);

			return $this;

		}

		// Определяем переменные
		var	$this = $(this),  // Сохраняем текущий jQuery объект
			$body = $('body'),  // Сохраняем объект body
			$window = $(window),  // Сохраняем объект window
			id = $this.attr('id'),  // Получаем значение атрибута id текущего элемента
			config;

		// Настройки по умолчанию и пользовательская конфигурация
		config = $.extend({

			// Задержка
			delay: 0,

			// Скрытие панели при клике на ссылку внутри
			hideOnClick: false,

			// Скрытие панели при нажатии клавиши Escape
			hideOnEscape: false,

			// Скрытие панели при свайпе
			hideOnSwipe: false,

			// Восстановление позиции скролла при скрытии
			resetScroll: false,

			// Очистка форм при скрытии
			resetForms: false,

			// Сторона экрана, с которой появляется панель
			side: null,

			// Целевой элемент для добавления класса видимости
			target: $this,

			// Класс для переключения видимости
			visibleClass: 'visible'

		}, userConfig);

		// Если target не является объектом jQuery, преобразуем его
		if (typeof config.target != 'jQuery')
			config.target = $(config.target);

		// Определение метода _hide для скрытия панели
		$this._hide = function(event) {

			// Если панель уже скрыта, прерываем выполнение
			if (!config.target.hasClass(config.visibleClass))
				return;

			// Если предоставлено событие, отменяем его действие
			if (event) {

				event.preventDefault();
				event.stopPropagation();

			}

			// Скрытие панели
			config.target.removeClass(config.visibleClass);

			// Дополнительные действия после скрытия
			window.setTimeout(function() {

				// Сброс позиции скролла
				if (config.resetScroll)
					$this.scrollTop(0);

				// Очистка форм
				if (config.resetForms)
					$this.find('form').each(function() {
						this.reset();
					});

			}, config.delay);

		};

		// Применение вендорных фиксов для панели
		$this
			.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
			.css('-webkit-overflow-scrolling', 'touch');

		// Скрытие панели при клике на ссылку внутри, если установлен параметр hideOnClick
		if (config.hideOnClick) {

			$this.find('a')
				.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

			$this
				.on('click', 'a', function(event) {

					var $a = $(this),
						href = $a.attr('href'),
						target = $a.attr('target');

					// Если ссылка пустая или указывает на текущий элемент, прерываем выполнение
					if (!href || href == '#' || href == '' || href == '#' + id)
						return;

					// Отмена исходного события
					event.preventDefault();
					event.stopPropagation();

					// Скрытие панели
					$this._hide();

					// Перенаправление по указанной ссылке
					window.setTimeout(function() {

						if (target == '_blank')
							window.open(href);  // Открытие ссылки в новой вкладке
						else
							window.location.href = href;  // Перенаправление на указанный URL

					}, config.delay + 10);

				});

		        }

							// Событие: Touch stuff.
				$this.on('touchstart', function(event) {
					// Запоминаем позицию касания по X и Y
					$this.touchPosX = event.originalEvent.touches[0].pageX;
					$this.touchPosY = event.originalEvent.touches[0].pageY;
				})

				$this.on('touchmove', function(event) {
					// Если не запомнили позицию касания, выходим
					if ($this.touchPosX === null || $this.touchPosY === null)
						return;

					// Вычисляем разницу в координатах по X и Y
					var	diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
						diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
						th = $this.outerHeight(),
						ts = ($this.get(0).scrollHeight - $this.scrollTop());

					// Скрытие панели при свайпе, если установлен параметр hideOnSwipe
					if (config.hideOnSwipe) {
						var result = false,
							boundary = 20,
							delta = 50;

						switch (config.side) {
							// Определяем, какое направление свайпа проверяем
							case 'left':
								result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
								break;

							case 'right':
								result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
								break;

							case 'top':
								result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
								break;

							case 'bottom':
								result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
								break;

							default:
								break;
						}

						// Если свайп обнаружен, скрываем панель
						if (result) {
							$this.touchPosX = null;
							$this.touchPosY = null;
							$this._hide();

							return false;
						}
					}

					// Предотвращаем вертикальную прокрутку за границы верха или низа панели
					if (($this.scrollTop() < 0 && diffY < 0)
						|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {
						event.preventDefault();
						event.stopPropagation();
					}
				});

			// Событие: Предотвращение всплытия событий внутри панели
				$this.on('click touchend touchstart touchmove', function(event) {
					event.stopPropagation();
				});

			// Событие: Скрытие панели при клике на дочерний элемент ссылки с атрибутом href равным id текущей панели
				$this.on('click', 'a[href="#' + id + '"]', function(event) {
					event.preventDefault();
					event.stopPropagation();

					config.target.removeClass(config.visibleClass);
				});

		// Body.

			// Событие: Скрытие панели при клике/таче на body
				$body.on('click touchend', function(event) {
					$this._hide(event);
				});

			// Событие: Переключение видимости панели при клике на ссылку с атрибутом href равным id текущей панели
				$body.on('click', 'a[href="#' + id + '"]', function(event) {
					event.preventDefault();
					event.stopPropagation();

					config.target.toggleClass(config.visibleClass);
				});

		// Window.

			// Событие: Скрытие панели при нажатии клавиши ESC
				if (config.hideOnEscape)
					$window.on('keydown', function(event) {
						if (event.keyCode == 27)
							$this._hide(event);
					});

		return $this;

	};

	/**
	 * Применяет полифилл для атрибута "placeholder" для одной или нескольких форм.
	 * @return {jQuery} jQuery объект.
	 */
	$.fn.placeholder = function() {

		// Браузер поддерживает атрибут placeholder нативно? Выходим.
		if (typeof (document.createElement('input')).placeholder != 'undefined')
			return $(this);

		// Нет элементов? Возвращаем текущий объект jQuery.
		if (this.length == 0)
			return $this;

		// Если элементов больше одного, применяем placeholder() к каждому из них и возвращаем текущий объект jQuery.
		if (this.length > 1) {
			for (var i=0; i < this.length; i++)
				$(this[i]).placeholder();
			return $this;
		}


				// Переменные.
		var $this = $(this);

		// Поля типа Text и TextArea.
		$this.find('input[type=text],textarea')
			.each(function() {
				var i = $(this);

				// Если значение поля пустое или равно placeholder, добавляем класс polyfill-placeholder и устанавливаем значение placeholder.
				if (i.val() == '' || i.val() == i.attr('placeholder')) {
					i.addClass('polyfill-placeholder').val(i.attr('placeholder'));
				}
			})
			.on('blur', function() {
				var i = $(this);

				// Если имя атрибута содержит "-polyfill-field", выходим.
				if (i.attr('name').match(/-polyfill-field$/)) {
					return;
				}

				// Если значение поля пустое, добавляем класс polyfill-placeholder и устанавливаем значение placeholder.
				if (i.val() == '') {
					i.addClass('polyfill-placeholder').val(i.attr('placeholder'));
				}
			})
			.on('focus', function() {
				var i = $(this);

				// Если имя атрибута содержит "-polyfill-field", выходим.
				if (i.attr('name').match(/-polyfill-field$/)) {
					return;
				}

				// Если значение поля равно placeholder, удаляем класс polyfill-placeholder и очищаем значение.
				if (i.val() == i.attr('placeholder')) {
					i.removeClass('polyfill-placeholder').val('');
				}
			});

		// Поля типа Password.
		$this.find('input[type=password]')
			.each(function() {
				var i = $(this);
				var x = $( // Создаем копию поля Password в виде текстового поля
					$('<div>')
						.append(i.clone())
						.remove()
						.html()
						.replace(/type="password"/i, 'type="text"')
						.replace(/type=password/i, 'type=text')
				);

				// Устанавливаем id и name для копии поля Password
				if (i.attr('id') != '') {
					x.attr('id', i.attr('id') + '-polyfill-field');
				}
				if (i.attr('name') != '') {
					x.attr('name', i.attr('name') + '-polyfill-field');
				}

				// Добавляем класс polyfill-placeholder и устанавливаем значение placeholder для копии поля
				x.addClass('polyfill-placeholder').val(x.attr('placeholder')).insertAfter(i);

				// Скрываем оригинальное поле Password, если оно пустое, иначе скрываем копию
				if (i.val() == '') {
					i.hide();
				} else {
					x.hide();
				}

				// Обработчики событий для оригинального поля и его копии
				i.on('blur', function(event) {
					event.preventDefault();

					var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

					// Если значение оригинального поля пустое, скрываем его и показываем копию
					if (i.val() == '') {
						i.hide();
						x.show();
					}
				});

				x.on('focus', function(event) {
					event.preventDefault();

					var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');

					// Скрываем копию и показываем оригинальное поле
					x.hide();
					i.show().focus();
				}).on('keypress', function(event) {
					// Предотвращаем ввод символов в копии поля Password
					event.preventDefault();
					x.val('');
				});
			});

		// Обработчики событий для формы
		$this.on('submit', function() {
			$this.find('input[type=text],input[type=password],textarea')
				.each(function(event) {
					var i = $(this);

					// Если имя атрибута содержит "-polyfill-field", удаляем атрибут
					if (i.attr('name').match(/-polyfill-field$/)) {
						i.attr('name', '');
					}

					// Если значение поля равно placeholder, удаляем класс polyfill-placeholder и очищаем значение
					if (i.val() == i.attr('placeholder')) {
						i.removeClass('polyfill-placeholder');
						i.val('');
					}
				});
		})

		// Обработчик события reset для формы.
		.on('reset', function(event) {
			event.preventDefault();

			// Сбрасываем значения для всех select на первое значение.
			$this.find('select')
				.val($('option:first').val());

			// Сбрасываем значения для всех input и textarea.
			$this.find('input,textarea')
				.each(function() {
					var i = $(this),
						x;

					// Удаляем класс polyfill-placeholder.
					i.removeClass('polyfill-placeholder');

					// В зависимости от типа элемента восстанавливаем его значение.
					switch (this.type) {

						case 'submit':
						case 'reset':
							// Для кнопок submit и reset ничего не делаем.
							break;

						case 'password':
							// Для полей типа password.
							i.val(i.attr('defaultValue'));

							// Находим копию поля и восстанавливаем видимость в зависимости от значения.
							x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

							if (i.val() == '') {
								i.hide();
								x.show();
							} else {
								i.show();
								x.hide();
							}

							break;

						case 'checkbox':
						case 'radio':
							// Для чекбоксов и радиокнопок устанавливаем состояние checked в значение по умолчанию.
							i.attr('checked', i.attr('defaultValue'));
							break;

						case 'text':
						case 'textarea':
							// Для полей типа text и textarea.
							i.val(i.attr('defaultValue'));

							// Если значение поля пустое, восстанавливаем класс polyfill-placeholder и значение placeholder.
							if (i.val() == '') {
								i.addClass('polyfill-placeholder');
								i.val(i.attr('placeholder'));
							}

							break;

						default:
							// Для остальных типов полей просто восстанавливаем значение по умолчанию.
							i.val(i.attr('defaultValue'));
							break;

					}
				});
		});

	return $this;

};

/**
 * Перемещает элементы в начало или возвращает на исходные позиции в их родителях.
 * @param {jQuery} $elements Элементы (или селектор), которые нужно переместить.
 * @param {bool} condition Если true, перемещает элементы в начало. В противном случае возвращает элементы на исходные позиции.
 */
$.prioritize = function($elements, condition) {
	var key = '__prioritize';

	// Расширяем $elements, если он еще не является объектом jQuery.
	if (typeof $elements != 'jQuery')
		$elements = $($elements);

	// Обходим каждый элемент.
	$elements.each(function() {
		var $e = $(this),
			$p,
			$parent = $e.parent();

		// Если нет родителя, выходим.
		if ($parent.length == 0)
			return;

		// Если элемент еще не перемещен, перемещаем его.
		if (!$e.data(key)) {

			// Если condition равно false, выходим.
			if (!condition)
				return;

			// Получаем placeholder (это будет точка отсчета для возврата элемента на исходную позицию).
			$p = $e.prev();

			// Если не удалось найти placeholder, значит элемент уже находится в начале, выходим.
			if ($p.length == 0)
				return;

			// Перемещаем элемент в начало родителя.
			$e.prependTo($parent);

			// Отмечаем элемент как перемещенный.
			$e.data(key, $p);
		}
		// Если элемент уже перемещен.
		else {

			// Если condition равно true, выходим.
			if (condition)
				return;

			$p = $e.data(key);

			// Возвращаем элемент на его исходную позицию (используя placeholder).
			$e.insertAfter($p);

			// Убираем отметку о перемещении элемента.
			$e.removeData(key);
		}
	});
};
})(jQuery);
