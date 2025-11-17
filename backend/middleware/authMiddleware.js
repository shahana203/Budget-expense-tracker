const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key_change_this'; // Same secret as in auth.js
// ============================================
// MIDDLEWARE: Verify JWT Token
// ============================================
const verifyToken = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    // Header format: "Bearer TOKEN_VALUE"
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
      // status 401 = Unauthorized (missing token)
    }

    // Extract token from "Bearer TOKEN"
    const token = authHeader.split(' ')[1]; 
    // split(' ') breaks "Bearer TOKEN" into ["Bearer", "TOKEN"]
    // [1] takes the TOKEN part

    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    // If valid, decoded will contain: { userId, email, iat, exp }
    // If invalid, it will throw an error (caught in catch block)

    // Attach user info to the request so routes can use it
    req.user = decoded; 
    // Now any route can access req.user.userId or req.user.email

    // Call next() to let the request continue to the route
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = verifyToken;
