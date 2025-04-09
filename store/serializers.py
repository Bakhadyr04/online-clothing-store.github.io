from rest_framework import serializers
from taggit.models import Tag

from .models import Item, ItemTag, TaggedItem

class ItemTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemTag
        fields = ['id', 'name', 'slug', 'image', 'description']
        # fields = '__all__'  # Все поля модели ItemTag
class ItemSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(slug_field='name', queryset=Tag.objects.all(), many=True)

    class Meta:
        model = Item
        fields = '__all__'

class TaggedItemSerializer(serializers.ModelSerializer):
    tag = ItemTagSerializer()  # Вложенный сериализатор для тега

    class Meta:
        model = TaggedItem
        fields = ['id', 'tag']
        # fields = '__all__'  # Все поля модели TaggedItem

