const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { getExpenses, addExpense } = require('../controllers/expenseController');

// Support both authenticated and query param based access (for frontend compatibility)
router.get('/', getExpenses);
router.post('/', addExpense);

module.exports = router;
