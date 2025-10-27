const express = require('express');
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  addReview,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.post('/:id/rate', protect, rateRecipe);
router.post('/:id/review', protect, addReview);

module.exports = router;

