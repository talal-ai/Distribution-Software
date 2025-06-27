const asyncHandler = require('express-async-handler')
const PartyLedger = require('../models/partyLedgerModel')

// @desc    Create a new party ledger
// @route   POST /api/partyledger
// @access  Private
const createPartyLedger = asyncHandler(async (req, res) => {
  const { partyName, transactions } = req.body

  const partyLedger = await PartyLedger.create({
    partyName,
    transactions,
    createdBy: 'TALAL', // Default creator ID
    currency: 'PKR'
  })

  if (partyLedger) {
    res.status(201).json(partyLedger)
  } else {
    res.status(400)
    throw new Error('Invalid party ledger data')
  }
})

// @desc    Get all party ledgers
// @route   GET /api/partyledger
// @access  Private
const getPartyLedgers = asyncHandler(async (req, res) => {
  const partyLedgers = await PartyLedger.find({ createdBy: 'TALAL' })
  res.json(partyLedgers)
})

// @desc    Get party ledger by ID
// @route   GET /api/partyledger/:id
// @access  Private
const getPartyLedgerById = asyncHandler(async (req, res) => {
  const partyLedger = await PartyLedger.findById(req.params.id)

  if (partyLedger && partyLedger.createdBy === 'TALAL') {
    res.json(partyLedger)
  } else {
    res.status(404)
    throw new Error('Party ledger not found')
  }
})

// @desc    Update party ledger
// @route   PUT /api/partyledger/:id
// @access  Private
const updatePartyLedger = asyncHandler(async (req, res) => {
  const partyLedger = await PartyLedger.findById(req.params.id)

  if (partyLedger && partyLedger.createdBy === 'TALAL') {
    partyLedger.partyName = req.body.partyName || partyLedger.partyName
    partyLedger.transactions = req.body.transactions || partyLedger.transactions

    const updatedPartyLedger = await partyLedger.save()
    res.json(updatedPartyLedger)
  } else {
    res.status(404)
    throw new Error('Party ledger not found')
  }
})

// @desc    Add transaction to party ledger
// @route   POST /api/partyledger/:id/transaction
// @access  Private
const addTransaction = asyncHandler(async (req, res) => {
  const { date, particular, debit, credit } = req.body
  const partyLedger = await PartyLedger.findById(req.params.id)

  if (partyLedger && partyLedger.createdBy === 'TALAL') {
    // Calculate new balance
    const previousBalance = partyLedger.transactions.length > 0 
      ? partyLedger.transactions[partyLedger.transactions.length - 1].balance 
      : 0
    const balance = previousBalance + (debit || 0) - (credit || 0)

    const newTransaction = {
      date: new Date(date),
      particular,
      debit: debit || 0,
      credit: credit || 0,
      balance
    }

    partyLedger.transactions.push(newTransaction)
    const updatedPartyLedger = await partyLedger.save()
    res.json(updatedPartyLedger)
  } else {
    res.status(404)
    throw new Error('Party ledger not found')
  }
})

// @desc    Delete party ledger
// @route   DELETE /api/partyledger/:id
// @access  Private
const deletePartyLedger = asyncHandler(async (req, res) => {
  const partyLedger = await PartyLedger.findById(req.params.id)

  if (partyLedger && partyLedger.createdBy === 'TALAL') {
    await partyLedger.remove()
    res.json({ message: 'Party ledger removed' })
  } else {
    res.status(404)
    throw new Error('Party ledger not found')
  }
})

module.exports = {
  createPartyLedger,
  getPartyLedgers,
  getPartyLedgerById,
  updatePartyLedger,
  addTransaction,
  deletePartyLedger
} 