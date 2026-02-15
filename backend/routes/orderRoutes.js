const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/myorders', protect, getMyOrders);
router.put('/:id', protect, updateOrderStatus);

module.exports = router;
