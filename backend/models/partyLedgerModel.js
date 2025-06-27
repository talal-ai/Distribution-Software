const mongoose = require('mongoose')

const partyLedgerSchema = mongoose.Schema(
  {
    partyName: {
      type: String,
      required: true,
      trim: true
    },
    currency: {
      type: String,
      default: 'PKR',
      required: true
    },
    transactions: [{
      date: {
        type: Date,
        required: true
      },
      particular: {
        type: String,
        required: true,
        trim: true
      },
      debit: {
        type: Number,
        default: 0,
        get: v => `PKR ${v.toLocaleString('en-PK')}`,
        set: v => v
      },
      credit: {
        type: Number,
        default: 0,
        get: v => `PKR ${v.toLocaleString('en-PK')}`,
        set: v => v
      },
      balance: {
        type: Number,
        required: true,
        get: v => `PKR ${v.toLocaleString('en-PK')}`,
        set: v => v
      }
    }],
    totalDebit: {
      type: Number,
      default: 0,
      get: v => `PKR ${v.toLocaleString('en-PK')}`,
      set: v => v
    },
    totalCredit: {
      type: Number,
      default: 0,
      get: v => `PKR ${v.toLocaleString('en-PK')}`,
      set: v => v
    },
    currentBalance: {
      type: Number,
      default: 0,
      get: v => `PKR ${v.toLocaleString('en-PK')}`,
      set: v => v
    },
    createdBy: {
      type: String,
      required: true,
      default: 'TALAL'
    }
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
)

// Pre-save middleware to calculate totals and current balance
partyLedgerSchema.pre('save', function(next) {
  if (this.transactions && this.transactions.length > 0) {
    this.totalDebit = this.transactions.reduce((sum, trans) => sum + (trans.debit || 0), 0)
    this.totalCredit = this.transactions.reduce((sum, trans) => sum + (trans.credit || 0), 0)
    this.currentBalance = this.totalDebit - this.totalCredit
  }
  next()
})

const PartyLedger = mongoose.model('PartyLedger', partyLedgerSchema)

module.exports = PartyLedger 