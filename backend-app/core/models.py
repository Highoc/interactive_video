from django.db import models

from .helpers import convert_to_byte_length

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
        max_length=convert_to_byte_length(MB=10)
    )

    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'
        ordering = ('user', )

    def __unicode__(self):
        return self.user.username