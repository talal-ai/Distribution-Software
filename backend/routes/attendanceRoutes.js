const express = require('express')
const router = express.Router()
const {
  getMonthlyAttendance,
  updateAttendance,
  getAttendanceStats,
} = require('../controllers/attendanceController')
const { protect, admin } = require('../middleware/authMiddleware')

router.route('/')
  .get(protect, admin, getMonthlyAttendance)
  .post(protect, admin, updateAttendance)

router.route('/stats')
  .get(protect, admin, getAttendanceStats)

module.exports = router 