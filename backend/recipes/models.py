from django.db import models
from django.conf import settings

class Recipe(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='recipes'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    ingredients = models.TextField()
    instructions = models.TextField()
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)

    category = models.CharField(max_length=100, blank=True, null=True)
    diet_preference = models.CharField(max_length=100, blank=True, null=True)

    prep_time = models.PositiveIntegerField(help_text="In minutes", null=True, blank=True)
    cook_time = models.PositiveIntegerField(help_text="In minutes", null=True, blank=True)
    servings = models.PositiveIntegerField(null=True, blank=True)

    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, null=True, blank=True)

    rating = models.FloatField(default=0.0)
    is_featured = models.BooleanField(default=False)
    change_description = models.TextField(blank=True, null=True)

    visibility = models.CharField(
        max_length=10,
        choices=[('public', 'Public'), ('private', 'Private')],
        default='public'
    )

    git_commit_hash = models.CharField(max_length=50, blank=True, null=True)

    forked_from = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='forks'
    )

    original_author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='original_recipes'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.owner.email if self.owner else 'Unknown'}"
