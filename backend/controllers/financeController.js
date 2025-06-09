const asyncHandler = require('express-async-handler');
const FinanceTransaction = require('../models/financeModel');
const Sale = require('../models/saleModel');

// @desc    Create a new finance transaction
// @route   POST /api/finance
// @access  Private/Admin
const createFinanceTransaction = asyncHandler(async (req, res) => {
  const { 
    transactionType, 
    amount, 
    date, 
    description, 
    category, 
    paymentMethod, 
    sale, 
    user,
    notes 
  } = req.body;

  // Validate required fields
  if (!transactionType || !amount || !description || !category) {
    res.status(400);
    throw new Error('Please provide transaction type, amount, description, and category');
  }

  // Get last transaction to calculate balances
  const lastTransaction = await FinanceTransaction.findOne()
    .sort({ date: -1, createdAt: -1 });
  
  const openingBalance = lastTransaction ? lastTransaction.closingBalance : 0;
  
  // Calculate closing balance based on transaction type
  let closingBalance = openingBalance;
  
  if (
    transactionType === 'income' || 
    transactionType === 'recovery'
  ) {
    closingBalance = openingBalance + amount;
  } else if (
    transactionType === 'expense' || 
    transactionType === 'credit' || 
    transactionType === 'petrol' || 
    transactionType === 'motorcycle' || 
    transactionType === 'cash_short' ||
    transactionType === 'reward' ||
    transactionType === 'scheme'
  ) {
    closingBalance = openingBalance - amount;
  }

  // Create finance transaction
  const transaction = await FinanceTransaction.create({
    transactionType,
    amount,
    date: date || Date.now(),
    description,
    category,
    paymentMethod,
    sale,
    user,
    notes,
    openingBalance,
    closingBalance,
    createdBy: req.user._id,
  });

  if (transaction) {
    res.status(201).json(transaction);
  } else {
    res.status(400);
    throw new Error('Invalid transaction data');
  }
});

// @desc    Get all finance transactions
// @route   GET /api/finance
// @access  Private
const getFinanceTransactions = asyncHandler(async (req, res) => {
  // Query parameters
  const { transactionType, category, startDate, endDate, limit, page } = req.query;

  // Build query
  const query = {};

  // Filter by transaction type
  if (transactionType) {
    query.transactionType = transactionType;
  }

  // Filter by category
  if (category) {
    query.category = category;
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
  const transactions = await FinanceTransaction.find(query)
    .populate('sale', 'saleNumber')
    .populate('user', 'name')
    .populate('createdBy', 'name')
    .sort({ date: -1 })
    .skip(skip)
    .limit(pageSize);

  // Get total count
  const count = await FinanceTransaction.countDocuments(query);

  res.status(200).json({
    transactions,
    page: pageNumber,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get finance transaction by ID
// @route   GET /api/finance/:id
// @access  Private
const getFinanceTransactionById = asyncHandler(async (req, res) => {
  const transaction = await FinanceTransaction.findById(req.params.id)
    .populate('sale', 'saleNumber')
    .populate('user', 'name')
    .populate('createdBy', 'name');

  if (transaction) {
    res.status(200).json(transaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

// @desc    Update finance transaction
// @route   PUT /api/finance/:id
// @access  Private/Admin
const updateFinanceTransaction = asyncHandler(async (req, res) => {
  const transaction = await FinanceTransaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Cannot update certain fields
  if (
    req.body.openingBalance !== undefined || 
    req.body.closingBalance !== undefined
  ) {
    res.status(400);
    throw new Error('Cannot update balance fields directly');
  }

  // If updating amount or transaction type, recalculate closing balance
  if (
    req.body.amount !== undefined && req.body.amount !== transaction.amount || 
    req.body.transactionType !== undefined && req.body.transactionType !== transaction.transactionType
  ) {
    // Get all transactions after this one
    const subsequentTransactions = await FinanceTransaction.find({
      date: { $gte: transaction.date },
      _id: { $ne: transaction._id },
    }).sort({ date: 1, createdAt: 1 });
    
    // Calculate new closing balance
    let newClosingBalance = transaction.openingBalance;
    const transactionType = req.body.transactionType || transaction.transactionType;
    const amount = req.body.amount || transaction.amount;
    
    if (
      transactionType === 'income' || 
      transactionType === 'recovery'
    ) {
      newClosingBalance += amount;
    } else if (
      transactionType === 'expense' || 
      transactionType === 'credit' || 
      transactionType === 'petrol' || 
      transactionType === 'motorcycle' || 
      transactionType === 'cash_short' ||
      transactionType === 'reward' ||
      transactionType === 'scheme'
    ) {
      newClosingBalance -= amount;
    }
    
    req.body.closingBalance = newClosingBalance;
    
    // Update subsequent transactions
    if (subsequentTransactions.length > 0) {
      let prevClosingBalance = newClosingBalance;
      
      for (const subTx of subsequentTransactions) {
        const openingBalance = prevClosingBalance;
        let closingBalance = openingBalance;
        
        if (
          subTx.transactionType === 'income' || 
          subTx.transactionType === 'recovery'
        ) {
          closingBalance = openingBalance + subTx.amount;
        } else if (
          subTx.transactionType === 'expense' || 
          subTx.transactionType === 'credit' || 
          subTx.transactionType === 'petrol' || 
          subTx.transactionType === 'motorcycle' || 
          subTx.transactionType === 'cash_short' ||
          subTx.transactionType === 'reward' ||
          subTx.transactionType === 'scheme'
        ) {
          closingBalance = openingBalance - subTx.amount;
        }
        
        await FinanceTransaction.findByIdAndUpdate(subTx._id, {
          openingBalance,
          closingBalance,
        });
        
        prevClosingBalance = closingBalance;
      }
    }
  }

  const updatedTransaction = await FinanceTransaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedTransaction);
});

// @desc    Delete finance transaction
// @route   DELETE /api/finance/:id
// @access  Private/Admin
const deleteFinanceTransaction = asyncHandler(async (req, res) => {
  const transaction = await FinanceTransaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Get all transactions after this one
  const subsequentTransactions = await FinanceTransaction.find({
    date: { $gte: transaction.date },
    _id: { $ne: transaction._id },
  }).sort({ date: 1, createdAt: 1 });
  
  // Update subsequent transactions
  if (subsequentTransactions.length > 0) {
    let prevClosingBalance = transaction.openingBalance;
    
    for (const subTx of subsequentTransactions) {
      const openingBalance = prevClosingBalance;
      let closingBalance = openingBalance;
      
      if (
        subTx.transactionType === 'income' || 
        subTx.transactionType === 'recovery'
      ) {
        closingBalance = openingBalance + subTx.amount;
      } else if (
        subTx.transactionType === 'expense' || 
        subTx.transactionType === 'credit' || 
        subTx.transactionType === 'petrol' || 
        subTx.transactionType === 'motorcycle' || 
        subTx.transactionType === 'cash_short' ||
        subTx.transactionType === 'reward' ||
        subTx.transactionType === 'scheme'
      ) {
        closingBalance = openingBalance - subTx.amount;
      }
      
      await FinanceTransaction.findByIdAndUpdate(subTx._id, {
        openingBalance,
        closingBalance,
      });
      
      prevClosingBalance = closingBalance;
    }
  }

  await transaction.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc    Get daily finance report
// @route   GET /api/finance/report/daily
// @access  Private
const getDailyFinanceReport = asyncHandler(async (req, res) => {
  const { date } = req.query;
  
  // Default to today if no date provided
  const reportDate = date ? new Date(date) : new Date();
  
  // Set start and end of the day
  const startOfDay = new Date(reportDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(reportDate.setHours(23, 59, 59, 999));
  
  // Get transactions for the day
  const transactions = await FinanceTransaction.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  }).populate('user', 'name')
    .sort({ date: 1 });
  
  // Group by transaction type
  const report = {
    income: 0,
    expense: 0,
    recovery: 0,
    credit: 0,
    petrol: 0,
    motorcycle: 0,
    cash_short: 0,
    reward: 0,
    scheme: 0,
  };
  
  transactions.forEach(transaction => {
    report[transaction.transactionType] += transaction.amount;
  });
  
  // Calculate net cash flow
  const cashInflow = report.income + report.recovery;
  const cashOutflow = report.expense + report.credit + report.petrol + 
    report.motorcycle + report.cash_short + report.reward + report.scheme;
  const netCashFlow = cashInflow - cashOutflow;
  
  // Get opening and closing balance
  const openingBalance = transactions.length > 0 ? 
    transactions[0].openingBalance : 0;
  const closingBalance = transactions.length > 0 ? 
    transactions[transactions.length - 1].closingBalance : openingBalance;
  
  res.status(200).json({
    date: startOfDay,
    report,
    cashInflow,
    cashOutflow,
    netCashFlow,
    openingBalance,
    closingBalance,
    transactions,
  });
});

// @desc    Get monthly finance report
// @route   GET /api/finance/report/monthly
// @access  Private
const getMonthlyFinanceReport = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  
  // Default to current month and year if not provided
  const reportMonth = month ? parseInt(month) - 1 : new Date().getMonth();
  const reportYear = year ? parseInt(year) : new Date().getFullYear();
  
  // Set start and end of the month
  const startOfMonth = new Date(reportYear, reportMonth, 1);
  const endOfMonth = new Date(reportYear, reportMonth + 1, 0, 23, 59, 59, 999);
  
  // Get transactions for the month
  const transactions = await FinanceTransaction.find({
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).populate('user', 'name')
    .sort({ date: 1 });
  
  // Group by day and transaction type
  const dailyReport = {};
  
  transactions.forEach(transaction => {
    const day = transaction.date.getDate();
    
    if (!dailyReport[day]) {
      dailyReport[day] = {
        date: new Date(reportYear, reportMonth, day),
        income: 0,
        expense: 0,
        recovery: 0,
        credit: 0,
        petrol: 0,
        motorcycle: 0,
        cash_short: 0,
        reward: 0,
        scheme: 0,
      };
    }
    
    dailyReport[day][transaction.transactionType] += transaction.amount;
  });
  
  // Calculate monthly totals
  const monthlyTotals = {
    income: 0,
    expense: 0,
    recovery: 0,
    credit: 0,
    petrol: 0,
    motorcycle: 0,
    cash_short: 0,
    reward: 0,
    scheme: 0,
  };
  
  Object.values(dailyReport).forEach(day => {
    Object.keys(monthlyTotals).forEach(key => {
      monthlyTotals[key] += day[key];
    });
  });
  
  // Calculate net cash flow
  const cashInflow = monthlyTotals.income + monthlyTotals.recovery;
  const cashOutflow = monthlyTotals.expense + monthlyTotals.credit + 
    monthlyTotals.petrol + monthlyTotals.motorcycle + 
    monthlyTotals.cash_short + monthlyTotals.reward + monthlyTotals.scheme;
  const netCashFlow = cashInflow - cashOutflow;
  
  // Get opening and closing balance
  const openingBalance = transactions.length > 0 ? 
    transactions[0].openingBalance : 0;
  const closingBalance = transactions.length > 0 ? 
    transactions[transactions.length - 1].closingBalance : openingBalance;
  
  res.status(200).json({
    month: startOfMonth,
    dailyReport: Object.values(dailyReport),
    monthlyTotals,
    cashInflow,
    cashOutflow,
    netCashFlow,
    openingBalance,
    closingBalance,
  });
});

// @desc    Get salesman finance report
// @route   GET /api/finance/report/salesman
// @access  Private
const getSalesmanFinanceReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, salesmanId } = req.query;
  
  // Default to current month if no dates provided
  const today = new Date();
  const reportStartDate = startDate ? new Date(startDate) : new Date(today.getFullYear(), today.getMonth(), 1);
  const reportEndDate = endDate ? new Date(endDate) : new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
  
  // Build query
  const query = {
    date: { $gte: reportStartDate, $lte: reportEndDate },
    user: salesmanId,
  };
  
  // Get transactions for the salesman
  const transactions = await FinanceTransaction.find(query)
    .populate('user', 'name')
    .sort({ date: 1 });
  
  // Group by transaction type
  const report = {
    income: 0,
    expense: 0,
    recovery: 0,
    credit: 0,
    petrol: 0,
    motorcycle: 0,
    cash_short: 0,
    reward: 0,
    scheme: 0,
  };
  
  transactions.forEach(transaction => {
    report[transaction.transactionType] += transaction.amount;
  });
  
  // Calculate net balance
  const credits = report.credit;
  const debits = report.petrol + report.motorcycle + report.cash_short;
  const rewards = report.reward + report.scheme;
  const netBalance = credits - debits + rewards;
  
  res.status(200).json({
    startDate: reportStartDate,
    endDate: reportEndDate,
    report,
    credits,
    debits,
    rewards,
    netBalance,
    transactions,
  });
});

// @desc    Get cash flow report
// @route   GET /api/finance/report/cashflow
// @access  Private/Admin
const getCashFlow = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  // Default to current month if no dates provided
  const today = new Date();
  const reportStartDate = startDate ? new Date(startDate) : new Date(today.getFullYear(), today.getMonth(), 1);
  const reportEndDate = endDate ? new Date(endDate) : new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
  
  // Get transactions for the period
  const transactions = await FinanceTransaction.find({
    date: { $gte: reportStartDate, $lte: reportEndDate },
  }).sort({ date: 1 });
  
  // Group by transaction type
  const cashflow = {
    income: 0,
    expense: 0,
    recovery: 0,
    credit: 0,
    petrol: 0,
    motorcycle: 0,
    cash_short: 0,
    reward: 0,
    scheme: 0,
  };
  
  transactions.forEach(transaction => {
    cashflow[transaction.transactionType] += transaction.amount;
  });
  
  // Calculate totals
  const inflow = cashflow.income + cashflow.recovery;
  const outflow = cashflow.expense + cashflow.credit + cashflow.petrol + 
    cashflow.motorcycle + cashflow.cash_short + cashflow.reward + cashflow.scheme;
  const net = inflow - outflow;
  
  // Get current balance
  const latestTransaction = await FinanceTransaction.findOne()
    .sort({ date: -1, createdAt: -1 });
  
  const balance = latestTransaction ? latestTransaction.closingBalance : 0;
  
  res.status(200).json({
    startDate: reportStartDate,
    endDate: reportEndDate,
    cashflow,
    inflow,
    outflow,
    net,
    balance,
  });
});

// @desc    Get profit report
// @route   GET /api/finance/report/profit
// @access  Private/Admin
const getProfitReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  // Default to current month if no dates provided
  const today = new Date();
  const reportStartDate = startDate ? new Date(startDate) : new Date(today.getFullYear(), today.getMonth(), 1);
  const reportEndDate = endDate ? new Date(endDate) : new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
  
  // Get sales for the period with product details
  const sales = await Sale.find({
    date: { $gte: reportStartDate, $lte: reportEndDate },
  }).populate({
    path: 'items.product',
    select: 'name costPrice salePrice',
  });
  
  // Calculate sales metrics
  let totalSales = 0;
  let totalCost = 0;
  let grossProfit = 0;
  
  sales.forEach(sale => {
    totalSales += sale.totalAmount;
    
    sale.items.forEach(item => {
      const itemCost = item.product.costPrice * item.quantity;
      totalCost += itemCost;
    });
  });
  
  grossProfit = totalSales - totalCost;
  
  // Get expenses for the period
  const expenses = await FinanceTransaction.find({
    date: { $gte: reportStartDate, $lte: reportEndDate },
    transactionType: { $in: ['expense', 'petrol', 'motorcycle', 'cash_short'] },
  });
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate net profit
  const netProfit = grossProfit - totalExpenses;
  
  // Calculate profit margin
  const grossMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
  const netMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
  
  res.status(200).json({
    startDate: reportStartDate,
    endDate: reportEndDate,
    totalSales,
    totalCost,
    grossProfit,
    grossMargin,
    totalExpenses,
    netProfit,
    netMargin,
  });
});

module.exports = {
  createFinanceTransaction,
  getFinanceTransactions,
  getFinanceTransactionById,
  updateFinanceTransaction,
  deleteFinanceTransaction,
  getDailyFinanceReport,
  getMonthlyFinanceReport,
  getSalesmanFinanceReport,
  getCashFlow,
  getProfitReport,
}; 