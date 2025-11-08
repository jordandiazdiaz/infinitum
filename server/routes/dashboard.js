const express = require('express');
const {
  getMetrics,
  getCharts,
  getProfitabilityAnalysis
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/metrics', getMetrics);
router.get('/charts', getCharts);
router.get('/profitability', getProfitabilityAnalysis);

module.exports = router;
