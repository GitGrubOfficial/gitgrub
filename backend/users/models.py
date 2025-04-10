from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_vegan = models.BooleanField(default=False)
    is_meat_eater = models.BooleanField(default=False)

    def __str__(self):
        return self.username
