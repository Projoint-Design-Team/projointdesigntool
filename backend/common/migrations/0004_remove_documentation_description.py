# Generated by Django 4.2.7 on 2024-06-05 12:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("common", "0003_alter_documentation_markdown_file"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="documentation",
            name="description",
        ),
    ]
