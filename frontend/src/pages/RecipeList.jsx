import {useEffect, useRef, useState} from "react";
import axiosInstance from "../api/axiosInstance";
import RecipeCard from "../components/RecipeCard";
import {useLocation, useNavigate} from "react-router-dom";


const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [view, setView] = useState("public");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");
  const [sortOption, setSortOption] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axiosInstance.get("/api/recipes/");
        setRecipes(res.data);
      } catch (err) {
        console.error("Failed to load recipes", err);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes
    .filter((recipe) => recipe.visibility === view)
    .filter((recipe) => recipe.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((recipe) => (selectedCategory ? recipe.category === selectedCategory : true))
    .filter((recipe) => (selectedDiet ? recipe.diet_preference === selectedDiet : true))
    .sort((a, b) => {
      switch (sortOption) {
        case "prep_time":
          return (a.prep_time || 0) - (b.prep_time || 0);
        case "cook_time":
          return (a.cook_time || 0) - (b.cook_time || 0);
        case "servings":
          return (a.servings || 0) - (b.servings || 0);
        case "difficulty":
          return (a.difficulty || "").localeCompare(b.difficulty || "");
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // REset the filter options to go back to home page
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedDiet("");
    setSortOption("");
    setView("public");
  };
  const location = useLocation();
  useEffect(() => {
  if (location.pathname === "/recipes") {
    resetFilters();
  }
}, [location]);

  const uniqueCategories = [...new Set(recipes.map((r) => r.category).filter(Boolean))];
  const uniqueDiets = [...new Set(recipes.map((r) => r.diet_preference).filter(Boolean))];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex">
      {/* sidebar will appear on hover or click and close if move away, pretty hacky */}
      <div
        ref={sidebarRef}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`bg-gray-100 p-4 transition-all duration-300 ${sidebarOpen ? "w-48" : "w-10"} overflow-hidden`}>
      >
        {sidebarOpen && (
          <>
            <button
              onClick={() => setView("public")}
              className={`block w-full mb-2 text-left ${view === "public" ? "font-bold" : ""}`}
            >
              Public
            </button>
            <button
              onClick={() => setView("private")}
              className={`block w-full mb-2 text-left ${view === "private" ? "font-bold" : ""}`}
            >
              Private
            </button>
          </>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {view === "public" ? "Public Recipes" : "Private Recipes"}
          </h1>

          <button
            className="bg-blue-500 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded shadow transition transform hover:scale-105"
            onClick={() => navigate("/recipes/create")}
          >
            + Create New Recipe
          </button>

      </div>

        {/* Filtering options base on category, Diety preference and sort by */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-1 rounded-md w-48"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-1 rounded-md"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedDiet}
            onChange={(e) => setSelectedDiet(e.target.value)}
            className="border px-3 py-1 rounded-md"
          >
            <option value="">All Diets</option>
            {uniqueDiets.map((diet) => (
              <option key={diet} value={diet}>
                {diet}
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border px-3 py-1 rounded-md"
          >
            <option value="">Sort By</option>
            <option value="prep_time">Prep Time</option>
            <option value="cook_time">Cook Time</option>
            <option value="servings">Servings</option>
            <option value="difficulty">Difficulty</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* each card for each recipe */}
        <div
          key={view + searchQuery + selectedCategory + selectedDiet + sortOption}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-transform duration-500 ease-out animate-slide-in"
        >
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeList;
