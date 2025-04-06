from rest_framework.generics import RetrieveAPIView
from recipes.models import Recipe
from recipes.serializers import RecipeSerializer

class RecipeDetailView(RetrieveAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
