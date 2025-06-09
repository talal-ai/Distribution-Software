const express = require('express');
const router = express.Router();
const {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  getDailySalesReport,
  getMonthlySalesReport,
  getSalesmanSalesReport,
} = require('../controllers/salesController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, createSale);
router.get('/', protect, getSales);
router.get('/report/daily', protect, getDailySalesReport);
router.get('/report/monthly', protect, getMonthlySalesReport);
router.get('/report/salesman', protect, getSalesmanSalesReport);
router.get('/:id', protect, getSaleById);
router.put('/:id', protect, authorize('owner', 'admin'), updateSale);
router.delete('/:id', protect, authorize('owner'), deleteSale);

module.exports = router; 