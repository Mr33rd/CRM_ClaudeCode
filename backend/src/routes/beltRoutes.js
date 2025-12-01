const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getBeltProgressions,
  awardBelt,
  getBeltCurriculum
} = require('../controllers/beltController');

router.get('/student/:studentId', authenticate, getBeltProgressions);

router.post('/award/:studentId', authenticate, authorize('admin', 'instructor'), awardBelt);

router.get('/curriculum/:beltLevel', authenticate, getBeltCurriculum);

module.exports = router;
