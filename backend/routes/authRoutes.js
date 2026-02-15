const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, resendVerificationLink } = require('../controllers/authController');

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationLink);
router.post('/login', login);

module.exports = router;
