from django.core.management.base import BaseCommand
from accounts.models import Task, Chance

class Command(BaseCommand):
    help = "Populate the database with default chance cards"

    def handle(self, *args, **kwargs):
        Chance.objects.create(description="Bonus 5 points!", score_to_award=5)
        Chance.objects.create(description="Bonus 10 points !!", score_to_award=10)
        Chance.objects.create(description="Bonus 15 points", score_to_award=15)
        Chance.objects.create(description="Oh No! -5 points", score_to_award=-5)
        Chance.objects.create(description="Oh No! -10 points", score_to_award=-10)
        Chance.objects.create(description="Oh No! -15 points", score_to_award=-15)


        count = Chance.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Successfully added {count} entries to Chance'))
