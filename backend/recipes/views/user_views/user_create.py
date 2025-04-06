from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from recipes.models import RecipeOwner

class RecipeOwnerCreateView(APIView):
    def post(self, request):
        username = request.data.get("username")
        if not username:
            return Response({"error": "Username is required"}, status=400)

        owner, created = RecipeOwner.objects.get_or_create(username=username)
        return Response({"id": owner.id, "username": owner.username}, status=201 if created else 200)
