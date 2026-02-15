const Order = require('../models/Order');

// Get customer orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name image')
      .populate('rider', 'name phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate an order / Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { orderId, rating, review, complaint } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user.id });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.rating = rating;
    order.review = review;
    if (complaint) {
      order.complaint = complaint;
      order.complaintStatus = 'open';
    }

    await order.save();
    res.json({ message: 'Feedback submitted successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyOrders, submitFeedback };
