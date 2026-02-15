const Order = require('../models/Order');

const placeOrder = async (req, res) => {
  try {
    const { restaurant, items, deliveryAddress, paymentMethod } = req.body;

    // Server-side calculation
    let itemsTotal = 0;
    // In a real app, verify item prices from DB
    items.forEach((item) => {
      itemsTotal += item.price * item.quantity;
    });

    const deliveryFee = 150; // Mock fixed/calculated
    const tax = itemsTotal * 0.13; // 13% Tax
    const discount = 0; // Mock
    const finalAmount = Math.round(itemsTotal + deliveryFee + tax - discount);

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurant,
      items,
      itemsTotal,
      tax,
      deliveryFee,
      discount,
      totalAmount: finalAmount,
      finalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: 'pending',
    });

    // Real-time notification
    if (req.io) {
      req.io.emit('new_order', order);
      req.io.emit('order_available', order);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      'restaurant',
      'name image'
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('restaurant', 'name image address');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add to history
    order.statusHistory.push({ status });
    await order.save();

    // Real-time synchronization
    if (req.io) {
      // Notify the specific order room (Customer tracking)
      req.io.to(order._id.toString()).emit('order_status_changed', {
        orderId: order._id,
        status: status,
      });

      // Notify and update admin dashboard
      req.io.emit('admin_order_update', {
        orderId: order._id,
        status: status,
      });

      // Special case: if order is cancelled or delivered, notify riders to remove from available list
      if (status === 'cancelled' || status === 'delivered') {
        req.io.emit('order_removed_from_available', order._id);
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, updateOrderStatus };
