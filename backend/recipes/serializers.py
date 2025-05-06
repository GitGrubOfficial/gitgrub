from rest_framework import serializers
from .models import Recipe
from users.models import CustomUser  # Import your custom user model

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email']

class RecipeSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)
    forked_from = serializers.PrimaryKeyRelatedField(read_only=True)
    original_author = serializers.PrimaryKeyRelatedField(read_only=True)

    ingredients = serializers.SerializerMethodField()
    instructions = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = [
            'id', 'title', 'description', 'ingredients', 'instructions',
            'owner', 'forked_from', 'original_author',
            'git_commit_hash', 'visibility', 'category', 'diet_preference',
            'prep_time', 'cook_time', 'servings',
            'difficulty', 'rating', 'image',
        ]
        read_only_fields = ['owner', 'original_author', 'git_commit_hash']

    def get_ingredients(self, obj):
        if obj.ingredients:
            return obj.ingredients.splitlines()
        return []

    def get_instructions(self, obj):
        if obj.instructions:
            return obj.instructions.splitlines()
        return []
