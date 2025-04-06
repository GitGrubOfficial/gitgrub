from rest_framework.generics import ListAPIView
from recipes.models import Recipe
from recipes.serializers import RecipeSerializer

class RecipeListView(ListAPIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        owner_id = self.request.query_params.get("owner")
        if owner_id:
            return Recipe.objects.filter(owner_id=owner_id)
        return Recipe.objects.all()
