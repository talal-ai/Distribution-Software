const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    costPrice: {
      type: Number,
      required: [true, 'Please add a cost price'],
      default: 0,
    },
    salePrice: {
      type: Number,
      required: [true, 'Please add a sale price'],
      default: 0,
    },
    currentStock: {
      type: Number,
      required: [true, 'Please add current stock'],
      default: 0,
    },
    minStockLevel: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      trim: true,
    },
    variant: {
      type: String,
      trim: true,
    },
    // For tracking who created/modified the product
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema); 