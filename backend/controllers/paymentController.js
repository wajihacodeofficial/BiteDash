const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const { v4: uuidv4 } = require('uuid');

// Mock Payment Gateway Logic
const mockGateway = {
  createIntent: async (amount) => {
    return {
      id: `pi_${uuidv4()}`,
      client_secret: `secret_${uuidv4()}`,
      status: 'requires_payment_method',
    };
  },
};

// -- Order Payments --

const initiateOrderPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus === 'paid')
      return res.status(400).json({ message: 'Order already paid' });

    // Server-side calculation verification (Order already has totals, but just to be safe we use finalAmount)
    const amount = order.finalAmount;

    // Create Payment Record
    const payment = await Payment.create({
      userId: req.user.id,
      orderId: order._id,
      type: 'ORDER',
      amount,
      method: paymentMethod,
      transactionId: `TXN-${Date.now()}`,
      status: paymentMethod === 'cod' ? 'pending' : 'pending', // COD is pending until delivered
    });

    if (paymentMethod === 'cod') {
      // For COD, we just acknowledge
      return res.json({
        paymentId: payment._id,
        status: 'pending',
        message: 'Cash on Delivery confirmed',
      });
    }

    // For Online (Card), initiate Gateway
    const gatewayIntent = await mockGateway.createIntent(amount);

    // Update payment record with gateway ref
    payment.gatewayReference = gatewayIntent.id;
    await payment.save();

    res.json({
      paymentId: payment._id,
      clientSecret: gatewayIntent.client_secret, // Send to frontend SDK
      amount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Webhook simulation endpoint
const verifyPayment = async (req, res) => {
  try {
    const { paymentId, status } = req.body; // In real world, this comes from Stripe/PayPal webhook body

    const payment = await Payment.findById(paymentId);
    if (!payment)
      return res.status(404).json({ message: 'Payment record not found' });

    if (status === 'success') {
      payment.status = 'completed';
      await payment.save();

      // Update Order
      if (payment.orderId) {
        await Order.findByIdAndUpdate(payment.orderId, {
          paymentStatus: 'paid',
        });
      }

      // Update Subscription
      if (payment.subscriptionId) {
        // Activate subscription logic
        // This is usually handled in purchaseSubscription but verified here
      }
    } else {
      payment.status = 'failed';
      await payment.save();
    }

    res.json({ status: 'updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -- Subscription Payments --

const purchaseSubscription = async (req, res) => {
  try {
    const { planType } = req.body; // 'monthly' or 'yearly'
    const price = planType === 'yearly' ? 5000 : 500; // Mock prices

    // Create Payment
    const payment = await Payment.create({
      userId: req.user.id,
      type: 'SUBSCRIPTION',
      amount: price,
      method: 'card',
      transactionId: `SUB-${Date.now()}`,
      status: 'pending',
    });

    // Mock Gateway
    const gatewayIntent = await mockGateway.createIntent(price);
    payment.gatewayReference = gatewayIntent.id;
    await payment.save();

    res.json({
      paymentId: payment._id,
      clientSecret: gatewayIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const activateSubscription = async (req, res) => {
  // Currently we trigger this manually for demo, or via verifyPayment
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Payment not completed yet' });
    }

    // Calculate Dates
    const startDate = new Date();
    const endDate = new Date();
    if (payment.amount > 1000) {
      // Simple logic for yearly
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Create/Update Subscription
    await Subscription.findOneAndUpdate(
      { userId: req.user.id },
      {
        planType: payment.amount > 1000 ? 'yearly' : 'monthly',
        status: 'active',
        startDate,
        endDate,
        lastPaymentId: payment._id,
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Premium Activated!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  initiateOrderPayment,
  verifyPayment,
  purchaseSubscription,
  activateSubscription,
};
