
# Create your views here.
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from recipes.models import Recipe
from recipes.serializers import RecipeSerializer
from recipes.services.git_service import save_recipe_markdown


class RecipeCreateView(APIView):
    def post (self, request):

        # checking if the same recipe is already in there, there are many other options but
        # if we do it at the app level, might be mor efficient? discussion of
        # whether to do it at app level or db level
        existing = Recipe.objects.filter(
            title=request.data.get("title"),
            owner_id=request.data.get("owner")
        ).first()

        if existing:
            return Response({"detail": "recipe is already there"},
                            status = status.HTTP_409_CONFLICT
            )
        # if not there then create
        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            recipe = serializer.save()

            #create a git commit:
            commit_hash = save_recipe_markdown(recipe)
            recipe.git_commit_hash = commit_hash
            recipe.save(update_fields = ['git_commit_hash'])

            return Response(RecipeSerializer(recipe).data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

