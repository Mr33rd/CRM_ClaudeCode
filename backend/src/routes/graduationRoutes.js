const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getGraduationStatus,
  selectFirearm,
  processGraduation,
  updateFirearmDelivery,
  getAllGraduates
} = require('../controllers/graduationController');

router.get('/student/:studentId', authenticate, getGraduationStatus);

router.post('/student/:studentId/select-firearm', authenticate, selectFirearm);

router.post('/student/:studentId/process', authenticate, authorize('admin', 'instructor'), processGraduation);

router.put('/student/:studentId/firearm-delivery', authenticate, authorize('admin', 'staff'), updateFirearmDelivery);

router.get('/graduates', authenticate, authorize('admin', 'instructor', 'staff'), getAllGraduates);

module.exports = router;
