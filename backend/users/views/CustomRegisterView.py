from dj_rest_auth.registration.views import RegisterView
from users.serializers import CustomRegisterSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError

class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super(CustomRegisterView, self).create(request, *args, **kwargs)
        except IntegrityError:
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)



