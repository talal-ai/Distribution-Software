const mongoose = require('mongoose')

const attendanceSchema = mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    position: {
      type: String,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    dailyAttendance: [{
      date: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ['P', 'S', 'A, 'V', 'H'], // Attended, Sick Leave, Personal Leave, Vacation, No Show, Holiday
        required: true,
      }
    }],
    totals: {
      PRESENT: { type: Number, default: 0 },
      sickLeave: { type: Number, default: 0 },
      absent: { type: Number, default: 0 },
      vacation: { type: Number, default: 0 },
    
      holidays: { type: Number, default: 0 },
    }
  },
  {
    timestamps: true,
  }
)

const Attendance = mongoose.model('Attendance', attendanceSchema)

module.exports = Attendance 