from django.db import models

class Tag(models.Model):
    text = models.CharField(
        max_length=16,
        verbose_name='Текст тега'
    )
