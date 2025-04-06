import { useEffect, useState } from "react";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch("http://localhost:8000/api/recipes/")
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched recipes:", data);
      setRecipes(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching recipes:", err);
      setLoading(false);
    });
}, []);


  if (loading) return <p>Loading recipes...</p>;

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
