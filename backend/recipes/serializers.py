from rest_framework import serializers

from .models import Recipe


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = [
            'id',
            'title',
            'ingredients',
            'instructions',
            'owner',
            'forked_from',
            'original_author',
            'git_commit_hash',
        ]
        read_only_fields = ['git_commit_hash']