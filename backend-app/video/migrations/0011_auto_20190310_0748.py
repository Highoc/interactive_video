# Generated by Django 2.1.7 on 2019-03-10 07:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('video', '0010_auto_20190309_2015'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='source',
            options={'ordering': ('id', 'name'), 'verbose_name': 'Источник', 'verbose_name_plural': 'Источники'},
        ),
        migrations.AlterModelOptions(
            name='video',
            options={'ordering': ('id', 'name'), 'verbose_name': 'Интерактивное видео', 'verbose_name_plural': 'Интерактивное видео'},
        ),
        migrations.AlterModelOptions(
            name='videopart',
            options={'verbose_name': 'Видео', 'verbose_name_plural': 'Видео'},
        ),
        migrations.AddField(
            model_name='source',
            name='status',
            field=models.IntegerField(choices=[(0, 'Ready to use'), (1, 'Used in VideoPart'), (2, 'Deleted')], default=0, verbose_name='Статус источника'),
        ),
        migrations.AddField(
            model_name='video',
            name='status',
            field=models.IntegerField(choices=[(0, 'Published to channel'), (1, 'Hidden by user'), (2, 'Deleted')], default=0, verbose_name='Статус источника'),
        ),
        migrations.AlterField(
            model_name='source',
            name='codec',
            field=models.CharField(default=None, max_length=32, null=True, verbose_name='Кодек источника'),
        ),
        migrations.AlterField(
            model_name='source',
            name='content',
            field=models.FileField(upload_to='source_video', verbose_name='Источник'),
        ),
        migrations.AlterField(
            model_name='source',
            name='created',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Дата загрузки источника'),
        ),
        migrations.AlterField(
            model_name='source',
            name='description',
            field=models.TextField(max_length=1024, verbose_name='Описание источника'),
        ),
        migrations.AlterField(
            model_name='source',
            name='key',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='Ключ источника'),
        ),
        migrations.AlterField(
            model_name='source',
            name='mime',
            field=models.CharField(max_length=32, verbose_name='MIME-type источника'),
        ),
        migrations.AlterField(
            model_name='source',
            name='name',
            field=models.CharField(max_length=64, verbose_name='Название источника'),
        ),
        migrations.AlterField(
            model_name='source',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sources', to=settings.AUTH_USER_MODEL, verbose_name='Автор источника'),
        ),
        migrations.AlterField(
            model_name='source',
            name='preview_picture',
            field=models.ImageField(null=True, upload_to='preview_video', verbose_name='Превью источника'),
        ),
        migrations.AlterField(
            model_name='source',
            name='time',
            field=models.FloatField(verbose_name='Длительность источника'),
        ),
        migrations.AlterField(
            model_name='video',
            name='head_video_part',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='video', to='video.VideoPart', verbose_name='Стартовый фрагмент видео'),
        ),
        migrations.AlterField(
            model_name='video',
            name='name',
            field=models.CharField(max_length=128, verbose_name='Название интерактивного видео'),
        ),
    ]
