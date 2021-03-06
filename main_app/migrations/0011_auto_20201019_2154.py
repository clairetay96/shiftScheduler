# Generated by Django 3.1.2 on 2020-10-19 13:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0010_auto_20201019_2117'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpreference',
            name='blocked_out_shifts',
            field=models.ManyToManyField(blank=True, related_name='blocked_out_shifts', to='main_app.Shift'),
        ),
        migrations.AlterField(
            model_name='userpreference',
            name='preferred_shifts',
            field=models.ManyToManyField(blank=True, related_name='preferred_shifts', to='main_app.Shift'),
        ),
    ]
