const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: Number,
  date: Date,
  category: String,
  description: String,
});

module.exports = mongoose.model('Expense', ExpenseSchema);
