"""
Custom django command to remove all existing Chance entries

Run using:
python3 manage.py deleteallchances
"""
from django.core.management.base import BaseCommand
from accounts.models import Chance

class Command(BaseCommand):
    """
    Defines the command itself, extending the django commands API
    """
    help = 'Reset the chance database by deleting all entries'

    def handle(self, *args, **kwargs):
        """
        Deletes all Chance entries and outputs number of entries deleted
        """
        count = Chance.objects.count()
        Chance.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} entries from Chance'))
