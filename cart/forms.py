# Импортируем модуль forms из Django
from django import forms

# Импортируем модель CartItem из текущего приложения
from .models import CartItem


# Определяем форму для добавления товара в корзину
class AddToCartForm(forms.Form):
    # Поле для идентификатора товара, скрытое в форме
    item_id = forms.IntegerField(widget=forms.HiddenInput())


# Определяем форму для обновления количества товара в корзине
class UpdateCartItemForm(forms.ModelForm):
    # Мета-класс для указания модели и полей, которые будут использованы в
    # форме
    class Meta:
        model = CartItem
        fields = ["quantity"]
        # Настройка виджета для поля quantity, чтобы применить CSS-класс
        # 'quantity-input'
        widgets = {
            "quantity": forms.NumberInput(attrs={"class": "quantity-input"}),
        }

    # Метод для валидации поля quantity
    def clean_quantity(self):
        # Получаем очищенное значение quantity из формы
        quantity = self.cleaned_data["quantity"]
        # Если количество меньше 1, выбрасываем исключение ValidationError
        if quantity < 1:
            raise forms.ValidationError("Quantity must be at least 1.")
        return quantity

    # Переопределение метода clean для дополнительной обработки данных
    def clean(self):
        # Вызываем оригинальный метод clean у родительского класса
        cleaned_data = super().clean()
        # Получаем очищенное значение quantity
        quantity = cleaned_data.get("quantity")
        return cleaned_data
