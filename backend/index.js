const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const budgetRoutes = require('./routes/budget');
const expenseRoutes = require('./routes/expense');
const reportRoutes = require('./routes/report');


const app = express(); // Make Express app



app.use(express.json());
app.use(cors({
  origin: ["https://budget-expense-tracker-ten.vercel.app/auth"] ,// Your frontend URL
  credentials: true                // Allow cookies/auth
}));

// Simple test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// (We will add MongoDB connection in next step)


mongoose.connect('mongodb+srv://shahana2003j_db_user:jWHnOnxMwDzuf8iu@cluster0.0xwdyed.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.log("MongoDB connection error:", err);
});

// Use auth routes
app.use('/api/auth', authRoutes); // All auth routes start with /api/auth

// Use catogories routes
app.use('/api/categories', categoryRoutes);

// Use budgets routes
app.use('/api/budgets', budgetRoutes);

// Use expenses routes
app.use('/api/expenses', expenseRoutes);

// Use reports routes
app.use('/api/reports', reportRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Budget Expense Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
