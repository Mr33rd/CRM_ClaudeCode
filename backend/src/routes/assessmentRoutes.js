const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createAssessment,
  getStudentAssessments,
  updateAssessment,
  getAssessmentStats
} = require('../controllers/assessmentController');

router.post('/', authenticate, authorize('admin', 'instructor'), createAssessment);

router.get('/student/:studentId', authenticate, getStudentAssessments);

router.put('/:id', authenticate, authorize('admin', 'instructor'), updateAssessment);

router.get('/student/:studentId/stats', authenticate, getAssessmentStats);

module.exports = router;
