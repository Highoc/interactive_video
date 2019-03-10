# Generated by Django 2.1.7 on 2019-03-06 19:29

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('video', '0005_auto_20190304_2155'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='videopart',
            name='time',
        ),
        migrations.AddField(
            model_name='source',
            name='time',
            field=models.TimeField(default='0:00:00', verbose_name='Длительность видео'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='video',
            name='key',
            field=models.CharField(max_length=12, verbose_name='Ключ интерактивного видео'),
        ),
        migrations.AlterField(
            model_name='videopart',
            name='key',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='Ключ видео'),
        ),
    ]
