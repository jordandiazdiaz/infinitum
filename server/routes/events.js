const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  calculateProfitability,
  addPayment,
  addTask,
  updateTask
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

router.post('/:id/calculate-profitability', calculateProfitability);
router.post('/:id/payments', addPayment);
router.post('/:id/tasks', addTask);
router.put('/:id/tasks/:taskId', updateTask);

module.exports = router;
