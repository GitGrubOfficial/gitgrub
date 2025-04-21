import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // or adjust path

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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Recipe List</h1>
      <ul className="space-y-2">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="border p-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold">{recipe.title}</h2>
            <p className="text-sm text-gray-600">Owner: {recipe.owner}</p>
            <p className="text-sm text-gray-500">Ingredients: {recipe.ingredients}</p>
            <p className="text-sm text-gray-500">Instructions: {recipe.instructions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
