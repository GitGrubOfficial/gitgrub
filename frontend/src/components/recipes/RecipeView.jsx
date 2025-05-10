// Update frontend/src/components/recipes/RecipeView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, generatePath, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { getRecipe, getForkInfo, forkRecipe } from '../../services/recipeService';
import MarkdownRenderer from '../common/MarkdownRenderer';

const RecipeView = () => {
  const { username, recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [forkInfo, setForkInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isForking, setIsForking] = useState(false);
  
  // Hardcoded current user for simplicity
  const currentUser = 'demo';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipeData, forkInfoData] = await Promise.all([
          getRecipe(username, recipeId),
          getForkInfo(username, recipeId)
        ]);
        
        setRecipe(recipeData);
        setForkInfo(forkInfoData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to fetch data: ${err.message || 'Unknown error'}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [username, recipeId]);
  
  const handleFork = async () => {
    if (username === currentUser) return;
    
    setIsForking(true);
    try {
      const commitMessage = `Forked from ${username}'s recipe`;
      const result = await forkRecipe(currentUser, username, recipeId, commitMessage);
      
      navigate(generatePath(ROUTES.RECIPE_VIEW, { 
        username: currentUser,
        recipeId: result.recipeId
      }));
    } catch (err) {
      console.error('Error forking recipe:', err);
      setError(`Failed to fork recipe: ${err.message || 'Unknown error'}`);
      setIsForking(false);
    }
  };
  
  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="view-container"><p>Error: {error}</p></div>;
  if (!recipe) return <div className="view-container"><p>Recipe not found</p></div>;

  return (
    <div className="view-container">
      <div className="recipe-header">
        <h2>{recipe.title}</h2>
        <p className="update-info">Last updated: {new Date(recipe.updatedAt).toLocaleString()}</p>
        
        {/* Show fork information if this is a fork */}
        {forkInfo && forkInfo.isFork && (
          <div className="fork-info">
            <p>
              Forked from{' '}
              <Link to={generatePath(ROUTES.RECIPE_VIEW, { 
                username: forkInfo.forkedFrom.username, 
                recipeId: forkInfo.forkedFrom.recipeId 
              })}>
                {forkInfo.forkedFrom.username}'s recipe
              </Link>
            </p>
          </div>
        )}
      </div>
      
      <div className="recipe-actions">
        <Link to={generatePath(ROUTES.RECIPE_LIST, { username })} className="btn">
          Back to List
        </Link>
        
        {username === currentUser && (
          <Link to={generatePath(ROUTES.RECIPE_EDIT, { username, recipeId })} className="btn btn-primary">
            Edit Recipe
          </Link>
        )}
        
        <Link to={generatePath(ROUTES.RECIPE_VERSIONS, { username, recipeId })} className="btn btn-secondary">
          Version History
        </Link>
        
        {/* Show fork button when viewing someone else's recipe */}
        {currentUser !== username && (
          <button 
            onClick={handleFork} 
            className="btn btn-secondary"
            disabled={isForking}
          >
            {isForking ? 'Forking...' : 'Fork Recipe'}
          </button>
        )}
      </div>
      
      <div className="recipe-content">
        <MarkdownRenderer content={recipe.content} />
      </div>
    </div>
  );
};

export default RecipeView;
