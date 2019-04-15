from django.db import models

from tag.models import Tag

import uuid


class Profile(models.Model):

    user = models.OneToOneField(
        'auth.User',
        related_name='profile',
        verbose_name='Пользователь',
        on_delete=models.CASCADE
    )

    key = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        verbose_name='Ключ источника',
    )

    avatar = models.ImageField(
        upload_to='profile_avatars',
        null=True,
        verbose_name='Аватар пользователя',
        max_length=64
    )

    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'
        ordering = ('id', )

    def __unicode__(self):
        return self.user.username