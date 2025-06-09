const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, authorize('owner', 'admin'), createProduct);
router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.put('/:id', protect, authorize('owner', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('owner'), deleteProduct);

module.exports = router; 