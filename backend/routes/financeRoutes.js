const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, authorize('owner', 'admin'), createFinanceTransaction);
router.get('/', protect, getFinanceTransactions);
router.get('/report/daily', protect, getDailyFinanceReport);
router.get('/report/monthly', protect, getMonthlyFinanceReport);
router.get('/report/salesman', protect, getSalesmanFinanceReport);
router.get('/report/cashflow', protect, authorize('owner', 'admin'), getCashFlow);
router.get('/report/profit', protect, authorize('owner', 'admin'), getProfitReport);
router.get('/:id', protect, getFinanceTransactionById);
router.put('/:id', protect, authorize('owner', 'admin'), updateFinanceTransaction);
router.delete('/:id', protect, authorize('owner'), deleteFinanceTransaction);

module.exports = router; 