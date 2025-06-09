const asyncHandler = require('express-async-handler');
const Sale = require('../models/saleModel');
const InventoryTransaction = require('../models/inventoryModel');
const Product = require('../models/productModel');

// @desc    Create a new sale
// @route   POST /api/sales
// @access  Private
const createSale = asyncHandler(async (req, res) => {
  const { 
    customer, 
    items, 
    subtotal, 
    discount, 
    tax, 
    totalAmount, 
    paymentStatus, 
    paymentMethod, 
    amountPaid, 
    notes 
  } = req.body;

  // Validate required fields
  if (!customer || !items || items.length === 0 || !totalAmount) {
    res.status(400);
    throw new Error('Please provide customer, items, and total amount');
  }

  // Generate sale number
  const saleNumber = `SALE-${Date.now()}`;

  // Calculate balance
  const balance = totalAmount - amountPaid;

  // Create sale
  const sale = await Sale.create({
    saleNumber,
    customer,
    items,
    subtotal,
    discount,
    tax,
    totalAmount,
    paymentStatus,
    paymentMethod,
    amountPaid,
    balance,
    notes,
    salesman: req.user._id,
    createdBy: req.user._id,
  });

  if (sale) {
    // Update inventory for each item
    for (const item of items) {
      // Create inventory transaction for sale
      await InventoryTransaction.create({
        product: item.product,
        transactionType: 'sale',
        quantity: item.quantity,
        user: req.user._id,
        sale: sale._id,
      });

      // Update product stock
      const product = await Product.findById(item.product);
      const updatedStock = product.currentStock - item.quantity;
      
      if (updatedStock < 0) {
        res.status(400);
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      
      await Product.findByIdAndUpdate(item.product, { 
        currentStock: updatedStock 
      });
    }

    res.status(201).json(sale);
  } else {
    res.status(400);
    throw new Error('Invalid sale data');
  }
});

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = asyncHandler(async (req, res) => {
  // Query parameters
  const { startDate, endDate, salesman, customer, limit, page } = req.query;

  // Build query
  const query = {};

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

  // Filter by salesman
  if (salesman) {
    query.salesman = salesman;
  } else if (req.user.role === 'salesman') {
    // If user is a salesman, only show their sales
    query.salesman = req.user._id;
  }

  // Filter by customer
  if (customer) {
    query['customer.name'] = { $regex: customer, $options: 'i' };
  }

  // Set default pagination values
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * pageSize;

  // Execute query
  const sales = await Sale.find(query)
    .populate('salesman', 'name')
    .sort({ date: -1 })
    .skip(skip)
    .limit(pageSize);

  // Get total count
  const count = await Sale.countDocuments(query);

  res.status(200).json({
    sales,
    page: pageNumber,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get sale by ID
// @route   GET /api/sales/:id
// @access  Private
const getSaleById = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id)
    .populate('salesman', 'name')
    .populate('createdBy', 'name');

  if (sale) {
    // If user is a salesman, they can only view their own sales
    if (req.user.role === 'salesman' && sale.salesman._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this sale');
    }
    
    res.status(200).json(sale);
  } else {
    res.status(404);
    throw new Error('Sale not found');
  }
});

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private/Admin
const updateSale = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id);

  if (!sale) {
    res.status(404);
    throw new Error('Sale not found');
  }

  // Cannot update certain fields
  if (req.body.items || req.body.saleNumber) {
    res.status(400);
    throw new Error('Cannot update items or sale number');
  }

  // Update payment information
  if (req.body.amountPaid !== undefined) {
    req.body.balance = sale.totalAmount - req.body.amountPaid;
    
    // Update payment status based on balance
    if (req.body.balance <= 0) {
      req.body.paymentStatus = 'paid';
    } else if (req.body.amountPaid > 0) {
      req.body.paymentStatus = 'partial';
    } else {
      req.body.paymentStatus = 'pending';
    }
  }

  const updatedSale = await Sale.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedSale);
});

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private/Admin
const deleteSale = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id);

  if (!sale) {
    res.status(404);
    throw new Error('Sale not found');
  }

  // Delete related inventory transactions
  await InventoryTransaction.deleteMany({ sale: sale._id });

  // Restore product stock
  for (const item of sale.items) {
    const product = await Product.findById(item.product);
    await Product.findByIdAndUpdate(item.product, { 
      currentStock: product.currentStock + item.quantity 
    });
  }

  await sale.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc    Get daily sales report
// @route   GET /api/sales/report/daily
// @access  Private
const getDailySalesReport = asyncHandler(async (req, res) => {
  const { date } = req.query;
  
  // Default to today if no date provided
  const reportDate = date ? new Date(date) : new Date();
  
  // Set start and end of the day
  const startOfDay = new Date(reportDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(reportDate.setHours(23, 59, 59, 999));
  
  // Build query
  const query = {
    date: { $gte: startOfDay, $lte: endOfDay },
  };
  
  // If user is a salesman, only show their sales
  if (req.user.role === 'salesman') {
    query.salesman = req.user._id;
  }
  
  // Get sales for the day
  const sales = await Sale.find(query)
    .populate('salesman', 'name')
    .sort({ date: 1 });
  
  // Calculate totals
  const totalSales = sales.length;
  const totalAmount = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalPaid = sales.reduce((acc, sale) => acc + sale.amountPaid, 0);
  const totalBalance = sales.reduce((acc, sale) => acc + sale.balance, 0);
  
  res.status(200).json({
    date: startOfDay,
    count: totalSales,
    totalAmount,
    totalPaid,
    totalBalance,
    sales,
  });
});

// @desc    Get monthly sales report
// @route   GET /api/sales/report/monthly
// @access  Private
const getMonthlySalesReport = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  
  // Default to current month and year if not provided
  const reportMonth = month ? parseInt(month) - 1 : new Date().getMonth();
  const reportYear = year ? parseInt(year) : new Date().getFullYear();
  
  // Set start and end of the month
  const startOfMonth = new Date(reportYear, reportMonth, 1);
  const endOfMonth = new Date(reportYear, reportMonth + 1, 0, 23, 59, 59, 999);
  
  // Build query
  const query = {
    date: { $gte: startOfMonth, $lte: endOfMonth },
  };
  
  // If user is a salesman, only show their sales
  if (req.user.role === 'salesman') {
    query.salesman = req.user._id;
  }
  
  // Get sales for the month
  const sales = await Sale.find(query)
    .populate('salesman', 'name')
    .sort({ date: 1 });
  
  // Group by day
  const dailySales = {};
  
  sales.forEach(sale => {
    const day = sale.date.getDate();
    
    if (!dailySales[day]) {
      dailySales[day] = {
        date: new Date(reportYear, reportMonth, day),
        count: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalBalance: 0,
      };
    }
    
    dailySales[day].count += 1;
    dailySales[day].totalAmount += sale.totalAmount;
    dailySales[day].totalPaid += sale.amountPaid;
    dailySales[day].totalBalance += sale.balance;
  });
  
  // Calculate monthly totals
  const totalSales = sales.length;
  const totalAmount = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalPaid = sales.reduce((acc, sale) => acc + sale.amountPaid, 0);
  const totalBalance = sales.reduce((acc, sale) => acc + sale.balance, 0);
  
  res.status(200).json({
    month: startOfMonth,
    count: totalSales,
    totalAmount,
    totalPaid,
    totalBalance,
    dailySales: Object.values(dailySales),
  });
});

// @desc    Get salesman sales report
// @route   GET /api/sales/report/salesman
// @access  Private
const getSalesmanSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  // Default to current month if no dates provided
  const today = new Date();
  const reportStartDate = startDate ? new Date(startDate) : new Date(today.getFullYear(), today.getMonth(), 1);
  const reportEndDate = endDate ? new Date(endDate) : new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
  
  // Build query
  const query = {
    date: { $gte: reportStartDate, $lte: reportEndDate },
  };
  
  // If user is a salesman, only show their sales
  if (req.user.role === 'salesman') {
    query.salesman = req.user._id;
  }
  
  // Get sales for the period
  const sales = await Sale.find(query)
    .populate('salesman', 'name')
    .sort({ date: 1 });
  
  // Group by salesman
  const salesmanSales = {};
  
  sales.forEach(sale => {
    const salesmanId = sale.salesman._id.toString();
    
    if (!salesmanSales[salesmanId]) {
      salesmanSales[salesmanId] = {
        salesman: {
          _id: sale.salesman._id,
          name: sale.salesman.name,
        },
        count: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalBalance: 0,
      };
    }
    
    salesmanSales[salesmanId].count += 1;
    salesmanSales[salesmanId].totalAmount += sale.totalAmount;
    salesmanSales[salesmanId].totalPaid += sale.amountPaid;
    salesmanSales[salesmanId].totalBalance += sale.balance;
  });
  
  res.status(200).json({
    startDate: reportStartDate,
    endDate: reportEndDate,
    salesmen: Object.values(salesmanSales),
  });
});

module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  getDailySalesReport,
  getMonthlySalesReport,
  getSalesmanSalesReport,
}; 