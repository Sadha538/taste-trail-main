const User = require('../models/User');

// @desc    Save recipe to favorites
// @route   POST /api/collections/favorites/:recipeId
// @access  Private
const addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.favorites.includes(req.params.recipeId)) {
      return res.status(400).json({ message: 'Recipe already in favorites' });
    }

    user.favorites.push(req.params.recipeId);
    await user.save();

    res.json({ message: 'Recipe added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove recipe from favorites
// @route   DELETE /api/collections/favorites/:recipeId
// @access  Private
const removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.recipeId
    );
    
    await user.save();

    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user favorites
// @route   GET /api/collections/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites');

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new collection
// @route   POST /api/collections
// @access  Private
const createCollection = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user._id);

    user.collections.push({ name, recipes: [] });
    await user.save();

    res.status(201).json(user.collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all collections
// @route   GET /api/collections
// @access  Private
const getCollections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('collections.recipes');

    res.json(user.collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add recipe to collection
// @route   POST /api/collections/:collectionId/:recipeId
// @access  Private
const addRecipeToCollection = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const collection = user.collections.id(req.params.collectionId);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (collection.recipes.includes(req.params.recipeId)) {
      return res.status(400).json({ message: 'Recipe already in collection' });
    }

    collection.recipes.push(req.params.recipeId);
    await user.save();

    res.json({ message: 'Recipe added to collection' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  createCollection,
  getCollections,
  addRecipeToCollection,
};

