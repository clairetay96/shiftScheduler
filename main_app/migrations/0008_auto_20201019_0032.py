# Generated by Django 3.1.2 on 2020-10-18 16:32

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main_app', '0007_auto_20201018_0018'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shift',
            name='users',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
    ]
