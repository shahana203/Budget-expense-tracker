const express = require('express');
const Expense = require('../models/expense');
const Budget = require('../models/budget');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/monthly-spending', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get start and end of current month
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    // 1. Fetch *all* this user's expenses for the month
    const expenses = await Expense.find({
      userId,
      date: { $gte: start, $lt: end }
    });

    // 2. Calculate totals by category (stringified IDs to handle both types)
    const totals = {};
    expenses.forEach(exp => {
      const catId = String(exp.categoryId);
      totals[catId] = (totals[catId] || 0) + exp.amount;
    });

    // 3. Fetch all this user's budgets
    const budgets = await Budget.find({ userId }).lean();

    // 4. Build the report: match budgets to calculated expense totals
    const report = budgets.map(budget => ({
      categoryId: String(budget.categoryId),
      budgetAmount: budget.amount,
      totalSpent: totals[String(budget.categoryId)] || 0
    }));

    res.json(report);

  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

module.exports = router;
