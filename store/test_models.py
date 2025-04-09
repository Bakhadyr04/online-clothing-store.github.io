from django.test import TestCase
from store.models import Item, ItemTag
from taggit.models import Tag


class ItemModelTest(TestCase):
    def setUp(self):
        """
        Тест моделей товара
        """

        # Создаем тестовый тег
        self.tag = ItemTag.objects.create(name='TestTag', slug='test-tag')

        # Создаем тестовый товар
        self.item = Item.objects.create(
            title='Test Item',
            description='This is a test item.',
            slug='test-item',
            price=99.99,
            old_price=129.99,
            is_available=True
        )

    def test_item_creation(self):
        """
        Проверяем, что товар создан
        """
        self.assertTrue(isinstance(self.item, Item))
        self.assertEqual(str(self.item), 'Test Item')

    def test_item_fields(self):
        """
        Проверяем поля товара
        """
        self.assertEqual(self.item.title, 'Test Item')
        self.assertEqual(self.item.description, 'This is a test item.')
        self.assertEqual(self.item.slug, 'test-item')
        self.assertEqual(self.item.price, 99.99)
        self.assertEqual(self.item.old_price, 129.99)
        self.assertTrue(self.item.is_available)

    def test_item_tagging(self):
        """
        Проверяем работу с тегами
        """
        self.item.tags.add(self.tag)
        self.assertEqual(self.item.tags.count(), 1)
        self.assertIn(self.tag, self.item.tags.all())

    def test_item_ordering(self):
        """
        Создаем второй тестовый товар
        """
        item2 = Item.objects.create(
            title='Test Item 2',
            description='This is another test item.',
            slug='test-item-2',
            price=79.99,
            old_price=109.99,
            is_available=True
        )
        items = Item.objects.all()
        self.assertEqual(items[0], self.item)
        self.assertEqual(items[1], item2)

    def test_item_default_values(self):
        """
        Проверяем значения по умолчанию
        """
        item = Item.objects.create(
            title='Default Value Test Item',
            description='Testing default values.',
            slug='default-value-test-item',
            price=49.99,
        )
        self.assertTrue(item.is_available)
        self.assertIsNone(item.old_price)
