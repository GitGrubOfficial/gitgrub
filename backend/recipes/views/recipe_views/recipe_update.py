from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework import status

from recipes.models import Recipe
from recipes.serializers import RecipeSerializer
from recipes.services.git_service import save_recipe_markdown


class RecipeUpdateView(RetrieveUpdateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    def perform_update(self, serializer):
        recipe = serializer.save()

        # Save changes to Markdown + commit
        commit_hash = save_recipe_markdown(recipe)
        recipe.git_commit_hash = commit_hash
        recipe.save(update_fields=["git_commit_hash"])
