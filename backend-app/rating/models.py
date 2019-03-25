from django.db import models

from video.models import Video

class Rating(models.Model):
    video = models.OneToOneField(
        Video,
        related_name='rating',
        verbose_name='Интерактивное видео',
        on_delete=models.CASCADE
    )

    counter = models.IntegerField(
        verbose_name='Рейтинг интерактивного видео'
    )

    class Meta:
        verbose_name = 'Рейтинг интерактивного видео'
        verbose_name_plural = 'Рейтинг интерактивных видео'

    def __unicode__(self):
        return self.video.key


class RatingRecord(models.Model):
    author = models.ForeignKey(
        'auth.User',
        related_name='rating_records',
        verbose_name='Автор',
        on_delete=models.CASCADE
    )

    rating = models.ForeignKey(
        Rating,
        related_name='records',
        verbose_name='Суммарный рейтинг',
        on_delete = models.CASCADE
    )

    UP = 1
    ZERO = 0
    DOWN = -1
    VALUE_CHOICES = (
        (UP, '+1 to rating'),
        (ZERO, '+0 to rating'),
        (DOWN, '-1 to rating'),
    )

    value = models.IntegerField(
        choices=VALUE_CHOICES,
        verbose_name='Значение',
    )

    class Meta:
        verbose_name = 'Запись рейтинга ИВ'
        verbose_name_plural = 'Записи рейтингов ИВ'
        ordering = 'rating', 'author', 'id'

    def __unicode__(self):
        return str(self.id)
