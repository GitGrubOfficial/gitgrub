from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.serializers import CustomUserSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = CustomUserSerializer(
            request.user, data=request.data, partial=True
        )

        if serializer.is_valid():
            user = serializer.save()

            if user.first_name and user.last_name and user.diet_preference:
                user.is_complete = True
                user.save(update_fields=["is_complete"])

            return Response(CustomUserSerializer(user).data)
        return Response(serializer.errors, status=400)
