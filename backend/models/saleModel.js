const mongoose = require('mongoose');

const saleItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const saleSchema = mongoose.Schema(
  {
    saleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      address: String,
      phone: String,
    },
    items: [saleItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'partial', 'pending'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit', 'bank_transfer', 'jazz_cash', 'ubl'],
      default: 'cash',
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    notes: String,
    // Salesman who made the sale
    salesman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // User who created the record (could be admin or owner)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
saleSchema.index({ date: 1 });
saleSchema.index({ salesman: 1 });
saleSchema.index({ 'customer.name': 1 });

module.exports = mongoose.model('Sale', saleSchema); 