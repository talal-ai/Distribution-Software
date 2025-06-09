const mongoose = require('mongoose');

const inventoryTransactionSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ['opening', 'lifting_from_pmpkl', 'lifting_from_other', 'sale', 'return', 'adjustment'],
    },
    quantity: {
      type: Number,
      required: true,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    closingBalance: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
    // For tracking who created the transaction
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // If this is a sale, reference to the sale document
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale',
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
inventoryTransactionSchema.index({ product: 1, date: 1 });

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema); 