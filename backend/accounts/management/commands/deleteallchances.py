from django.core.management.base import BaseCommand
from accounts.models import Chance

class Command(BaseCommand):
    help = 'Reset the chance database by deleting all entries'

    def handle(self, *args, **kwargs):
        count = Chance.objects.count()
        Chance.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} entries from Chance'))
