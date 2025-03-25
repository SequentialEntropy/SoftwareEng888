"""
This file ensures that all users have a corresponding usergamestats
This is done by listening for user creation events
"""
from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        """
        Loads the listeners in signals.py after the app is loaded ready
        """
        import accounts.signals
