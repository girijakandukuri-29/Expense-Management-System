const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./db'); // ensures mongoose connects

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const { getDashboardSummary, getReport } = require('./controllers/budgetController');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budget', budgetRoutes);

// Additional routes that frontend expects
app.get('/api/dashboard-summary', getDashboardSummary);
app.get('/api/reports/monthly', getReport);

app.listen(5000, () => console.log('Server running on port 5000'));
