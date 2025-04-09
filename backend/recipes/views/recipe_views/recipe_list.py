from rest_framework.generics import ListAPIView
from recipes.models import Recipe
from recipes.serializers import RecipeSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

class RecipeListView(ListAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        owner_id = self.request.query_params.get("owner")
        if owner_id:
            return Recipe.objects.filter(owner_id=owner_id)
        return Recipe.objects.all()
