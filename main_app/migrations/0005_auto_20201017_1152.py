# Generated by Django 3.1.2 on 2020-10-17 03:52

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main_app', '0004_auto_20201014_1506'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workgroup',
            name='admins',
        ),
        migrations.AddField(
            model_name='workgroup',
            name='admins',
            field=models.ManyToManyField(related_name='admins', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='workgroup',
            name='members',
            field=models.ManyToManyField(related_name='members', to=settings.AUTH_USER_MODEL),
        ),
    ]
