import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaRss, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Search bar should be on the left, home and feed button should be center and userprofile on the right */}
      <div className="flex items-center space-x-4 w-1/3">
        <Link to="/recipes" className="text-xl font-bold text-blue-600">
          RecipeHub
        </Link>
        <input
          type="text"
          placeholder="Search recipes..."
          className="px-3 py-1 rounded-md border w-full max-w-xs"
        />
      </div>

      <nav className="flex justify-center space-x-8 w-1/3">
        <Link to="/recipes" className="text-gray-700 hover:text-blue-600">
          <FaHome size={20} />
        </Link>
        <Link to="/feed" className="text-gray-700 hover:text-blue-600">
          <FaRss size={20} />
        </Link>
      </nav>

      <div className="relative w-1/3 flex justify-end">
        <button onClick={() => setDropdownOpen(!dropdownOpen)}>
          <FaUserCircle size={28} className="text-gray-700" />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40 z-50">
            <Link
              to="/profile"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={() => {
                setDropdownOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
