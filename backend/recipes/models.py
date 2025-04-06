from django.db import models


# Create your models here.
class RecipeOwner(models.Model):
    username = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.username


# I'll might use the git_commit_hash for git tracking
class Recipe(models.Model):
    owner = models.ForeignKey(
        RecipeOwner,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='recipes')
    title = models.CharField(max_length=255)
    ingredients = models.TextField()
    instructions = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    git_commit_hash = models.CharField(max_length=40, blank=True, null=True)
    forked_from = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='forks'
    )
    original_author = models.ForeignKey(
        RecipeOwner,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='original_recipes'
    )

    def __str__(self):
        return f"{self.title} by {self.owner.username}"