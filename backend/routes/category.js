const express = require("express");
const Category = require("../models/category");
const Budget = require("../models/budget");
const Expense = require("../models/expense");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Create  Category
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({
      name,
      userId: req.user.userId
    });
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
});

// Get all  Category with dashboard budgets/spent for the month
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const month = req.query.month || new Date().toISOString().slice(0, 7); // e.g. '2025-11'
    const categories = await Category.find({ userId });
    const budgets = await Budget.find({ userId, month });
    const expenses = await Expense.find({ userId });

    const enriched = categories.map(cat => {
      const budget = budgets.find(b => String(b.categoryId) === String(cat._id));
      const limit = budget ? budget.amount : 0;
      const spent = expenses
        .filter(exp => {
          const expMonth = exp.date?.toISOString().slice(0,7);
          return String(exp.categoryId) === String(cat._id) && expMonth === month;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      return {
        _id: cat._id,
        name: cat.name,
        limit,
        spent,
      };
    });

    res.json(enriched);

  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
});

// Update  Category
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name },
      { new: true }
    );
    res.json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
});

// Delete Category
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Category.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
});

module.exports = router;
