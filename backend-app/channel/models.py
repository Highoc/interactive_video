from django.db import models

class Channel(models.Model):
    name = models.CharField(
        max_length=64,
        verbose_name='Название канала'
    )

    description = models.TextField(
        max_length=4096,
        default="",
        verbose_name='Описание канала'
    )

    owner = models.OneToOneField(
        'auth.User',
        related_name='channel',
        verbose_name='Автор канала',
        on_delete=models.CASCADE
    )

    key = models.CharField(
        max_length=12,
        null=True,
        unique=True,
        verbose_name='Ключ канала'
    )

    subscribers = models.ManyToManyField(
        'auth.User',
        related_name='subscriptions',
        verbose_name='Подписчики канала'
    )

    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания канала'
    )

    AVAILABLE = 0
    DELETED = 1
    STATUS_CHOICES = (
        (AVAILABLE, 'Available channel'),
        (DELETED, 'Deleted channel'),
    )

    status = models.IntegerField(
        default=AVAILABLE,
        choices=STATUS_CHOICES,
        verbose_name='Статус канала'
    )

    class Meta:
        verbose_name = 'Канал'
        verbose_name_plural = 'Каналы'
        ordering = 'id', 'name'

    def __unicode__(self):
        return self.name


class Playlist(models.Model):
    name = models.CharField(
        max_length=32,
        verbose_name='Название плeйлиста'
    )

    description = models.TextField(
        max_length=1024,
        default="",
        verbose_name='Описание плeйлиста'
    )

    key = models.CharField(
        max_length=12,
        verbose_name='Ключ плейлиста'
    )

    preview_picture = models.ImageField(
        upload_to='preview_playlist',
        null=True,
        verbose_name='Превью плейлиста'
    )

    PUBLIC = 0
    UPLOADED = 1
    HIDDEN = 2
    DELETED = 3
    STATUS_CHOICES = (
        (PUBLIC, 'Public playlist'),
        (UPLOADED, 'Upload playlist'),
        (HIDDEN, 'Hidden playlist'),
        (DELETED, 'Deleted playlist'),
    )

    status = models.IntegerField(
        default=PUBLIC,
        choices=STATUS_CHOICES,
        verbose_name='Статус плейлиста'
    )

    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='playlists')