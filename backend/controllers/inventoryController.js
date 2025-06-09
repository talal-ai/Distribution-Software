const asyncHandler = require('express-async-handler');
const InventoryTransaction = require('../models/inventoryModel');
const Product = require('../models/productModel');

// @desc    Create a new inventory transaction
// @route   POST /api/inventory
// @access  Private/Admin
const createInventoryTransaction = asyncHandler(async (req, res) => {
  const { product, transactionType, quantity, notes, date } = req.body;

  // Validate required fields
  if (!product || !transactionType || !quantity) {
    res.status(400);
    throw new Error('Please provide product, transaction type, and quantity');
  }

  // Check if product exists
  const productExists = await Product.findById(product);
  if (!productExists) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Get current stock
  let openingBalance = productExists.currentStock;
  let closingBalance = openingBalance;

  // Calculate closing balance based on transaction type
  if (
    transactionType === 'lifting_from_pmpkl' ||
    transactionType === 'lifting_from_other' ||
    transactionType === 'return'
  ) {
    closingBalance = openingBalance + quantity;
  } else if (transactionType === 'sale') {
    closingBalance = openingBalance - quantity;
    if (closingBalance < 0) {
      res.status(400);
      throw new Error('Insufficient stock');
    }
  } else if (transactionType === 'adjustment') {
    closingBalance = openingBalance + quantity; // Can be negative for stock reduction
  }

  // Create transaction
  const transaction = await InventoryTransaction.create({
    product,
    transactionType,
    quantity,
    openingBalance,
    closingBalance,
    notes,
    date: date || Date.now(),
    user: req.user._id,
  });

  if (transaction) {
    // Update product stock
    await Product.findByIdAndUpdate(product, { currentStock: closingBalance });

    res.status(201).json(transaction);
  } else {
    res.status(400);
    throw new Error('Invalid transaction data');
  }
});

// @desc    Get all inventory transactions
// @route   GET /api/inventory
// @access  Private
const getInventoryTransactions = asyncHandler(async (req, res) => {
  // Query parameters
  const { product, transactionType, startDate, endDate, limit, page } = req.query;

  // Build query
  const query = {};

  // Filter by product
  if (product) {
    query.product = product;
  }

  // Filter by transaction type
  if (transactionType) {
    query.transactionType = transactionType;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate);
    }
    if (endDate) {
      query.date.$lte = new Date(endDate);
    }
  }

  // Set default pagination values
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * pageSize;

  // Execute query
  const transactions = await InventoryTransaction.find(query)
    .populate('product', 'name brand sku')
    .populate('user', 'name')
    .sort({ date: -1 })
    .skip(skip)
    .limit(pageSize);

  // Get total count
  const count = await InventoryTransaction.countDocuments(query);

  res.status(200).json({
    transactions,
    page: pageNumber,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get inventory transaction by ID
// @route   GET /api/inventory/:id
// @access  Private
const getInventoryTransactionById = asyncHandler(async (req, res) => {
  const transaction = await InventoryTransaction.findById(req.params.id)
    .populate('product', 'name brand sku costPrice salePrice')
    .populate('user', 'name');

  if (transaction) {
    res.status(200).json(transaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

// @desc    Update inventory transaction
// @route   PUT /api/inventory/:id
// @access  Private/Admin
const updateInventoryTransaction = asyncHandler(async (req, res) => {
  const transaction = await InventoryTransaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Cannot update certain fields
  if (req.body.product || req.body.openingBalance || req.body.closingBalance) {
    res.status(400);
    throw new Error('Cannot update product or balance fields');
  }

  // If updating quantity, recalculate closing balance
  if (req.body.quantity && req.body.quantity !== transaction.quantity) {
    const product = await Product.findById(transaction.product);
    
    // Revert previous transaction effect
    let currentStock = product.currentStock;
    if (
      transaction.transactionType === 'lifting_from_pmpkl' ||
      transaction.transactionType === 'lifting_from_other' ||
      transaction.transactionType === 'return'
    ) {
      currentStock -= transaction.quantity;
    } else if (transaction.transactionType === 'sale') {
      currentStock += transaction.quantity;
    } else if (transaction.transactionType === 'adjustment') {
      currentStock -= transaction.quantity;
    }
    
    // Apply new quantity
    if (
      transaction.transactionType === 'lifting_from_pmpkl' ||
      transaction.transactionType === 'lifting_from_other' ||
      transaction.transactionType === 'return'
    ) {
      currentStock += req.body.quantity;
    } else if (transaction.transactionType === 'sale') {
      currentStock -= req.body.quantity;
      if (currentStock < 0) {
        res.status(400);
        throw new Error('Insufficient stock');
      }
    } else if (transaction.transactionType === 'adjustment') {
      currentStock += req.body.quantity;
    }
    
    // Update product stock
    await Product.findByIdAndUpdate(transaction.product, { currentStock });
    
    // Update closing balance
    req.body.closingBalance = transaction.openingBalance + 
      (transaction.transactionType === 'sale' ? -req.body.quantity : req.body.quantity);
  }

  const updatedTransaction = await InventoryTransaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedTransaction);
});

// @desc    Delete inventory transaction
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
const deleteInventoryTransaction = asyncHandler(async (req, res) => {
  const transaction = await InventoryTransaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Revert transaction effect on product stock
  const product = await Product.findById(transaction.product);
  let currentStock = product.currentStock;
  
  if (
    transaction.transactionType === 'lifting_from_pmpkl' ||
    transaction.transactionType === 'lifting_from_other' ||
    transaction.transactionType === 'return'
  ) {
    currentStock -= transaction.quantity;
  } else if (transaction.transactionType === 'sale') {
    currentStock += transaction.quantity;
  } else if (transaction.transactionType === 'adjustment') {
    currentStock -= transaction.quantity;
  }
  
  // Update product stock
  await Product.findByIdAndUpdate(transaction.product, { currentStock });

  await transaction.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc    Get current stock levels
// @route   GET /api/inventory/stock
// @access  Private
const getCurrentStock = asyncHandler(async (req, res) => {
  const products = await Product.find({}).select('name brand sku currentStock minStockLevel');
  
  // Identify low stock items
  const lowStock = products.filter(product => product.currentStock <= product.minStockLevel);
  
  res.status(200).json({
    products,
    lowStock,
  });
});

// @desc    Get daily inventory report
// @route   GET /api/inventory/report/daily
// @access  Private
const getDailyInventoryReport = asyncHandler(async (req, res) => {
  const { date } = req.query;
  
  // Default to today if no date provided
  const reportDate = date ? new Date(date) : new Date();
  
  // Set start and end of the day
  const startOfDay = new Date(reportDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(reportDate.setHours(23, 59, 59, 999));
  
  // Get transactions for the day
  const transactions = await InventoryTransaction.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  }).populate('product', 'name brand sku costPrice salePrice')
    .populate('user', 'name')
    .sort({ date: 1 });
  
  // Group by product and transaction type
  const report = {};
  
  transactions.forEach(transaction => {
    const productId = transaction.product._id.toString();
    
    if (!report[productId]) {
      report[productId] = {
        product: {
          _id: transaction.product._id,
          name: transaction.product.name,
          brand: transaction.product.brand,
          sku: transaction.product.sku,
        },
        opening: 0,
        lifting_from_pmpkl: 0,
        lifting_from_other: 0,
        sales: 0,
        returns: 0,
        adjustments: 0,
        closing: 0,
      };
    }
    
    // First transaction of the day for this product gives opening balance
    if (report[productId].opening === 0) {
      report[productId].opening = transaction.openingBalance;
    }
    
    // Add to respective transaction type
    switch (transaction.transactionType) {
      case 'lifting_from_pmpkl':
        report[productId].lifting_from_pmpkl += transaction.quantity;
        break;
      case 'lifting_from_other':
        report[productId].lifting_from_other += transaction.quantity;
        break;
      case 'sale':
        report[productId].sales += transaction.quantity;
        break;
      case 'return':
        report[productId].returns += transaction.quantity;
        break;
      case 'adjustment':
        report[productId].adjustments += transaction.quantity;
        break;
      default:
        break;
    }
    
    // Last transaction gives closing balance
    report[productId].closing = transaction.closingBalance;
  });
  
  res.status(200).json({
    date: startOfDay,
    report: Object.values(report),
  });
});

module.exports = {
  createInventoryTransaction,
  getInventoryTransactions,
  getInventoryTransactionById,
  updateInventoryTransaction,
  deleteInventoryTransaction,
  getCurrentStock,
  getDailyInventoryReport,
}; 