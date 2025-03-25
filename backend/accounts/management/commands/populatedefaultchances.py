"""
Custom django command to populate the Chance database with default entries

Run using:
python3 manage.py populatedefaultchances
"""
from django.core.management.base import BaseCommand
from accounts.models import Task, Chance

class Command(BaseCommand):
    """
    Defines the command itself, extending the django commands API
    """
    help = "Populate the database with default chance cards"

    def handle(self, *args, **kwargs):
        """
        Defines all default Chance entries, loads them into the database and outputs the number of entries
        """
        Chance.objects.create(description="Bonus 5 points!", score_to_award=5)
        Chance.objects.create(description="Bonus 10 points !!", score_to_award=10)
        Chance.objects.create(description="Bonus 15 points", score_to_award=15)
        Chance.objects.create(description="Oh No! -5 points", score_to_award=-5)
        Chance.objects.create(description="Oh No! -10 points", score_to_award=-10)
        Chance.objects.create(description="Oh No! -15 points", score_to_award=-15)


        count = Chance.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Successfully added {count} entries to Chance'))
