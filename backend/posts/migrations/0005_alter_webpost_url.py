# Generated by Django 3.2.10 on 2022-01-19 02:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0004_alter_post_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webpost',
            name='url',
            field=models.URLField(max_length=500),
        ),
    ]
