# Generated by Django 2.1.7 on 2019-04-14 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('channel', '0007_auto_20190321_1107'),
    ]

    operations = [
        migrations.AddField(
            model_name='channel',
            name='head_picture',
            field=models.ImageField(null=True, upload_to='head_channel', verbose_name='Шапка канала'),
        ),
    ]
