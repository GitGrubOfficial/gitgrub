// frontend/src/services/recipeService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Get all recipes for a user
export const getAllRecipes = async (username) => {
  const response = await axios.get(`${API_BASE_URL}/users/${username}/recipes`);
  return response.data;
};

// Get a specific recipe
export const getRecipe = async (username, recipeId) => {
  const response = await axios.get(`${API_BASE_URL}/users/${username}/recipes/${recipeId}`);
  return response.data;
};

// Create a new recipe
export const createRecipe = async (username, recipeData) => {
  const response = await axios.post(`${API_BASE_URL}/users/${username}/recipes`, recipeData);
  return response.data;
};
// Update a recipe
export const updateRecipe = async (username, recipeId, recipeData) => {
  const response = await axios.put(`${API_BASE_URL}/users/${username}/recipes/${recipeId}`, recipeData);
  return response.data;
};

// Get recipe version history
export const getRecipeVersions = async (username, recipeId) => {
  const response = await axios.get(`${API_BASE_URL}/users/${username}/recipes/${recipeId}/versions`);
  return response.data;
};

// Get a specific version of a recipe
export const getRecipeVersion = async (username, recipeId, commitHash) => {
  const response = await axios.get(`${API_BASE_URL}/users/${username}/recipes/${recipeId}/versions/${commitHash}`);
  return response.data;
};

// Restore a specific version of a recipe
export const restoreRecipeVersion = async (username, recipeId, commitHash, commitMessage) => {
  const response = await axios.post(
    `${API_BASE_URL}/users/${username}/recipes/${recipeId}/restore/${commitHash}`, { commitMessage });
  return response.data;
};

// Fork a recipe from another user
export const forkRecipe = async (username, sourceUsername, sourceRecipeId, commitMessage) => {
  const response = await axios.post(
    `${API_BASE_URL}/users/${username}/fork/${sourceUsername}/${sourceRecipeId}`,
    { commitMessage }
  );
  return response.data;
};

// Get fork information
export const getForkInfo = async (username, recipeId) => {
  const response = await axios.get(
    `${API_BASE_URL}/users/${username}/recipes/${recipeId}/fork-info`
  );
  return response.data;
};