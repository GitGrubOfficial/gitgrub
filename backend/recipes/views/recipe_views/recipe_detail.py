from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from recipes.models import Recipe
from recipes.serializers import RecipeSerializer
from rest_framework.permissions import IsAuthenticated


class RecipeDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk, owner=request.user)
        except Recipe.DoesNotExist:
            return Response({"detail": "Recipe not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer_class = RecipeSerializer(recipe)
        return Response(serializer_class.data)



