const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getUpcomingSessions
} = require('../controllers/sessionController');

router.post('/', authenticate, authorize('admin', 'instructor'), createSession);

router.get('/', authenticate, getAllSessions);

router.get('/upcoming', authenticate, getUpcomingSessions);

router.get('/:id', authenticate, getSessionById);

router.put('/:id', authenticate, authorize('admin', 'instructor'), updateSession);

router.delete('/:id', authenticate, authorize('admin', 'instructor'), deleteSession);

module.exports = router;
