const Recipe = require('../models/Recipe');

// @desc    Get all recipes with filters
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
  try {
    const {
      search,
      cuisine,
      dietTag,
      difficulty,
      maxPrepTime,
      maxCookTime,
      minRating,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (cuisine) query.cuisine = cuisine;
    if (dietTag) query.dietTags = dietTag;
    if (difficulty) query.difficulty = difficulty;
    if (maxPrepTime) query.prepTime = { $lte: parseInt(maxPrepTime) };
    if (maxCookTime) query.cookTime = { $lte: parseInt(maxCookTime) };
    if (minRating) query.averageRating = { $gte: parseFloat(minRating) };

    const recipes = await Recipe.find(query)
      .populate('author', 'name')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Recipe.countDocuments(query);

    res.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name email')
      .populate('reviews.user', 'name')
      .populate('ratings.user', 'name');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Increment views
    recipe.views += 1;
    await recipe.save();

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      author: req.user._id,
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private (admin or author)
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is admin or author
    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private (admin or author)
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is admin or author
    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rate recipe
// @route   POST /api/recipes/:id/rate
// @access  Private
const rateRecipe = async (req, res) => {
  try {
    const { rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user already rated
    const existingRating = recipe.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      recipe.ratings.push({
        user: req.user._id,
        rating,
      });
    }

    await recipe.save();

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review
// @route   POST /api/recipes/:id/review
// @access  Private
const addReview = async (req, res) => {
  try {
    const { comment, photo } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipe.reviews.push({
      user: req.user._id,
      comment,
      photo,
    });

    await recipe.save();

    const updatedRecipe = await Recipe.findById(req.params.id)
      .populate('reviews.user', 'name');

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  addReview,
};

