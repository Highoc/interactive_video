from django.db import models

class Channel(models.Model):

    name = models.CharField(
        max_length=127,
        verbose_name='Название канала'
    )
