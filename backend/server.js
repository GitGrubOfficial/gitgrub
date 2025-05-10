// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const simpleGit = require('simple-git');
const crypto = require('crypto');

const recipeFileName = 'recipe.md';

const getUserReposPath = (baseDir, username) => path.join(baseDir, username);
const getRepoPath = (baseDir, username, recipeId) => path.join(baseDir, username, recipeId);
const getRecipeFilePath = (baseDir, username, recipeId) => path.join(baseDir, username, recipeId, recipeFileName);

// Update the extractTitleFromContent function in server.js
const extractTitleFromContent = (content, fallbackId = null) => {
  if (!content) return fallbackId;
  
  // Look for Markdown H1 title (#)
  const lines = content.split('\n');
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      return line.substring(2).trim();
    }
  }
  
  // If no H1 found, look for the first non-empty line
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      return trimmed;
    }
  }
  
  return fallbackId;
};

const getRepoMetadata = async (repoPath, recipeId) => {
  try {
    const git = simpleGit(repoPath);
    
    if (!(await git.checkIsRepo())) {
      return null;
    }
    
    const recipeFile = path.join(repoPath, recipeFileName);
    if (!(await fs.pathExists(recipeFile))) {
      return null;
    }
    
    const content = await fs.readFile(recipeFile, 'utf8');
    
    const title = extractTitleFromContent(content, recipeId);
    
    const latestLog = await git.log({ maxCount: 1 });
    const updatedAt = latestLog.latest ? latestLog.latest.date : new Date().toISOString();
    
    const firstLog = await git.log({ maxCount: 1, '--reverse': null });
    const createdAt = firstLog.latest ? firstLog.latest.date : updatedAt;
    
    return {
      title,
      createdAt,
      updatedAt
    };
  } catch (error) {
    console.error(`Error getting repo metadata for ${repoPath}:`, error);
    return null;
  }
};

// Get all recipes for a user
const getAllRecipes = async (req, res, { baseDir }) => {
  try {
    const { username } = req.params;
    const userPath = getUserReposPath(baseDir, username);
    
    if (!(await fs.pathExists(userPath))) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const recipeDirs = await fs.readdir(userPath);
    const recipes = [];
    
    for (const recipeId of recipeDirs) {
      const repoPath = getRepoPath(baseDir, username, recipeId);
      
      if (!(await fs.stat(repoPath)).isDirectory()) continue;
      
      const metadata = await getRepoMetadata(repoPath, recipeId);
      
      if (metadata) {
        recipes.push({
          recipeId,
          ...metadata
        });
      }
    }
    
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Failed to fetch recipes', error: error.message });
  }
};

// Create a new recipe
const createRecipe = async (req, res, { baseDir }) => {
  try {
    const { username } = req.params;
    const { title, content, commitMessage } = req.body;
    
    const userPath = getUserReposPath(baseDir, username);
    await fs.ensureDir(userPath);
    
    const recipeId = crypto.randomUUID();
    
    const repoPath = getRepoPath(baseDir, username, recipeId);
    await fs.ensureDir(repoPath);
    
    const git = simpleGit(repoPath);
    await git.init();
    await git.addConfig('user.name', username);
    await git.addConfig('user.email', 'poc@example.com');
    
    const filePath = getRecipeFilePath(baseDir, username, recipeId);
    await fs.writeFile(filePath, content);
    
    await git.add('./*');
    await git.commit(commitMessage || 'Initial recipe');
    
    const metadata = await getRepoMetadata(repoPath, recipeId);
    
    res.status(201).json({
      recipeId,
      ...metadata
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Failed to create recipe', error: error.message });
  }
};

// Get a specific recipe
const getRecipe = async (req, res, { baseDir }) => {
  try {
    const { username, recipeId } = req.params;
    
    const repoPath = getRepoPath(baseDir, username, recipeId);
    if (!(await fs.pathExists(repoPath))) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const filePath = getRecipeFilePath(baseDir, username, recipeId);
    if (!(await fs.pathExists(filePath))) {
      return res.status(404).json({ message: 'Recipe file not found' });
    }
    
    const content = await fs.readFile(filePath, 'utf8');
    
    const metadata = await getRepoMetadata(repoPath, recipeId);
    
    res.json({
      recipeId,
      ...metadata,
      content
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Failed to fetch recipe', error: error.message });
  }
};

// Update a recipe
const updateRecipe = async (req, res, { baseDir }) => {
  try {
    const { username, recipeId } = req.params;
    const { title, content, commitMessage } = req.body;
    
    const repoPath = getRepoPath(baseDir, username, recipeId);
    if (!(await fs.pathExists(repoPath))) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const filePath = getRecipeFilePath(baseDir, username, recipeId);
    await fs.writeFile(filePath, content);
    
    const git = simpleGit(repoPath);
    await git.add('./*');
    await git.commit(commitMessage || 'Update recipe');
    
    const metadata = await getRepoMetadata(repoPath, recipeId);
    
    res.json({
      recipeId,
      ...metadata,
      content
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Failed to update recipe', error: error.message });
  }
};

// Get recipe version history
const getRecipeVersions = async (req, res, { baseDir }) => {
  try {
    const { username, recipeId } = req.params;
    
    const repoPath = getRepoPath(baseDir, username, recipeId);
    if (!(await fs.pathExists(repoPath))) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const git = simpleGit(repoPath);
    const logResult = await git.log();
    
    const history = logResult.all.map(commit => ({
      hash: commit.hash,
      author: commit.author_name,
      date: commit.date,
      message: commit.message
    }));
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching recipe history:', error);
    res.status(500).json({ message: 'Failed to fetch recipe history', error: error.message });
  }
};

// Get a specific version of a recipe
const getRecipeVersion = async (req, res, { baseDir }) => {
  try {
    const { username, recipeId, commitHash } = req.params;
    
    const repoPath = getRepoPath(baseDir, username, recipeId);
    if (!(await fs.pathExists(repoPath))) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const git = simpleGit(repoPath);
    
    try {
      await git.show([commitHash]);
    } catch (error) {
      return res.status(404).json({ message: 'Version not found' });
    }
    
    const content = await git.show([`${commitHash}:${recipeFileName}`]);
    
    const commitInfo = await git.show([
      '--no-patch',
      '--format=%H%n%an%n%ad%n%s',
      commitHash
    ]);
    
    const [hash, author, date, message] = commitInfo.trim().split('\n');
    
    const title = extractTitleFromContent(content) || recipeId;
    
    res.json({
      recipeId,
      title,
      commitHash,
      author,
      date,
      message,
      content
    });
  } catch (error) {
    console.error('Error fetching recipe version:', error);
    res.status(500).json({ message: 'Failed to fetch recipe version', error: error.message });
  }
};

const restoreRecipeVersion = async (req, res, { baseDir }) => {
  try {
    const { username, recipeId, commitHash } = req.params;
    const { commitMessage } = req.body;
    
    const repoPath = getRepoPath(baseDir, username, recipeId);
    if (!(await fs.pathExists(repoPath))) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const git = simpleGit(repoPath);
    
    try {
      await git.show([commitHash]);
    } catch (error) {
      return res.status(404).json({ message: 'Version not found' });
    }
    
    const content = await git.show([`${commitHash}:${recipeFileName}`]);
    
    const filePath = getRecipeFilePath(baseDir, username, recipeId);
    await fs.writeFile(filePath, content);
    
    await git.add('./*');
    await git.commit(commitMessage || `Restored from version ${commitHash.substring(0, 7)}`);
    
    const metadata = await getRepoMetadata(repoPath, recipeId);
    
    res.json({
      recipeId,
      ...metadata,
      content
    });
  } catch (error) {
    console.error('Error restoring recipe version:', error);
    res.status(500).json({ message: 'Failed to restore recipe version', error: error.message });
  }
};

// Fork a recipe from another user
const forkRecipe = async (req, res, { baseDir }) => {
  try {
    const { sourceUsername, sourceRecipeId } = req.params;
    const { username } = req.params; // Target username (who's forking)
    const { commitMessage } = req.body;
    
    const sourceRepoPath = getRepoPath(baseDir, sourceUsername, sourceRecipeId);
    if (!(await fs.pathExists(sourceRepoPath))) {
      return res.status(404).json({ message: 'Source recipe not found' });
    }
    
    const forkedRecipeId = crypto.randomUUID();
    const targetRepoPath = getRepoPath(baseDir, username, forkedRecipeId);
    
    const userPath = getUserReposPath(baseDir, username);
    await fs.ensureDir(userPath);
    
    await fs.ensureDir(targetRepoPath);
    const git = simpleGit(targetRepoPath);
    await git.init();
    await git.addConfig('user.name', username);
    await git.addConfig('user.email', 'poc@example.com');
    
    const sourceFilePath = getRecipeFilePath(baseDir, sourceUsername, sourceRecipeId);
    const targetFilePath = getRecipeFilePath(baseDir, username, forkedRecipeId);
    await fs.copy(sourceFilePath, targetFilePath);
    
    await git.add('./*');
    await git.commit(commitMessage || `Forked from ${sourceUsername}'s recipe`);
    
    // Set up the remote to point to the original recipe
    // Calculate the relative path from target to source
    const remoteUrl = path.relative(targetRepoPath, sourceRepoPath);
    await git.addRemote('upstream', remoteUrl);
    
    const content = await fs.readFile(targetFilePath, 'utf8');
    const metadata = await getRepoMetadata(targetRepoPath, forkedRecipeId);
    
    res.status(201).json({
      recipeId: forkedRecipeId,
      ...metadata,
      content,
      forkedFrom: {
        username: sourceUsername,
        recipeId: sourceRecipeId
      }
    });
  } catch (error) {
    console.error('Error forking recipe:', error);
    res.status(500).json({ message: 'Failed to fork recipe', error: error.message });
  }
};

// Get fork information (to check if a recipe is a fork and from where)
const getForkInfo = async (req, res, { baseDir }) => {
  try {
    const { username, recipeId } = req.params;
    
    const repoPath = getRepoPath(baseDir, username, recipeId);
    if (!(await fs.pathExists(repoPath))) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const git = simpleGit(repoPath);
    
    // Check if this repo has an upstream remote
    const remotes = await git.getRemotes(true);
    const upstream = remotes.find(remote => remote.name === 'upstream');
    
    if (!upstream) {
      return res.json({ isFork: false });
    }
    
    // Parse the remote URL to get the original recipe info
    // The URL is a relative path like "../../sourceUsername/sourceRecipeId"
    const parts = upstream.refs.fetch.split(path.sep);
    const sourceRecipeId = parts[parts.length - 1];
    const sourceUsername = parts[parts.length - 2];
    
    return res.json({ 
      isFork: true,
      forkedFrom: {
        username: sourceUsername,
        recipeId: sourceRecipeId
      }
    });
  } catch (error) {
    console.error('Error getting fork info:', error);
    res.status(500).json({ message: 'Failed to get fork info', error: error.message });
  }
};

// TEMPORARY FOR FORKING FUNCTIONALITY - Create a test user with fixed recipes
const setupTestUser = async (baseDir) => {
  try {
    const testUsername = 'test_user';
    const userPath = getUserReposPath(baseDir, testUsername);
    await fs.ensureDir(userPath);
    
    const sampleRecipes = [
      {
        id: 'chocolate-cake',
        title: 'Chocolate Cake',
        content: `# Chocolate Cake\n\nA delicious chocolate cake recipe.\n\n## Ingredients\n\n- 2 cups flour\n- 2 cups sugar\n- 3/4 cup cocoa powder\n- 2 tsp baking soda\n- 1 tsp salt\n- 2 eggs\n- 1 cup buttermilk\n- 1/2 cup vegetable oil\n- 2 tsp vanilla extract\n- 1 cup hot coffee\n\n## Instructions\n\n1. Preheat oven to 350°F (175°C)\n2. Mix dry ingredients\n3. Add wet ingredients and mix well\n4. Pour into pans and bake for 30-35 minutes`
      },
      {
        id: 'banana-bread',
        title: 'Banana Bread',
        content: `# Banana Bread\n\nClassic banana bread recipe.\n\n## Ingredients\n\n- 3 ripe bananas\n- 1/3 cup melted butter\n- 1 tsp baking soda\n- Pinch of salt\n- 3/4 cup sugar\n- 1 large egg\n- 1 tsp vanilla extract\n- 1 1/2 cups flour\n\n## Instructions\n\n1. Preheat oven to 350°F (175°C)\n2. Mash bananas and mix with melted butter\n3. Mix in other ingredients\n4. Pour into loaf pan and bake for 50-60 minutes`
      }
    ];
    
    for (const recipe of sampleRecipes) {
      const repoPath = getRepoPath(baseDir, testUsername, recipe.id);
      
      if (await fs.pathExists(repoPath)) {
        console.log(`Recipe ${recipe.id} already exists for ${testUsername}, skipping`);
        continue;
      }
      
      await fs.ensureDir(repoPath);
      
      const git = simpleGit(repoPath);
      await git.init();
      await git.addConfig('user.name', testUsername);
      await git.addConfig('user.email', 'test@example.com');
      
      const filePath = getRecipeFilePath(baseDir, testUsername, recipe.id);
      await fs.writeFile(filePath, recipe.content);
      
      await git.add('./*');
      await git.commit('Initial recipe');
    }
    
    console.log(`Test user '${testUsername}' created with sample recipes`);
  } catch (error) {
    console.error('Error setting up test user:', error);
  }
};

const setupApp = (config = {}) => {
  const app = express();
  
  const baseDir = config.reposDir || path.join(__dirname, 'git-repos');

  // THIS IS TEMPORARY FOR DEMOING FORKING BEFORE WE HAVE ADDED USER MANAGEMENT SYSTEM
  if (process.env.NODE_ENV !== 'test') {
    const demoUserPath = getUserReposPath(baseDir, 'demo');
    fs.ensureDir(demoUserPath);
    
    setupTestUser(baseDir);
  }
  
  // Setup middleware
  app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
  
  fs.ensureDirSync(baseDir);
  
  // Create context object with only what's needed
  const context = { baseDir };
  
  // Setup routes
  app.get('/api/users/:username/recipes', (req, res) => getAllRecipes(req, res, context));
  app.post('/api/users/:username/recipes', (req, res) => createRecipe(req, res, context));
  app.get('/api/users/:username/recipes/:recipeId', (req, res) => getRecipe(req, res, context));
  app.put('/api/users/:username/recipes/:recipeId', (req, res) => updateRecipe(req, res, context));
  app.get('/api/users/:username/recipes/:recipeId/versions', (req, res) => getRecipeVersions(req, res, context));
  app.get('/api/users/:username/recipes/:recipeId/versions/:commitHash', (req, res) => getRecipeVersion(req, res, context));
  app.post('/api/users/:username/recipes/:recipeId/restore/:commitHash', (req, res) => restoreRecipeVersion(req, res, context));
  app.post('/api/users/:username/fork/:sourceUsername/:sourceRecipeId', (req, res) => forkRecipe(req, res, context));
  app.get('/api/users/:username/recipes/:recipeId/fork-info', (req, res) => getForkInfo(req, res, context));
  
  // Make context accessible for testing
  app.locals.context = context;
  
  // Create demo user directory (not needed for testing since tests create their own user)
  // Only do this in non-test environments to avoid test interference
  if (process.env.NODE_ENV !== 'test') {
    const demoUserPath = getUserReposPath(baseDir, 'demo');
    fs.ensureDirSync(demoUserPath);
  }
  
  return app;
};

const app = setupApp();

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for testing
module.exports = setupApp;
