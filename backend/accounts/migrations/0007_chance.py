# Generated by Django 5.1.6 on 2025-03-11 13:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0006_usergamestats_current_task_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Chance",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("description", models.TextField()),
                ("score_to_award", models.IntegerField(default=0)),
            ],
        ),
    ]
