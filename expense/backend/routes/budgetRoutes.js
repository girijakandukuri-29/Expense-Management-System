const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { getBudget, setBudget, getReport, getDashboardSummary } = require('../controllers/budgetController');

// Support both authenticated and query param based access (for frontend compatibility)
router.get('/', getBudget);
router.post('/', setBudget);
router.get('/report', getReport);

module.exports = router;
