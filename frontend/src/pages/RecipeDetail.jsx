import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from "../context/AuthContext";
import recipeEditModal from "../components/ui/RecipeEditModal";
import RecipeEditModal from "../components/ui/RecipeEditModal";



export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const { currentUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);




  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axiosInstance.get(`/api/recipes/${id}/`);
        const recipeData = res.data;
        recipeData.images = [
          recipeData.image,
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",
            "https://picsum.photos/200",

        ];
        setRecipe(res.data);
      } catch (err) {
        console.error('Failed to fetch recipe:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);


  // I will implement it later.
  const handleAddToCart = (recipe) => {
    const cart = JSON.parse(localStorage.getItem('menuCart')) || [];
    cart.push(recipe);
    localStorage.setItem('menuCart', JSON.stringify(cart));
    alert(`${recipe.title} added to your menu cart!`);
  };

  if (loading) return <p>Loading recipe...</p>;
  if (!recipe) return <p>Recipe not found</p>;

  const isOwner = currentUser?.id === recipe.owner.id;

  const refreshRecipe = async () => {
  try {
    const res = await axiosInstance.get(`/api/recipes/${id}/`);
    const recipeData = res.data;
    recipeData.images = [
      recipeData.image,
      "https://picsum.photos/200",
      "https://picsum.photos/210",
    ];
    setRecipe(recipeData);
  } catch (err) {
    console.error("Failed to refresh recipe:", err);
  }
};

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {selectedImage || recipe.image ? (
            <img
              src={selectedImage || recipe.image}
              alt={recipe.title}
              className="rounded-xl w-full h-auto object-cover mb-4"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              No Image Available
            </div>
          )}
          <div className="flex space-x-2 overflow-x-auto mt-2">
            {recipe.images && recipe.images.length > 0 && recipe.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-75"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{recipe.title}</h1>
          <p className="text-gray-700">{recipe.description}</p>

          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span><strong>Prep Time:</strong> {recipe.prep_time} min</span>
            <span><strong>Cook Time:</strong> {recipe.cook_time} min</span>
            <span><strong>Difficulty:</strong> {recipe.difficulty}</span>
            <span><strong>Rating:</strong> {recipe.rating}</span>
            <span><strong>Category:</strong> {recipe.category}</span>
            <span><strong>Diet Preference:</strong> {recipe.diet_preference}</span>
          </div>
          <div className="flex gap-2 mt-4">
              {isOwner ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Recipe
                </button>
              ) : (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => navigate(`/recipes/${recipe.id}/fork`)}
                >
                  Fork Recipe
                </button>
              )}
             <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleAddToCart(recipe)}
              >
                Cook It!
              </button>
            </div>

        </div>
      </div>
      {/* THis section is both instrcution and ingredients, left and right respectively */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <div className="h-96 overflow-y-auto p-2">
            <ol className="list-decimal list-inside space-y-2 text-gray-800">
              {recipe.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <div className="h-96 overflow-y-auto p-2">
            <ul className="list-disc list-inside space-y-2 text-gray-800">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {showEditModal && (<RecipeEditModal recipe={recipe} onClose={() => setShowEditModal(false)} onSave={() => { refreshRecipe(); setShowEditModal(false);}}
  />
)}
    </div>
  );
}
