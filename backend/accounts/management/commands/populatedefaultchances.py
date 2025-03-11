from django.core.management.base import BaseCommand
from accounts.models import Task, Chance

class Command(BaseCommand):
    help = "Populate the database with default task and chance cards"

    def handle(self, *args, **kwargs):
        Chance.objects.create(description="Your trees grew!", score_to_award=5)

        count = Chance.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Successfully added {count} entries to Chance'))
