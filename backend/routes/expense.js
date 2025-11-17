const express = require('express');
const Expense = require('../models/expense');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// ---------------------------
// Create Expense (POST)
// ---------------------------
router.post('/', verifyToken, async (req, res) => {
  try {
    // Required fields: description, amount, categoryId, date (optional)
    const { description, amount, categoryId, date } = req.body;
    const expense = new Expense({
      description,
      amount,
      categoryId,
      userId: req.user.userId,
      date: date || Date.now()
    });
    await expense.save();
    res.status(201).json({ message: 'Expense created', expense });
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense', error: error.message });
  }
});

// ---------------------------
// Get All Expenses (GET)
// ---------------------------
router.get('/', verifyToken, async (req, res) => {
  try {
    // Optional filter for category or date range (add as needed)
    const expenses = await Expense.find({ userId: req.user.userId }).populate('categoryId');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
});

// ---------------------------
// Update Expense (PUT)
// ---------------------------
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, date, categoryId } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { description, amount, date, categoryId },
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense updated', expense });
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error: error.message });
  }
});

// ---------------------------
// Delete Expense (DELETE)
// ---------------------------
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
});

module.exports = router;
