const express = require('express');
const router = express.Router();
const {
  createInventoryTransaction,
  getInventoryTransactions,
  getInventoryTransactionById,
  updateInventoryTransaction,
  deleteInventoryTransaction,
  getCurrentStock,
  getDailyInventoryReport,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, authorize('owner', 'admin'), createInventoryTransaction);
router.get('/', protect, getInventoryTransactions);
router.get('/stock', protect, getCurrentStock);
router.get('/report/daily', protect, getDailyInventoryReport);
router.get('/:id', protect, getInventoryTransactionById);
router.put('/:id', protect, authorize('owner', 'admin'), updateInventoryTransaction);
router.delete('/:id', protect, authorize('owner'), deleteInventoryTransaction);

module.exports = router; 