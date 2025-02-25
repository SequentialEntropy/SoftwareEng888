# Generated by Django 5.1.6 on 2025-02-24 22:47

from django.db import migrations

def create_user_game_stats_for_existing_users(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    UserGameStats = apps.get_model('accounts', 'UserGameStats')

    for user in User.objects.all():
        UserGameStats.objects.get_or_create(user=user)

class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_usergamestats"),
    ]

    operations = [
        migrations.RunPython(create_user_game_stats_for_existing_users),
    ]
