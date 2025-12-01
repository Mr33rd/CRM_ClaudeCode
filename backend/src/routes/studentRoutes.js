const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAllStudents,
  getStudentById,
  updateStudent,
  getStudentProgress,
  getStudentAttendance
} = require('../controllers/studentController');

router.get('/', authenticate, authorize('admin', 'instructor', 'staff'), getAllStudents);

router.get('/:id', authenticate, getStudentById);

router.put('/:id', authenticate, authorize('admin', 'instructor', 'staff'), updateStudent);

router.get('/:id/progress', authenticate, getStudentProgress);

router.get('/:id/attendance', authenticate, getStudentAttendance);

module.exports = router;
