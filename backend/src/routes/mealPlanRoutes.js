const express = require('express');
const {
  getMealPlan,
  createOrUpdateMealPlan,
  generateShoppingList,
} = require('../controllers/mealPlanController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getMealPlan);
router.post('/', protect, createOrUpdateMealPlan);
router.get('/shopping-list', protect, generateShoppingList);

module.exports = router;

