import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function RecipeCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    prep_time: "",
    cook_time: "",
    servings: "",
    difficulty: "",
    diet_preference: "",
    image: null,
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          data.append(key, value);
        }
      });

      await axiosInstance.post("/api/recipes/create/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("🎉 Recipe created successfully!");
      navigate("/recipes"); // back to Recipe List
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to create recipe. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Create a New Recipe</h1>

        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Ingredients</label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded p-2"
              placeholder="Enter each ingredient on a new line"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded p-2"
              placeholder="Enter each step on a new line"
            />
          </div>
          {/* Category and deit gonna be on the same line, to reduce the create A New Recipe form */}
          <div className="flex flex-wrap gap-4 mt-6">
            {/* Category */}
            <div className="flex-1 min-w-[200px]">
              <label className="block font-semibold mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="e.g., Italian, Asian, Mexican..."
              />
            </div>

            {/* Diet Preference */}
            <div className="flex-1 min-w-[200px]">
              <label className="block font-semibold mb-1">Diet Preference</label>
              <input
                type="text"
                name="diet_preference"
                value={formData.diet_preference}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="e.g., Vegan, Vegetarian..."
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Prep Time</label>
              <input
                name="prep_time"
                type="number"
                value={formData.prep_time}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Cook Time</label>
              <input
                name="cook_time"
                type="number"
                value={formData.cook_time}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Servings</label>
              <input
                name="servings"
                type="number"
                value={formData.servings}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Image</label>
            <input
              name="image"
              type="file"
              onChange={handleChange}
              className="w-full"
            />
          </div>

         <div className="flex justify-between mt-8">
            {/* Cancel Button */}

             <button
              type="submit"
              className="w-1/2 ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Create Recipe
            </button>
            <button
              type="button"
              onClick={() => navigate('/recipes')}
              className="w-1/2 mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
            >
              Cancel
            </button>
         </div>

        </form>
      </div>
    </div>
  );
}
