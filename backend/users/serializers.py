from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from .models import CustomUser

class CustomRegisterSerializer(RegisterSerializer):
    username = None
    phone_number = serializers.CharField(required=False, allow_blank=True)
    diet_preference = serializers.ChoiceField(
        choices=CustomUser.DIET_CHOICES, required=False, allow_null=True
    )

    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
            'password1': self.validated_data.get('password1', ''),
            'password2': self.validated_data.get('password2', ''),
            'phone_number': self.validated_data.get('phone_number', ''),
            'diet_preference': self.validated_data.get('diet_preference', None),
        }

    def save(self, request):
        user = super().save(request)
        user.phone_number = self.validated_data.get('phone_number', '')
        user.diet_preference = self.validated_data.get('diet_preference', None)
        user.save()
        return user

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'phone_number', 'diet_preference', 'is_complete', 'last_updated'
        ]
        read_only_fields = ['email', 'is_complete', 'last_updated']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.is_complete = bool(
            instance.first_name and instance.last_name and instance.diet_preference
        )

        instance.save()
        return instance

