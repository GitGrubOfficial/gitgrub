# this is to fork a recipe from another user
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from recipes.models import Recipe
from recipes.serializers import RecipeSerializer
from recipes.services.git_service import save_recipe_markdown


class RecipeForkView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id):
        try:
            source_recipe = Recipe.objects.get(pk=recipe_id)
        except Recipe.DoesNotExist:
            return Response({"detail": "Original recipe not found"}, status=status.HTTP_404_NOT_FOUND)

        # Prevent user from forking their own recipe
        if source_recipe.owner == request.user:
            return Response({"detail": "You already own this recipe"}, status=status.HTTP_400_BAD_REQUEST)

        # Use the original_author if available, otherwise fallback to the source owner
        original_author = source_recipe.original_author or source_recipe.owner

        forked_recipe = Recipe.objects.create(
            title=source_recipe.title + " (forked)",
            ingredients=source_recipe.ingredients,
            instructions=source_recipe.instructions,
            owner=request.user,
            original_author=original_author,
            forked_from=source_recipe  # 🔥 track parent
        )

        commit_hash = save_recipe_markdown(forked_recipe)
        forked_recipe.git_commit_hash = commit_hash
        forked_recipe.save(update_fields=["git_commit_hash"])

        return Response(RecipeSerializer(forked_recipe).data, status=status.HTTP_201_CREATED)
