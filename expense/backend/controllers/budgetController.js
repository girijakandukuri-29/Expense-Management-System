const Budget = require('../models/budget');
const Expense = require('../models/expense');

exports.getBudget = async (req, res) => {
  try {
    const { month, user: userEmail } = req.query;
    
    let userId;
    if (userEmail) {
      // Frontend sends user email
      const User = require('../models/user');
      const user = await User.findOne({ email: userEmail });
      if (!user) return res.status(404).json({ error: 'User not found' });
      userId = user._id;
    } else if (req.user && req.user.id) {
      userId = req.user.id;
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const budget = await Budget.findOne({ user: userId, month });
    res.json(budget || { amount: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setBudget = async (req, res) => {
  try {
    const { month, amount, user: userEmail } = req.body;
    
    let userId;
    if (userEmail) {
      // Frontend sends user email
      const User = require('../models/user');
      const user = await User.findOne({ email: userEmail });
      if (!user) return res.status(404).json({ error: 'User not found' });
      userId = user._id;
    } else if (req.user && req.user.id) {
      userId = req.user.id;
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    await Budget.findOneAndUpdate(
      { user: userId, month },
      { user: userId, month, amount: parseFloat(amount) },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const { month, user: userEmail } = req.query;
    
    let userId;
    if (userEmail) {
      // Frontend sends user email
      const User = require('../models/user');
      const user = await User.findOne({ email: userEmail });
      if (!user) return res.status(404).json({ error: 'User not found' });
      userId = user._id;
    } else if (req.user && req.user.id) {
      userId = req.user.id;
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const report = await Expense.aggregate([
      { 
        $match: { 
          user: userId,
          date: { $gte: start, $lt: end } 
        } 
      },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);
    res.json(report.map(r => ({ category: r._id, total: r.total })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const { user: userEmail } = req.query;
    
    let userId;
    if (userEmail) {
      // Frontend sends user email
      const User = require('../models/user');
      const user = await User.findOne({ email: userEmail });
      if (!user) return res.status(404).json({ error: 'User not found' });
      userId = user._id;
    } else if (req.user && req.user.id) {
      userId = req.user.id;
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get current month
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM format
    const start = new Date(`${currentMonth}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    
    // Get budget for current month
    const budget = await Budget.findOne({ user: userId, month: currentMonth });
    const budgetAmount = budget ? budget.amount : 0;
    
    // Get total expenses for current month
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: start, $lt: end }
    });
    
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    
    res.json({
      budget: budgetAmount,
      totalExpenses: totalExpenses
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

