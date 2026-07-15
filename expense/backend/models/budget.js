const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: String, // Format: YYYY-MM
  amount: Number,
});

module.exports = mongoose.model('Budget', BudgetSchema);
