const mongoose = require('mongoose');

const financeTransactionSchema = mongoose.Schema(
  {
    transactionType: {
      type: String,
      required: true,
      enum: ['income', 'expense', 'recovery', 'credit', 'petrol', 'motorcycle', 'cash_short', 'reward', 'scheme'],
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'jazz_cash', 'ubl'],
      default: 'cash',
    },
    // Reference to a sale if this transaction is related to a sale
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale',
    },
    // Reference to a user if this transaction is related to a user (e.g., salesman expense)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // User who created the transaction
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: String,
    // For tracking balances
    openingBalance: {
      type: Number,
      default: 0,
    },
    closingBalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
financeTransactionSchema.index({ date: 1 });
financeTransactionSchema.index({ transactionType: 1 });
financeTransactionSchema.index({ user: 1 });

module.exports = mongoose.model('FinanceTransaction', financeTransactionSchema); 