from django.db import models
from mptt.models import MPTTModel, TreeForeignKey


class Comment(MPTTModel):

    author = models.ForeignKey(
        'auth.User',
        related_name='comments',
        verbose_name='Автор комментария',
        on_delete=models.CASCADE
    )

    parent = TreeForeignKey(
        'self',
        null=True,
        related_name='children',
        verbose_name='Родительский комментарий',
        on_delete=models.CASCADE
    )

    text = models.CharField(
        max_length=512,
        verbose_name='Текст комментария'
    )

    video = models.ForeignKey(
        'video.Video',
        related_name='comments',
        verbose_name='Видео',
        on_delete=models.CASCADE
    )

    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания комментария'
    )

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'

    class MPTTMeta:
        order_insertion_by = ['video']

    def __unicode__(self):
        return self.id
