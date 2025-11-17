const mongoose = require('mongoose');

// Define the structure for expenses
const ExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,              // Date when expense happened
    default: Date.now        // Default is current date/time
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
