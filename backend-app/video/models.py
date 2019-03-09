from django.db import models
from mptt.models import MPTTModel, TreeForeignKey

from channel.models import Channel
import uuid

class Source(models.Model):

    name = models.CharField(
        max_length=127,
        verbose_name='Название видео'
    )

    description = models.TextField(
        max_length=4096,
        verbose_name='Описание видео'
    )

    owner = models.ForeignKey(
        'auth.User',
        related_name='sources',
        verbose_name='Автор видео',
        on_delete=models.CASCADE
    )

    preview_picture = models.ImageField(
        upload_to='preview_video',
        null=True,
        verbose_name='Превью видео'
    )

    mime = models.CharField(
        max_length=72,
        verbose_name='MIME-type видео'
    )

    key = models.CharField(
        max_length=72,
        verbose_name = 'ID видео'
    )

    content = models.FileField(
        upload_to='source_video',
        verbose_name = 'Видео'
    )

    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата загрузки'
    )

    '''
    status = models.BooleanField(
        default=False,
        verbose_name='Удалено'
    )
    '''

    class Meta:
        verbose_name = 'Видео'
        verbose_name_plural = 'Видео'
        ordering = 'id', 'name'

    def __unicode__(self):
        return self.name


class VideoPart(MPTTModel):

    source = models.ForeignKey(
        Source,
        null=True,
        related_name='video_parts',
        verbose_name='Источник видео',
        on_delete=models.SET_NULL
    )

    key = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    parent = TreeForeignKey(
        'self',
        null=True,
        related_name='children',
        verbose_name='Часть видео',
        on_delete=models.CASCADE
    )

    text = models.CharField(
        max_length=32,
        verbose_name='Название видео'
    )

    time = models.TimeField(
        auto_now=False,
        auto_now_add=False,
        verbose_name='Длительность видео'
    )

    class MPTTMeta:
        order_insertion_by = ['name']


class Video(models.Model):

    name = models.CharField(
        max_length=127,
        verbose_name='Название интерактивного видео'
    )

    description = models.TextField(
        max_length=4096,
        verbose_name='Описание интерактивного видео'
    )

    key = models.CharField(
        max_length=12,
        verbose_name='ID интерактивного видео'
    )

    preview_picture = models.ImageField(
        upload_to='preview_video',
        null=True,
        verbose_name='Превью интерактивного видео'
    )

    owner = models.ForeignKey(
        'auth.User',
        related_name='video',
        verbose_name='Автор видео',
        on_delete=models.CASCADE
    )

    head_video_part = models.ForeignKey(
        VideoPart,
        related_name='video',
        verbose_name='Стартовый фрагмент видео',
        on_delete=models.CASCADE
    )

    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )


