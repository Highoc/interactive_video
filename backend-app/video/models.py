from django.db import models
from mptt.models import MPTTModel, TreeForeignKey

from channel.models import Playlist
import uuid


class Source(models.Model):

    name = models.CharField(
        max_length=64,
        verbose_name='Название источника'
    )

    description = models.TextField(
        max_length=1024,
        verbose_name='Описание источника'
    )

    owner = models.ForeignKey(
        'auth.User',
        related_name='sources',
        verbose_name='Автор источника',
        on_delete=models.CASCADE
    )

    preview_picture = models.ImageField(
        upload_to='preview_video',
        null=True,
        verbose_name='Превью источника'
    )

    time = models.FloatField(
        verbose_name='Длительность источника'
    )

    key = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        verbose_name='Ключ источника',
    )

    content = models.FileField(
        upload_to='source_video',
        verbose_name = 'Источник'
    )

    mime = models.CharField(
        max_length=32,
        verbose_name='MIME-type источника'
    )

    codec =  models.CharField(
        max_length=32,
        null=True,
        default=None,
        verbose_name='Кодек источника'
    )

    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата загрузки источника'
    )

    READY = 0
    USED = 1
    DELETED = 2
    STATUS_CHOICES = (
        (READY, 'Ready to use'),
        (USED, 'Used in VideoPart'),
        (DELETED, 'Deleted'),
    )

    status = models.IntegerField(
        default=READY,
        choices=STATUS_CHOICES,
        verbose_name='Статус источника'
    )

    class Meta:
        verbose_name = 'Источник'
        verbose_name_plural = 'Источники'
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
        unique=True,
        verbose_name='Ключ видео',
    )

    parent = TreeForeignKey(
        'self',
        null=True,
        related_name='children',
        verbose_name='Родительская часть видео',
        on_delete=models.CASCADE
    )

    text = models.CharField(
        max_length=32,
        verbose_name='Текст к видео'
    )

    main_video =  models.ForeignKey(
        'video.Video',
        related_name='video_parts',
        verbose_name='Главное видео',
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = 'Видео'
        verbose_name_plural = 'Видео'

    class MPTTMeta:
        order_insertion_by = ['parent']

    def __unicode__(self):
        return self.key


class Video(models.Model):

    name = models.CharField(
        max_length=128,
        verbose_name='Название интерактивного видео'
    )

    description = models.TextField(
        max_length=4096,
        verbose_name='Описание интерактивного видео'
    )

    key = models.CharField(
        max_length=12,
        verbose_name='Ключ интерактивного видео'
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

    head_video_part = models.OneToOneField(
        VideoPart,
        null=True,
        related_name='video',
        verbose_name='Стартовый фрагмент видео',
        on_delete=models.CASCADE
    )

    codec = models.CharField(
        max_length=32,
        default='undefined',
        verbose_name='Codec интерактивного видео'
    )

    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )

    PUBLIC = 0
    HIDDEN  = 1
    DELETED = 2
    STATUS_CHOICES = (
        (PUBLIC, 'Published to channel'),
        (HIDDEN, 'Hidden by user'),
        (DELETED, 'Deleted'),
    )

    status = models.IntegerField(
        default=PUBLIC,
        choices=STATUS_CHOICES,
        verbose_name='Статус видео'
    )

    playlist = models.ForeignKey(
        Playlist,
        verbose_name='Плейлист интерактивного видео',
        related_name='video',
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = 'Интерактивное видео'
        verbose_name_plural = 'Интерактивное видео'
        ordering = 'id', 'name'

    def __unicode__(self):
        return self.name
