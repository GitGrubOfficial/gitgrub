"""
URL configuration for recipehub project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
'''
username: admin
email: admin@gitgrub
pass: Abcd1234
'''

urlpatterns = [
    path("admin/", admin.site.urls),

    #recipe operations
    path("api/", include("recipes.urls")),

    # Auth with dj-rest-auth
    path("api/auth/", include("dj_rest_auth.urls")),

    path("api/auth/jwt/create/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/jwt/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/jwt/verify/", TokenVerifyView.as_view(), name="token_verify"),

    # Optional: social login support, will implement later
    path("auth/social/", include("allauth.socialaccount.urls")),

    #user operations
    path("api/", include("users.user_urls")),
]
