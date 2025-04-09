# Generated by Django 4.2 on 2025-01-04 01:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0005_alter_historicalitem_image_alter_item_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="historicalitem",
            name="image",
            field=models.TextField(
                blank=True,
                default="path/to/default/image.jpg",
                max_length=100,
                verbose_name="Изображение",
            ),
        ),
        migrations.AlterField(
            model_name="item",
            name="image",
            field=models.ImageField(
                blank=True,
                default="path/to/default/image.jpg",
                upload_to="items/",
                verbose_name="Изображение",
            ),
        ),
    ]
