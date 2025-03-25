"""
Custom django command to remove all existing Task entries

Run using:
python3 manage.py deletealltasks
"""
from django.core.management.base import BaseCommand
from accounts.models import Task

class Command(BaseCommand):
    """
    Defines the command itself, extending the django commands API
    """
    help = 'Reset the task database by deleting all entries'

    def handle(self, *args, **kwargs):
        """
        Deletes all Task entries and outputs number of entries deleted
        """
        count = Task.objects.count()
        Task.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} entries from Task'))
