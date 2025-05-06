from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from recipes.models import Recipe
from recipes.services.git_service import get_recipe_diff_hash_base


class RecipeDiffView(APIView):
    def get(self, request, pk):
        print("RECIPE DIFF VIEW HIT")
        recipe = get_object_or_404(Recipe, pk=pk)
        diff_text = get_recipe_diff_hash_base(recipe)
        return Response({"diff": diff_text}, status=status.HTTP_200_OK)
