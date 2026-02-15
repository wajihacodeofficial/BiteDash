const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiderWallet',
      required: true,
    },
    type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
    amount: { type: Number, required: true },

    description: String,
    referenceType: {
      type: String,
      enum: ['ORDER_EARNING', 'TIP', 'PAYOUT', 'ADJUSTMENT'],
    },
    referenceId: { type: String }, // Can be OrderID or PayoutID

    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
