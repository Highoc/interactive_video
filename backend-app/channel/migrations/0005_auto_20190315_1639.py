# Generated by Django 2.1.7 on 2019-03-15 16:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('channel', '0004_auto_20190315_1609'),
    ]

    operations = [
        migrations.AddField(
            model_name='playlist',
            name='description',
            field=models.TextField(default='', max_length=1024, verbose_name='Описание плeйлиста'),
        ),
        migrations.AddField(
            model_name='playlist',
            name='name',
            field=models.CharField(default='def', max_length=32, verbose_name='Название плeйлиста'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='playlist',
            name='status',
            field=models.IntegerField(choices=[(0, 'Public playlist'), (1, 'Upload playlist'), (2, 'Hidden playlist'), (3, 'Deleted playlist')], default=0, verbose_name='Статус плейлиста'),
        ),
    ]