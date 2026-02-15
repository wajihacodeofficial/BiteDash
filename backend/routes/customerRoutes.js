const express = require('express');
const router = express.Router();
const {
  getMyOrders,
  submitFeedback,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/orders', protect, getMyOrders);
router.post('/feedback', protect, submitFeedback);

module.exports = router;
