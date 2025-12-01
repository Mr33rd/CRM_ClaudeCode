const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  recordAttendance,
  updateAttendance,
  getSessionAttendance,
  bulkRecordAttendance
} = require('../controllers/attendanceController');

router.post('/', authenticate, authorize('admin', 'instructor', 'staff'), recordAttendance);

router.post('/bulk', authenticate, authorize('admin', 'instructor', 'staff'), bulkRecordAttendance);

router.put('/:id', authenticate, authorize('admin', 'instructor', 'staff'), updateAttendance);

router.get('/session/:sessionId', authenticate, getSessionAttendance);

module.exports = router;
