const express = require('express');
const router = express.Router();
const {
  getStats,
  updateRider,
  getComplaints,
  getUsers,
  deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Access denied. Admin only.' });
};

router.get('/stats', protect, adminOnly, getStats);
router.get('/complaints', protect, adminOnly, getComplaints);
router.put('/rider/:id', protect, adminOnly, updateRider);
router.get('/users', protect, adminOnly, getUsers);
router.delete('/user/:id', protect, adminOnly, deleteUser);

module.exports = router;
