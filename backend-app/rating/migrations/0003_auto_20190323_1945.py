# Generated by Django 2.1.7 on 2019-03-23 19:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rating', '0002_auto_20190323_1939'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='ratingrecord',
            options={'ordering': ('rating', 'author', 'id'), 'verbose_name': 'Запись рейтинга ИВ', 'verbose_name_plural': 'Записи рейтингов ИВ'},
        ),
    ]
