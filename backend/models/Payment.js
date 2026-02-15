const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },

    type: { type: String, enum: ['ORDER', 'SUBSCRIPTION'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'PKR' },
    method: { type: String, enum: ['card', 'wallet', 'cod'], required: true },

    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },

    transactionId: { type: String, unique: true }, // Internal unique ID
    gatewayReference: { type: String }, // ID from Stripe/PayPal

    metadata: { type: Map, of: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
