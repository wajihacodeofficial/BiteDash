const express = require('express');
const router = express.Router();
const {
  getAvailableOrders,
  pickUpOrder,
  completeDelivery,
  getWallet,
  requestPayout,
} = require('../controllers/riderController');
const { protect } = require('../middleware/authMiddleware');

router.get('/available', protect, getAvailableOrders);
router.put('/pickup/:id', protect, pickUpOrder);
router.put('/deliver/:id', protect, completeDelivery);

router.get('/wallet', protect, getWallet);
router.post('/payout', protect, requestPayout);

module.exports = router;
