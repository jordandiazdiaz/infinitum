const express = require('express');
const {
  getAuthUrl,
  handleCallback,
  syncEvent,
  getCalendarEvents,
  disconnectCalendar
} = require('../controllers/calendarController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/auth-url', getAuthUrl);
router.post('/callback', handleCallback);
router.post('/sync/:eventId', syncEvent);
router.get('/events', getCalendarEvents);
router.delete('/disconnect', disconnectCalendar);

module.exports = router;
