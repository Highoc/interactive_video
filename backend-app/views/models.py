from django.db import models
from video.models import Video

class Views(models.Model):

    video = models.OneToOneField(
        Video,
        related_name='views',
        verbose_name='Интерактивное видео',
        on_delete=models.CASCADE
    )

    counter = models.PositiveIntegerField(
        verbose_name='Счетчик просмотров'
    )

    class Meta:
        verbose_name = 'Просмотры у интерактивного видео'
        verbose_name_plural = 'Просмотры у интерактивных видео'

    def __unicode__(self):
        return self.video.key
