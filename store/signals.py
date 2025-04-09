from django.db.models.signals import pre_save, post_save, pre_delete
from django.dispatch import receiver
from .models import Item, ChangeHistory

@receiver(post_save, sender=Item)
def save_item_history(sender, instance, created, **kwargs):
    """
    ?? Сохранение истории изменения товара ??
    """
    if created:
        ChangeHistory.objects.create(
            object_type='Item',
            object_id=instance.id,
            change_type='add',
            new_value=instance.__dict__,
            timestamp=instance.updated_at
        )
    else:
        ChangeHistory.objects.create(
            object_type='Item',
            object_id=instance.id,
            change_type='update',
            old_value=instance.__dict__,
            new_value=instance.__dict__,
            timestamp=instance.updated_at
        )

@receiver(pre_delete, sender=Item)
def save_item_before_delete(sender, instance, **kwargs):
    """
    ?? Сохранение истории изменения товара до удаления ??
    """
    ChangeHistory.objects.create(
        object_type='Item',
        object_id=instance.id,
        change_type='delete',
        old_value=instance.__dict__,
        timestamp=instance.updated_at
    )
