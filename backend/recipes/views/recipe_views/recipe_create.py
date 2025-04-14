from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from recipes.models import Recipe
from recipes.serializers import RecipeSerializer
from recipes.services.git_service import save_recipe_markdown


class RecipeCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        existing = Recipe.objects.filter(
            title=request.data.get("title"),
            owner=request.user
        ).first()

        if existing:
            return Response({"detail": "recipe is already there"},
                            status=status.HTTP_409_CONFLICT)

        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            recipe = serializer.save(
                owner=request.user,
                original_author=request.user
            )

            commit_hash = save_recipe_markdown(recipe)
            recipe.git_commit_hash = commit_hash
            recipe.save(update_fields=['git_commit_hash'])

            return Response(RecipeSerializer(recipe).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
