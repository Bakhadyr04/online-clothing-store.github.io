/*
	Phantom от HTML5 UP
	html5up.net | @ajlkn
	Бесплатно для личного и коммерческого использования по лицензии CCA 3.0 (html5up.net/license)
*/

(function($) {

	var	$window = $(window), // Объявляем переменную для объекта окна браузера
		$body = $('body'); // Объявляем переменную для объекта тела страницы

	// Настройка точек разрыва (breakpoints).
	breakpoints({
		xlarge:   [ '1281px',  '1680px' ], // Экраны extra large (больше 1280px, но меньше или равно 1680px)
		large:    [ '981px',   '1280px' ], // Экраны large (больше 980px, но меньше или равно 1280px)
		medium:   [ '737px',   '980px'  ], // Экраны medium (больше 736px, но меньше или равно 980px)
		small:    [ '481px',   '736px'  ], // Экраны small (больше 480px, но меньше или равно 736px)
		xsmall:   [ '361px',   '480px'  ], // Экраны extra small (больше 360px, но меньше или равно 480px)
		xxsmall:  [ null,      '360px'  ]  // Экраны очень маленькие (меньше или равно 360px)
	});

	// Запуск начальных анимаций при загрузке страницы.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload'); // Удаляем класс is-preload у body после загрузки страницы
		}, 100); // Задержка 100 мс
	});

	// Экран сенсорный?
	if (browser.mobile)
		$body.addClass('is-touch'); // Добавляем класс is-touch к body, если используется сенсорный экран

	// Работа с формами.
	var $form = $('form');

	// Автоматическое изменение размеров текстовых полей.
	$form.find('textarea').each(function() {

		var $this = $(this), // Текущее текстовое поле
			$wrapper = $('<div class="textarea-wrapper"></div>'), // Обертка для текстового поля
			$submits = $this.find('input[type="submit"]'); // Кнопки submit в форме

		$this
			.wrap($wrapper) // Оборачиваем текстовое поле в $wrapper
			.attr('rows', 1) // Устанавливаем изначальное количество строк равным 1
			.css('overflow', 'hidden') // Скрываем возможные переполнения текстового поля
			.css('resize', 'none') // Отключаем возможность изменения размера текстового поля пользователем
			.on('keydown', function(event) { // Обработчик события нажатия клавиш

				if (event.keyCode == 13 // Если нажата клавиша Enter
				&&	event.ctrlKey) { // И удерживается Ctrl

					event.preventDefault(); // Предотвращаем стандартное действие
					event.stopPropagation(); // Останавливаем всплытие события

					$(this).blur(); // Убираем фокус с текущего текстового поля

				}

			})
			.on('blur focus', function() { // Обработчик событий blur и focus

				$this.val($.trim($this.val())); // Удаляем лишние пробелы в начале и конце значения

			})
			.on('input blur focus --init', function() { // Обработчик событий input, blur и focus (инициализация)

				$wrapper
					.css('height', $this.height()); // Устанавливаем высоту обертки равной высоте текстового поля

				$this
					.css('height', 'auto') // Автоматический размер высоты текстового поля
					.css('height', $this.prop('scrollHeight') + 'px'); // Устанавливаем высоту текстового поля равной высоте прокрутки

			})
			.on('keyup', function(event) { // Обработчик события отпускания клавиши

				if (event.keyCode == 9) // Если нажата клавиша Tab
					$this
						.select(); // Выделяем содержимое текстового поля

			})
			.triggerHandler('--init'); // Инициируем обработчик события

		// Исправление для браузеров.
		if (browser.name == 'ie' // Если браузер Internet Explorer
		||	browser.mobile) // Или используется мобильный браузер
			$this
				.css('max-height', '10em') // Устанавливаем максимальную высоту текстового поля
				.css('overflow-y', 'auto'); // Разрешаем вертикальную прокрутку

	});

	// Меню.
	var $menu = $('#menu'); // Выбираем меню по его идентификатору

	$menu.wrapInner('<div class="inner"></div>'); // Оборачиваем содержимое меню внутренним блоком

	$menu._locked = false; // Устанавливаем флаг блокировки меню

	$menu._lock = function() { // Функция блокировки меню

		if ($menu._locked) // Если меню уже заблокировано
			return false;

		$menu._locked = true; // Устанавливаем флаг блокировки

		window.setTimeout(function() { // Задержка для разблокировки меню
			$menu._locked = false;
		}, 350); // Задержка 350 мс

		return true;

	};

	$menu._show = function() { // Функция показа меню

		if ($menu._lock()) // Если меню заблокировано
			$body.addClass('is-menu-visible'); // Добавляем класс is-menu-visible к body

	};

	$menu._hide = function() { // Функция скрытия меню

		if ($menu._lock()) // Если меню заблокировано
			$body.removeClass('is-menu-visible'); // Удаляем класс is-menu-visible из body

	};

	$menu._toggle = function() { // Функция переключения состояния меню

		if ($menu._lock()) // Если меню заблокировано
			$body.toggleClass('is-menu-visible'); // Переключаем класс is-menu-visible в body

	};

	$menu
		.appendTo($body) // Добавляем меню в конец body
		.on('click', function(event) { // Обработчик события клика на меню
			event.stopPropagation(); // Останавливаем всплытие события
		})
		.on('click', 'a', function(event) { // Обработчик события клика на ссылке в меню

			var href = $(this).attr('href'); // Получаем значение атрибута href ссылки

			event.preventDefault(); // Предотвращаем стандартное действие
			event.stopPropagation(); // Останавливаем всплытие события

			// Скрыть меню.
			$menu._hide();

			// Перенаправление.
			if (href == '#menu') // Если ссылка ведет на меню
				return;

			window.setTimeout(function() { // Задержка для перенаправления
				window.location.href = href; // Перенаправляем на указанный адрес
			}, 350); // Задержка 350 мс

		})
		.append('<a class="close" href="#menu">Close</a>'); // Добавляем кнопку закрытия меню

	$body
		.on('click', 'a[href="#menu"]', function(event) { // Обработчик клика на ссылке для открытия меню

			event.stopPropagation(); // Останавливаем всплытие события
			event.preventDefault(); // Предотвращаем стандартное действие

			// Переключить состояние меню.
			$menu._toggle();

		})
		.on('click', function(event) { // Обработчик клика по body

			// Скрыть меню.
			$menu._hide();

		})
		.on('keydown', function(event) { // Обработчик нажатия клавиши на body

			// Скрыть меню при нажатии Escape.
			if (event.keyCode == 27)
				$menu._hide();

		});

})(jQuery);

$(document).ready(function() {
	$('body').on('click', '.number-minus, .number-plus', function(){ // Обработчик клика на кнопках уменьшения и увеличения
		var $row = $(this).closest('.number'); // Находим ближайший родительский элемент с классом .number
		var $input = $row.find('.number-text'); // Находим поле ввода в текущем родительском элементе
		var step = $row.data('step'); // Получаем значение шага из атрибута data-step
		var val = parseFloat($input.val()); // Получаем текущее значение поля ввода как число с плавающей точкой
		if ($(this).hasClass('number-minus')) { // Если кликнули по кнопке уменьшения
			val -= step; // Вычитаем шаг из текущего значения
		} else {
			val += step; // Иначе прибавляем шаг к текущему значению
		}
		$input.val(val); // Устанавливаем новое значение в поле ввода
		$input.change(); // Инициируем событие изменения значения
		return false; // Предотвращаем стандартное действие
	});

	$('body').on('change', '.number-text', function(){ // Обработчик изменения значения в поле ввода
		var $input = $(this); // Текущее поле ввода
		var $row = $input.closest('.number'); // Находим ближайший родительский элемент с классом .number
		var step = $row.data('step'); // Получаем значение шага из атрибута data-step
		var min = parseInt($row.data('min')); // Получаем минимальное значение из атрибута data-min
		var max = parseInt($row.data('max')); // Получаем максимальное значение из атрибута data-max
		var val = parseFloat($input.val()); // Получаем текущее значение поля ввода как число с плавающей точкой
		if (isNaN(val)) { // Если значение не число
			val = step;	// Устанавливаем значение равным шагу
		} else if (min && val < min) { // Если установлено минимальное значение и текущее меньше минимального
			val = min;	// Устанавливаем значение равным минимальному
		} else if (max && val > max) { // Если установлено максимальное значение и текущее больше максимального
			val = max;	// Устанавливаем значение равным максимальному
		}
		$input.val(val); // Устанавливаем новое значение в поле ввода
	});
});
