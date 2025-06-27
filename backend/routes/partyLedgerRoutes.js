const express = require('express')
const router = express.Router()
const {
  createPartyLedger,
  getPartyLedgers,
  getPartyLedgerById,
  updatePartyLedger,
  addTransaction,
  deletePartyLedger,
} = require('../controllers/partyLedgerController')

router.route('/')
  .post(createPartyLedger)
  .get(getPartyLedgers)

router.route('/:id')
  .get(getPartyLedgerById)
  .put(updatePartyLedger)
  .delete(deletePartyLedger)

router.route('/:id/transaction')
  .post(addTransaction)

module.exports = router 