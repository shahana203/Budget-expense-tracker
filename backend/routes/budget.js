const express = require("express");
const Budget = require("../models/budget");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

// Save or update (upsert) MULTIPLE budgets for user/month
router.post("/", verifyToken, async (req, res) => {
  try {
    const budgets = Array.isArray(req.body) ? req.body : [req.body];
    for (const entry of budgets) {
      if (!entry.categoryId || typeof entry.limit !== "number" || !entry.month) continue;
      await Budget.findOneAndUpdate(
        { categoryId: entry.categoryId, userId: req.user.userId, month: entry.month },
        { $set: { amount: entry.limit, month: entry.month } },
        { upsert: true }
      );
    }
    res.status(200).json({ message: "Budgets saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving budgets", error: error.message });
  }
});

// GET budgets for a month for the user
router.get("/", verifyToken, async (req, res) => {
  try {
    const month = req.query.month;
    const match = { userId: req.user.userId };
    if (month) match.month = month;
    const budgets = await Budget.find(match);
    res.json(budgets.map(b => ({
      _id: b._id,
      categoryId: b.categoryId.toString(),
      limit: b.amount,
      month: b.month
    })));
  } catch (error) {
    res.status(500).json({ message: "Error fetching budgets", error: error.message });
  }
});

// UPDATE a single budget by _id
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { limit } = req.body;
    await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { amount: limit } }
    );
    res.json({ message: "Budget updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating budget", error: error.message });
  }
});

// DELETE a single budget by _id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    res.json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting budget", error: error.message });
  }
});

module.exports = router;
