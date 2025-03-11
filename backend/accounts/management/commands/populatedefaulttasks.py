from django.core.management.base import BaseCommand
from accounts.models import Task, Chance

class Command(BaseCommand):
    help = "Populate the database with default task and chance cards"

    def handle(self, *args, **kwargs):
        Task.objects.create(description="Use a reusable cup"                 , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Recycle an item"                    , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Use the water fountain"             , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Recycled used paper"                , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Visit a green space"                , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Pick up a piece of litter"          , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Turn off the lights"                , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Donate to the food fridge"          , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Take something from the food fridge", applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Turn off power outlet after use"    , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Buy a sustainable product"          , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Fill up your water bottle"          , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Walk to campus"                     , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Try a vegan food"                   , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)
        Task.objects.create(description="Read an article on sustainability"  , applicable_squares=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], score_to_award=5)

        count = Task.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Successfully added {count} entries to Task'))