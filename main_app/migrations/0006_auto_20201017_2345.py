# Generated by Django 3.1.2 on 2020-10-17 15:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0005_auto_20201017_1152'),
    ]

    operations = [
        migrations.AlterField(
            model_name='period',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='periods', to='main_app.workgroup'),
        ),
    ]
