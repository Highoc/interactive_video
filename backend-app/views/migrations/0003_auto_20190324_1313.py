# Generated by Django 2.1.7 on 2019-03-24 13:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('views', '0002_auto_20190323_1924'),
    ]

    operations = [
        migrations.AlterField(
            model_name='views',
            name='counter',
            field=models.PositiveIntegerField(default=0, verbose_name='Счетчик просмотров'),
        ),
    ]
