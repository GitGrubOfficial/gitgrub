// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ROUTES } from './routes';

// Components
import RecipeList from './components/recipes/RecipeList';
import RecipeView from './components/recipes/RecipeView';
import RecipeForm from './components/recipes/RecipeForm';
import RecipeEditForm from './components/recipes/RecipeEditForm';
import RecipeHistory from './components/recipes/RecipeHistory';
import RecipeVersionView from './components/recipes/RecipeVersionView';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>GitGrub</h1>
          <p className="subtitle">Version-controlled recipe management</p>
        </header>
        
        <main>
          <Routes>
            {/* Redirect root to demo user recipes */}
            <Route path="/" element={<Navigate to="/users/demo/recipes" />} />
            
            {/* Recipe list */}
            <Route path={ROUTES.RECIPE_LIST} element={<RecipeList />} />
            
            {/* Create new recipe */}
            <Route path={ROUTES.RECIPE_NEW} element={<RecipeForm />} />
            
            {/* View recipe */}
            <Route path={ROUTES.RECIPE_VIEW} element={<RecipeView />} />
            
            {/* Edit recipe */}
            <Route path={ROUTES.RECIPE_EDIT} element={<RecipeEditForm />} />
            
            {/* Recipe version history */}
            <Route path={ROUTES.RECIPE_VERSIONS} element={<RecipeHistory />} />
            
            {/* View specific version */}
            <Route path={ROUTES.RECIPE_VERSION_VIEW} element={<RecipeVersionView />} />
            
            {/* Restore specific version - redirects to edit form pre-filled with that version */}
            <Route path={ROUTES.RECIPE_RESTORE} element={<RecipeVersionView />} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <p>&copy; 2025 GitGrub - Git-based Recipe Versioning POC</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
