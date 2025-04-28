import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipes/${recipe.id}`} className="block cursor-pointer">
      <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-200 ease-in-out">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
            No image
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1">{recipe.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
          <div className="mt-2 text-xs text-gray-500">
            <span>Prep: {recipe.prep_time} min</span> •{" "}
            <span>Cook: {recipe.cook_time} min</span>
          </div>
          <div className="mt-1 text-xs text-gray-400 italic capitalize">
            {recipe.difficulty}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
