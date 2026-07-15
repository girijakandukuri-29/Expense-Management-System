const Expense = require('../models/expense');

exports.getExpenses = async (req, res) => {
  try {
    // Support both query param (for frontend) and auth token
    let userId;
    if (req.query.user) {
      // Frontend sends user email, need to find user ID
      const User = require('../models/user');
      const user = await User.findOne({ email: req.query.user });
      if (!user) return res.status(404).json({ error: 'User not found' });
      userId = user._id;
    } else if (req.user && req.user.id) {
      userId = req.user.id;
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { amount, date, category, description, user: userEmail } = req.body;
    
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
    
    await Expense.create({
      user: userId,
      amount: parseFloat(amount),
      date: new Date(date),
      category,
      description
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

