from users.views.CustomRegisterView import CustomRegisterView
from users.views.UserProfileView import UserProfileView

from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("auth/registration/", CustomRegisterView.as_view(), name="rest_register"),
    path("user/profile/", UserProfileView.as_view(), name="user-profile"),

]