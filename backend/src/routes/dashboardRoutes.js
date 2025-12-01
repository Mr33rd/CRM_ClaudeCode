const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getInstructorDashboard,
  getAdminDashboard,
  getStudentDashboard
} = require('../controllers/dashboardController');

router.get('/instructor', authenticate, authorize('instructor'), getInstructorDashboard);

router.get('/admin', authenticate, authorize('admin'), getAdminDashboard);

router.get('/student', authenticate, authorize('student'), getStudentDashboard);

module.exports = router;
