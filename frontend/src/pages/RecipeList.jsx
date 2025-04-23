import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import RecipeCard from "../components/RecipeCard";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axiosInstance.get('/api/recipes/');
        setRecipes(res.data);
      } catch (err) {
        setErrorMsg('Failed to load recipes. Please log in.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>Getting recipe from backend</p>;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
