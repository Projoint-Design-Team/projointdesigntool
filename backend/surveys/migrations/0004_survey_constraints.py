# Generated by Django 4.2.7 on 2024-06-11 07:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("surveys", "0003_remove_survey_constraints"),
    ]

    operations = [
        migrations.AddField(
            model_name="survey",
            name="constraints",
            field=models.JSONField(blank=True, default=list),
        ),
    ]