from django.core.management.base import BaseCommand
from accounts.models import Task

class Command(BaseCommand):
    help = 'Reset the task database by deleting all entries'

    def handle(self, *args, **kwargs):
        count = Task.objects.count()
        Task.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} entries from Task'))
