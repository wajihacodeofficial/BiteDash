const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      // Role specific fields
      if (user.role === 'rider' && req.body.vehicleInfo) {
        user.vehicleInfo = {
          vehicleType:
            req.body.vehicleInfo.vehicleType || user.vehicleInfo?.vehicleType,
          plateNumber:
            req.body.vehicleInfo.plateNumber || user.vehicleInfo?.plateNumber,
          model: req.body.vehicleInfo.model || user.vehicleInfo?.model,
        };
      }

      if (user.role === 'customer' && req.body.paymentMethods) {
        // For simplicity, we replace the payment methods or append. Let's replace for now or handle specific updates
        user.paymentMethods = req.body.paymentMethods;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        vehicleInfo: updatedUser.vehicleInfo,
        paymentMethods: updatedUser.paymentMethods,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
