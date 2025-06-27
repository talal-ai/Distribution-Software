const asyncHandler = require('express-async-handler')
const Attendance = require('../models/attendanceModel')
const User = require('../models/userModel')

// @desc    Get monthly attendance for all employees
// @route   GET /api/attendance
// @access  Private/Admin
const getMonthlyAttendance = asyncHandler(async (req, res) => {
  const { month, year } = req.query
  
  const attendance = await Attendance.find({
    month: parseInt(month),
    year: parseInt(year)
  }).populate('employeeId', 'name position')
  
  res.json(attendance)
})

// @desc    Create or update attendance record
// @route   POST /api/attendance
// @access  Private/Admin
const updateAttendance = asyncHandler(async (req, res) => {
  const { employeeId, month, year, date, status } = req.body

  const employee = await User.findById(employeeId)
  if (!employee) {
    res.status(404)
    throw new Error('Employee not found')
  }

  let attendance = await Attendance.findOne({
    employeeId,
    month,
    year
  })

  if (!attendance) {
    // Create new attendance record for the month
    attendance = new Attendance({
      employeeId,
      employeeName: employee.name,
      position: employee.position,
      month,
      year,
      dailyAttendance: []
    })
  }

  // Update or add daily attendance
  const dayIndex = attendance.dailyAttendance.findIndex(day => day.date === date)
  if (dayIndex > -1) {
    attendance.dailyAttendance[dayIndex].status = status
  } else {
    attendance.dailyAttendance.push({ date, status })
  }

  // Update totals
  attendance.totals = attendance.dailyAttendance.reduce((acc, day) => {
    switch(day.status) {
      case 'A': acc.attended++; break
      case 'S': acc.sickLeave++; break
      case 'P': acc.personalLeave++; break
      case 'V': acc.vacation++; break
      case 'N': acc.noShow++; break
      case 'H': acc.holidays++; break
    }
    return acc
  }, {
    attended: 0,
    sickLeave: 0,
    personalLeave: 0,
    vacation: 0,
    noShow: 0,
    holidays: 0
  })

  const updatedAttendance = await attendance.save()
  res.json(updatedAttendance)
})

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats
// @access  Private/Admin
const getAttendanceStats = asyncHandler(async (req, res) => {
  const { month, year } = req.query
  
  const stats = await Attendance.aggregate([
    {
      $match: {
        month: parseInt(month),
        year: parseInt(year)
      }
    },
    {
      $group: {
        _id: null,
        totalPresent: { $sum: '$totals.attended' },
        totalSickLeave: { $sum: '$totals.sickLeave' },
        totalPersonalLeave: { $sum: '$totals.personalLeave' },
        totalVacation: { $sum: '$totals.vacation' },
        totalNoShow: { $sum: '$totals.noShow' },
        totalHolidays: { $sum: '$totals.holidays' }
      }
    }
  ])

  res.json(stats[0] || {})
})

module.exports = {
  getMonthlyAttendance,
  updateAttendance,
  getAttendanceStats,
} 