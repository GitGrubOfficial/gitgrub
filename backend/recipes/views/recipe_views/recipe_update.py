from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from recipes.models import Recipe
from recipes.serializers import RecipeSerializer
from recipes.services.git_service import save_recipe_markdown

class RecipeUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk, owner=request.user)
        except Recipe.DoesNotExist:
            return Response({"detail": "Recipe not found or not yours."}, status=status.HTTP_404_NOT_FOUND)

        # let s check if this recipe belongs to the current login user
        if recipe.owner != request.user:
            return Response({"detail": "recipe does not belong to owner"},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = RecipeSerializer(recipe, data=request.data, partial=True)
        if serializer.is_valid():
            updated_recipe = serializer.save()

            # This is where i update the hash
            commit_hash = save_recipe_markdown(updated_recipe)
            updated_recipe.git_commit_hash = commit_hash
            updated_recipe.save(update_fields=["git_commit_hash", "updated_at"])

            return Response(RecipeSerializer(updated_recipe).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
