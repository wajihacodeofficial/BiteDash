const User = require('../models/User');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// Dashboard Stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalRiders = await User.countDocuments({ role: 'rider' });
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name')
      .populate('restaurant', 'name');

    const allRestaurants = await Restaurant.find().select(
      'name location cuisine rating status'
    );

    res.json({
      totals: {
        totalUsers,
        totalRiders,
        totalRestaurants,
        totalOrders,
        revenue: revenue[0]?.total || 0,
      },
      recentOrders,
      allRestaurants,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manage Riders (Termination/Salary/Contract)
const updateRider = async (req, res) => {
  try {
    const { employmentStatus, salary, contractType } = req.body;
    const rider = await User.findByIdAndUpdate(
      req.params.id,
      { employmentStatus, salary, contractType },
      { new: true }
    );
    res.json(rider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Complaints
const getComplaints = async (req, res) => {
  try {
    const complaints = await Order.find({ complaintStatus: { $ne: 'none' } })
      .populate('user', 'name address phone')
      .populate('restaurant', 'name');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manage Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select(
      '-password'
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, updateRider, getComplaints, getUsers, deleteUser };
