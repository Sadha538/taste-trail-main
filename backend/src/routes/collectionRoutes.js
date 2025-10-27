const express = require('express');
const {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  createCollection,
  getCollections,
  addRecipeToCollection,
} = require('../controllers/collectionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/favorites', protect, getFavorites);
router.post('/favorites/:recipeId', protect, addToFavorites);
router.delete('/favorites/:recipeId', protect, removeFromFavorites);

router.get('/', protect, getCollections);
router.post('/', protect, createCollection);
router.post('/:collectionId/:recipeId', protect, addRecipeToCollection);

module.exports = router;

