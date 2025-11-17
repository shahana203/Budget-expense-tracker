const mongoose = require('mongoose');

// Each document represents a budget for one category and month for a user.
const BudgetSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, default: 0 },  
  month: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);

