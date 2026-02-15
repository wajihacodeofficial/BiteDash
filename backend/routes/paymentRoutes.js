const express = require('express');
const router = express.Router();
const {
  initiateOrderPayment,
  verifyPayment,
  purchaseSubscription,
  activateSubscription,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/initiate', protect, initiateOrderPayment);
router.post('/verify', verifyPayment); // Webhooks often don't have user auth headers, but signature verification
router.post('/subscribe', protect, purchaseSubscription);
router.post('/activate-sub', protect, activateSubscription);

module.exports = router;
