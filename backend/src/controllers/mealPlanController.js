const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

// @desc    Get user's meal plan
// @route   GET /api/mealplan
// @access  Private
const getMealPlan = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let mealPlan;
    
    if (startDate && endDate) {
      mealPlan = await MealPlan.findOne({
        user: req.user._id,
        'week.startDate': new Date(startDate),
        'week.endDate': new Date(endDate),
      }).populate('meals.recipe');
    } else {
      mealPlan = await MealPlan.find({ user: req.user._id })
        .populate('meals.recipe')
        .sort({ 'week.startDate': -1 })
        .limit(1);
    }

    res.json(mealPlan || { meals: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update meal plan
// @route   POST /api/mealplan
// @access  Private
const createOrUpdateMealPlan = async (req, res) => {
  try {
    const { week, meals } = req.body;

    // Check if meal plan exists for this week
    let mealPlan = await MealPlan.findOne({
      user: req.user._id,
      'week.startDate': week.startDate,
      'week.endDate': week.endDate,
    });

    if (mealPlan) {
      // Update existing meal plan
      mealPlan.meals = meals;
      mealPlan = await mealPlan.save();
    } else {
      // Create new meal plan
      mealPlan = await MealPlan.create({
        user: req.user._id,
        week,
        meals,
      });
    }

    const populatedMealPlan = await MealPlan.findById(mealPlan._id)
      .populate('meals.recipe');

    res.status(201).json(populatedMealPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate shopping list
// @route   GET /api/mealplan/shopping-list
// @access  Private
const generateShoppingList = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const mealPlan = await MealPlan.findOne({
      user: req.user._id,
      'week.startDate': new Date(startDate),
      'week.endDate': new Date(endDate),
    }).populate('meals.recipe');

    if (!mealPlan || !mealPlan.meals.length) {
      return res.json({ shoppingList: [] });
    }

    // Aggregate ingredients by category
    const ingredientMap = new Map();

    mealPlan.meals.forEach((meal) => {
      if (meal.recipe && meal.recipe.ingredients) {
        meal.recipe.ingredients.forEach((ingredient) => {
          const key = `${ingredient.name}-${ingredient.category}`;
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key);
            existing.amounts.push(ingredient.amount);
          } else {
            ingredientMap.set(key, {
              name: ingredient.name,
              category: ingredient.category,
              amounts: [ingredient.amount],
            });
          }
        });
      }
    });

    // Convert map to array and group by category
    const shoppingList = Array.from(ingredientMap.values()).map((item) => ({
      name: item.name,
      amount: item.amounts.join(', '),
      category: item.category,
    }));

    // Group by category
    const groupedList = shoppingList.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({ shoppingList: groupedList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMealPlan,
  createOrUpdateMealPlan,
  generateShoppingList,
};

