from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from recipes.models import Recipe
from recipes.serializers import RecipeSerializer

class RecipeListView(ListAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        owner_id = self.request.query_params.get("owner")

        if owner_id and int(owner_id) == self.request.user.id:
            return Recipe.objects.filter(owner_id=owner_id)

        # If viewing someone else's recipes, return public only
        if owner_id:
            return Recipe.objects.filter(owner_id=owner_id, visibility="public")

        # If no owner_id is provided, return only current user's recipes
        return Recipe.objects.filter(owner=self.request.user)
