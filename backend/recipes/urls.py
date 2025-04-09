from django.urls import path
from recipes.views.recipe_views.recipe_create import RecipeCreateView
from recipes.views.recipe_views.recipe_list import RecipeListView
from recipes.views.recipe_views.recipe_detail import RecipeDetailView
from recipes.views.recipe_views.recipe_update import RecipeUpdateView
from .views.recipe_git_views.recipe_diff import RecipeDiffView


urlpatterns = [
    path("recipes/", RecipeListView.as_view()),          # GET (list)
    path("recipes/create/", RecipeCreateView.as_view()), # POST (create)
    path("recipes/<int:pk>/", RecipeDetailView.as_view()),# GET (single pull)
    path("recipes/<int:pk>/update/", RecipeUpdateView.as_view()), # PATCH to update+
    path("recipes/<int:pk>/diff/", RecipeDiffView.as_view())
]
