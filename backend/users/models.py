from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    DIET_CHOICES = [
        ('vegan', 'Vegan'),
        ('vegetarian', 'Vegetarian'),
        ('meat', 'Meat Eater'),
        ('gluten_free', 'Gluten-Free'),
        ('keto', 'Keto'),
    ]

    username = None
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    diet_preference = models.CharField(max_length=50, choices=DIET_CHOICES, null=True, blank=True)

    is_complete = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
