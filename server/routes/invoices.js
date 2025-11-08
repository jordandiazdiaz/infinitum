const express = require('express');
const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  generatePDF,
  sendInvoice,
  addPayment,
  getAccountsReceivable
} = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/accounts-receivable', getAccountsReceivable);

router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.route('/:id')
  .get(getInvoice)
  .put(updateInvoice)
  .delete(deleteInvoice);

router.post('/:id/generate-pdf', generatePDF);
router.post('/:id/send', sendInvoice);
router.post('/:id/payments', addPayment);

module.exports = router;
