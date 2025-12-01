const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getStudentPayments,
  recordPayment,
  updatePaymentStatus,
  getAllPayments,
  getOverduePayments
} = require('../controllers/paymentController');

router.get('/student/:studentId', authenticate, getStudentPayments);

router.put('/:id/record', authenticate, authorize('admin', 'staff'), recordPayment);

router.put('/:id/status', authenticate, authorize('admin', 'staff'), updatePaymentStatus);

router.get('/', authenticate, authorize('admin', 'staff'), getAllPayments);

router.get('/overdue', authenticate, authorize('admin', 'staff'), getOverduePayments);

module.exports = router;
