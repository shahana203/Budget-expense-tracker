const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const verifyToken = require('../middleware/authMiddleware');


const router = express.Router(); // Create a router object for auth routes

const JWT_SECRET = 'your_secret_key_change_this';

// ============================================
// ROUTE 1: Sign Up (Create a new user account)
// ============================================
router.post('/signup', async (req, res) => {
  try {
    // Get email and password from the request body
    const { name, email, password } = req.body;

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
      // status 400 = Bad Request (user already exists)
    }

    // Hash the password (convert to unreadable form for security)
    const hashedPassword = await bcrypt.hash(password, 10);
  

    // Create a new user with hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword // Save the hashed password, NOT the original
    });

    // Save user to database
    await newUser.save();

    // Return success response
    res.status(201).json({ 
      message: 'User created successfully',
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
    

  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
    
  }
});

// ============================================
// ROUTE 2: Login (Verify user and give token)
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create a JWT token 
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,                              
      { expiresIn: '7d' }         
    );              


    // Return token to user
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// ============================================
// ROUTE 3: Get Current User (Protected Route)
// ============================================
router.get('/me', verifyToken, (req, res) => {
  // verifyToken middleware runs FIRST
  // If token is invalid, user doesn't reach this code
  // If token is valid, req.user contains the user data

  res.json({
    message: 'User info retrieved',
    user: req.user // This contains userId and email from the token
  });
});

module.exports = router;

