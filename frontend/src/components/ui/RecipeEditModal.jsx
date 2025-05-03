import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const RecipeEditModal = ({ recipe, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    category: '',
    diet_preference: '',
    prep_time: '',
    cook_time: '',
    servings: '',
    difficulty: '',
    visibility: '',
  });

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients.join('\n'),
        instructions: recipe.instructions.join('\n'),
        category: recipe.category || '',
        diet_preference: recipe.diet_preference || '',
        prep_time: recipe.prep_time || '',
        cook_time: recipe.cook_time || '',
        servings: recipe.servings || '',
        difficulty: recipe.difficulty || '',
        visibility: recipe.visibility || 'public',
      });
    }
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        ingredients: formData.ingredients.split('\n'),
        instructions: formData.instructions.split('\n'),
      };
      const res = await axiosInstance.patch(`/api/recipes/${recipe.id}/`, payload);
      onSave(res.data); // update parent with new recipe
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Edit Recipe</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Recipe Title"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Short description"
          />

          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            rows={5}
            className="w-full border rounded p-2"
            placeholder="One ingredient per line"
          />

          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={5}
            className="w-full border rounded p-2"
            placeholder="Step-by-step instructions, one per line"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Category"
            />
            <input
              type="text"
              name="diet_preference"
              value={formData.diet_preference}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Diet Preference"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="prep_time"
              value={formData.prep_time}
              onChange={handleChange}
              className="border rounded p-2"
              placeholder="Prep Time (min)"
            />
            <input
              type="number"
              name="cook_time"
              value={formData.cook_time}
              onChange={handleChange}
              className="border rounded p-2"
              placeholder="Cook Time (min)"
            />
            <input
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              className="border rounded p-2"
              placeholder="Servings"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="border rounded p-2"
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="border rounded p-2"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeEditModal;
