#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""

import os
import sys


def main():
    """Run administrative tasks."""
    # Устанавливаем переменную окружения DJANGO_SETTINGS_MODULE,
    # указывающую Django, какие настройки использовать.
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "OnlineStore.settings")

    try:
        # Импортируем функцию execute_from_command_line для выполнения
        # административных задач Django из командной строки.
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # Если Django не удается импортировать, возникает исключение ImportError.
        # Выводим сообщение с инструкциями по установке Django.
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?") from exc

    # Выполняем команду из командной строки Django, передавая аргументы
    # sys.argv.
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    # Если скрипт запущен напрямую (а не импортирован как модуль),
    # вызываем функцию main() для выполнения административных задач Django.
    main()
