"""
Custom django command to populate the Task database with default entries

Run using:
python3 manage.py populatedefaulttasks
"""
from django.core.management.base import BaseCommand
from accounts.models import Task, Chance

class Command(BaseCommand):
    """
    Defines the command itself, extending the django commands API
    """
    help = "Populate the database with default task cards"

    def handle(self, *args, **kwargs):
        """
        Defines all default Task entries, loads them into the database and outputs the number of entries
        """
        Task.objects.create(description="Use a reusable cup"                 , applicable_squares=[3, 4, 6, 7, 8, 9, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Recycle an item"                    , applicable_squares=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=10)
        Task.objects.create(description="Use the water fountain"             , applicable_squares=[3, 4, 7, 8, 9, 10, 11, 13, 14, 15],score_to_award=5)
        Task.objects.create(description="Recycle used paper"                 , applicable_squares=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Visit the green space"                , applicable_squares=[2, 3, 6, ], score_to_award=5)
        Task.objects.create(description="Pick up a piece of litter"          , applicable_squares=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Turn off the lights"                , applicable_squares=[1, 2], score_to_award=5)
        Task.objects.create(description="Donate to the food fridge"          , applicable_squares=[4], score_to_award=5)
        Task.objects.create(description="Take something from the food fridge", applicable_squares=[4], score_to_award=5)
        Task.objects.create(description="Turn off power outlet after use"    , applicable_squares=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Buy a sustainable product"          , applicable_squares=[1, 4], score_to_award=5)
        Task.objects.create(description="Fill up your water bottle"          , applicable_squares=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Walk to campus"                     , applicable_squares=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Try a vegan food"                   , applicable_squares=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Read an article on sustainability"  , applicable_squares=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)

        count = Task.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Successfully added {count} entries to Task'))