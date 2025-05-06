// frontend/src/components/recipes/RecipeView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, generatePath } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { getRecipe } from '../../services/recipeService';
import MarkdownRenderer from '../common/MarkdownRenderer';

const RecipeView = () => {
  const { username, recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipe(username, recipeId);
        setRecipe(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(`Failed to fetch recipe: ${err.message || 'Unknown error'}`);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [username, recipeId]);

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="view-container"><p>Error: {error}</p></div>;
  if (!recipe) return <div className="view-container"><p>Recipe not found</p></div>;

  return (
    <div className="view-container">
      <div className="recipe-header">
        <h2>{recipe.title}</h2>
        <p className="update-info">Last updated: {new Date(recipe.updatedAt).toLocaleString()}</p>
      </div>
      
      <div className="recipe-actions">
        <Link to={generatePath(ROUTES.RECIPE_LIST, { username })} className="btn">
          Back to List
        </Link>
        <Link to={generatePath(ROUTES.RECIPE_EDIT, { username, recipeId })} className="btn btn-primary">
          Edit Recipe
        </Link>
        <Link to={generatePath(ROUTES.RECIPE_VERSIONS, { username, recipeId })} className="btn btn-secondary">
          Version History
        </Link>
      </div>
      
      <div className="recipe-content">
        <MarkdownRenderer content={recipe.content} />
      </div>
    </div>
  );
};

export default RecipeView;
