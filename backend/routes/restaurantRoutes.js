const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getSuggestions,
  createRestaurant,
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllRestaurants);
router.get('/suggestions', getSuggestions);
router.get('/:id', getRestaurantById);
router.post('/', protect, authorize(['restaurant', 'admin']), createRestaurant);

module.exports = router;
