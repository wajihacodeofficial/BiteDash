const RiderWallet = require('../models/RiderWallet');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

// Get Wallet Balance & History
const getWallet = async (req, res) => {
  try {
    let wallet = await RiderWallet.findOne({ riderId: req.user.id });
    if (!wallet) {
      wallet = await RiderWallet.create({ riderId: req.user.id });
    }

    const transactions = await Transaction.find({ walletId: wallet._id }).sort({
      createdAt: -1,
    });

    res.json({ wallet, transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Internal function to credit wallet (Not an API endpoint)
// Call this when order is delivered
const creditOrderEarnings = async (riderId, orderId, orderTotal) => {
  try {
    let wallet = await RiderWallet.findOne({ riderId });
    if (!wallet) wallet = await RiderWallet.create({ riderId });

    // Calculate earnings (e.g., Base Rs. 50 + 10% of order) - Mock Logic
    const earnings = 50 + orderTotal * 0.1;

    // Credit Wallet
    wallet.balance += earnings;
    await wallet.save();

    // Log Transaction
    await Transaction.create({
      walletId: wallet._id,
      type: 'CREDIT',
      amount: earnings,
      description: `Earnings for Order #${orderId}`,
      referenceType: 'ORDER_EARNING',
      referenceId: orderId,
    });

    return wallet;
  } catch (err) {
    console.error('Wallet Credit Error:', err);
  }
};

// Request Payout
const requestPayout = async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await RiderWallet.findOne({ riderId: req.user.id });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Debit Wallet
    wallet.balance -= amount;
    await wallet.save();

    // Create Transaction
    await Transaction.create({
      walletId: wallet._id,
      type: 'DEBIT',
      amount,
      description: 'Payout Request',
      referenceType: 'PAYOUT',
      status: 'pending', // Admin approval needed in real system
    });

    res.json({
      message: 'Payout requested successfully',
      balance: wallet.balance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Available Orders (Pending ones without a rider)
const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ['pending', 'preparing'] },
      rider: { $exists: false },
    }).populate('restaurant', 'name address');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pick Up Order
const pickUpOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.rider) {
      return res.status(400).json({ message: 'Order already taken' });
    }

    order.rider = req.user.id;
    order.status = 'out_for_delivery';
    order.statusHistory.push({ status: 'out_for_delivery' });
    await order.save();

    // Notify Customer & Admin & Room
    if (req.io) {
      const updateData = {
        orderId: order._id,
        status: 'out_for_delivery',
        rider: req.user.id,
      };

      // Notify order room (Customer tracking)
      req.io.to(order._id.toString()).emit('order_status_changed', updateData);

      // Notify admin dashboard
      req.io.emit('admin_order_update', updateData);

      // Notify all riders that this order is taken
      req.io.emit('order_taken', order._id);
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Complete Delivery
const completeDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.rider.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not your order' });
    }

    order.status = 'delivered';
    order.statusHistory.push({ status: 'delivered' });
    order.paymentStatus = 'paid'; // Assume paid on delivery or already paid
    await order.save();

    // Credit Rider Wallet
    await creditOrderEarnings(req.user.id, order._id, order.finalAmount);

    // Notify Customer
    // Notify Customer & Admin
    // Notify Customer & Admin & Room
    if (req.io) {
      const updateData = {
        orderId: order._id,
        status: 'delivered',
      };

      // Notify order room
      req.io.to(order._id.toString()).emit('order_status_changed', updateData);

      // Notify admin
      req.io.emit('admin_order_update', updateData);
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAvailableOrders,
  pickUpOrder,
  completeDelivery,
  getWallet,
  requestPayout,
  creditOrderEarnings,
};
