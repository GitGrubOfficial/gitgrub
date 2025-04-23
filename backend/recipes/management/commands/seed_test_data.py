from django.core.management.base import BaseCommand
from django.utils import timezone
from users.models import CustomUser
from recipes.models import Recipe
import random
from recipes.services.git_service import save_recipe_markdown


class Command(BaseCommand):
    help = "Seed test users and recipes for development"

    def handle(self, *args, **kwargs):
        user_count = 4
        recipes_per_user = 8

        # Create test users
        for i in range(1, user_count + 1):
            email = f"TuanTesting{i}@example.com"
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": f"User{i}",
                    "last_name": "Tester",
                    "diet_preference": "omnivore",
                    "is_complete": True,
                },
            )
            if created:
                user.set_password("TestPassword123!")
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created user {email}"))
            else:
                self.stdout.write(f"User {email} already exists")

            sample_titles = [
                "Grandma's Secret Pancakes", "Spicy Thai Noodles", "Rustic Apple Pie",
                "Classic Chicken Alfredo", "Vegan Buddha Bowl", "Quick Lentil Soup"
            ]

            sample_descriptions = [
                """This hearty dish has been passed down through generations. Packed with flavor and easy to make, it's a comfort food staple the whole family will love.

            Perfect for chilly nights, it pairs beautifully with a crisp salad or crusty bread.""",

                """A vibrant, wholesome recipe that’s loaded with fresh ingredients. It’s a great meal prep option and incredibly versatile—add your own twist!

            Don't forget to drizzle with tahini dressing for a creamy finish.""",

                """Savory and simple, this recipe brings together everyday ingredients to create something special. Perfect for weeknight dinners when time is short.

            Leftovers reheat well, making it a smart choice for busy schedules."""
            ]

            sample_ingredients = [
                [
                    "- 1 lb chicken breast",
                    "- 2 cloves garlic, minced",
                    "- 1 tbsp olive oil",
                    "- Salt and pepper to taste",
                    "- 1/2 cup grated parmesan",
                ],
                [
                    "- 1 cup green lentils",
                    "- 1 carrot, chopped",
                    "- 1 celery stalk, diced",
                    "- 1 bay leaf",
                    "- 4 cups vegetable broth"
                ],
                [
                    "- 1 1/2 cups all-purpose flour",
                    "- 3/4 cup sugar",
                    "- 1/2 tsp cinnamon",
                    "- 2 eggs",
                    "- 1/4 cup milk"
                ]
            ]

            sample_instructions = [
                [
                    "1. Heat oil in a large skillet over medium heat.",
                    "2. Add garlic and sauté for 1 minute until fragrant.",
                    "3. Add protein and season with salt and pepper.",
                    "4. Cook thoroughly, then sprinkle with parmesan.",
                    "5. Serve hot over rice or pasta."
                ],
                [
                    "1. Rinse lentils under cold water.",
                    "2. Combine all ingredients in a large pot.",
                    "3. Bring to a boil, then reduce heat and simmer.",
                    "4. Cook for 30–35 minutes or until lentils are soft.",
                    "5. Remove bay leaf and serve with bread."
                ],
                [
                    "1. Preheat oven to 350°F (175°C).",
                    "2. Mix dry ingredients in a large bowl.",
                    "3. In another bowl, beat eggs and milk.",
                    "4. Combine wet and dry mixtures.",
                    "5. Pour into greased pan and bake for 25–30 mins."
                ]
            ]

            # Create sample recipes for this user
            for j in range(1, recipes_per_user + 1):
                title = random.choice(sample_titles)
                description = random.choice(sample_descriptions)
                ingredients = "\n".join(random.choice(sample_ingredients))
                instructions = "\n".join(random.choice(sample_instructions))

                recipe, _ = Recipe.objects.update_or_create(
                    title=f"{title} {j}",
                    owner=user,
                    defaults={
                        "ingredients": ingredients,
                        "instructions": instructions,
                        "description": description,
                        "visibility": "public",
                        "original_author": user,
                        "change_description": "Initial test seed",
                        "prep_time": random.choice([10, 15, 20, 25]),
                        "cook_time": random.choice([15, 30, 45]),
                        "servings": random.choice([2, 4, 6]),
                        "difficulty": random.choice(["easy", "medium", "hard"]),
                        "rating": round(random.uniform(3.5, 5.0), 1),
                        "is_featured": random.choice([True, False]),
                    }
                )

                commit_hash = save_recipe_markdown(recipe)
                recipe.git_commit_hash = commit_hash
                recipe.save(update_fields=['git_commit_hash'])

                if created:
                    self.stdout.write(f"Created recipe: {title}")
                else:
                    self.stdout.write(f"Recipe '{title}' already exists")

        self.stdout.write(self.style.SUCCESS("Test data seeding complete!"))
