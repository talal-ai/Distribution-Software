const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Routes
router.post('/register', protect, authorize('owner', 'admin'), registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/:id', protect, authorize('owner', 'admin'), updateUser);
router.delete('/:id', protect, authorize('owner'), deleteUser);
router.get('/', protect, authorize('owner', 'admin'), getAllUsers);
router.get('/:id', protect, authorize('owner', 'admin'), getUserById);

module.exports = router; 