from django.db import models

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
