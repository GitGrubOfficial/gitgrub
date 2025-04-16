from rest_framework.generics import ListAPIView
from recipes.models import Recipe
from recipes.serializers import RecipeSerializer
from rest_framework.permissions import IsAuthenticated


class RecipeListView(ListAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Recipe.objects.filter(owner=self.request.user)
