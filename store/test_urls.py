from django.test import SimpleTestCase
from django.urls import reverse, resolve
from store.views import store, tag_list, tag_details, item_details

class TestUrls(SimpleTestCase):

    def test_store_url_resolves(self):
        """
        Проверка разрешения URL для главной страницы
        """
        url = reverse('store:home')
        self.assertEqual(resolve(url).func, store)

    def test_tag_list_url_resolves(self):
        """
        Проверка разрешения URL для страницы списка тегов
        """
        url = reverse('store:tag_list')
        self.assertEqual(resolve(url).func, tag_list)

    def test_tag_details_url_resolves(self):
        """
        Проверка разрешения URL для детальной страницы тегов
        """
        url = reverse('store:tag_details', args=['test-tag'])
        self.assertEqual(resolve(url).func, tag_details)

    def test_item_details_url_resolves(self):
        """
        Проверка разрешения URL для детальной страницы товара
        """
        url = reverse('store:item_details', args=['test-item'])
        self.assertEqual(resolve(url).func, item_details)
