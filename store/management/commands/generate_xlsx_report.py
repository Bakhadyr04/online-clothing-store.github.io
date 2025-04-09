import os
from datetime import datetime
from django.core.management.base import BaseCommand
from openpyxl import Workbook
from store.models import Item

class Command(BaseCommand):
    help = "Генерация отчета в формате XLSX"

    def save_workbook(self, workbook, filename):
        try:
            workbook.save(filename)
            self.stdout.write(self.style.SUCCESS(f"Файл успешно сохранен: {filename}"))
        except PermissionError:
            fallback_path = os.path.join(os.path.expanduser("~"), "Documents", filename)
            workbook.save(fallback_path)
            self.stdout.write(self.style.WARNING(f"Ошибка доступа к файлу. Файл сохранен в резервное место: {fallback_path}"))

    def handle(self, *args, **kwargs):
        if not Item.objects.exists():
            self.stdout.write(self.style.WARNING("Нет доступных элементов для экспорта."))
            return

        # Создаем новую рабочую книгу
        workbook = Workbook()
        sheet = workbook.active
        sheet.title = "Available Items"

        # Заголовки
        headers = ["ID", "Name", "Description", "Price"]
        sheet.append(headers)

        # Добавляем данные
        for item in Item.objects.iterator():
            sheet.append([
                item.id,
                item.title,
                item.description,
                item.price,
            ])

        # Формируем путь для сохранения файла
        filename = f"available_items_{datetime.now().strftime('%Y%m%d')}.xlsx"
        filepath = os.path.join(os.getcwd(), filename)

        # Проверяем, существует ли файл
        if os.path.exists(filepath):
            os.remove(filepath)

        # Сохраняем файл
        self.save_workbook(workbook, filepath)
