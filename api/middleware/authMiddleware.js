import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  // Check for token in Authorization header first
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  
  // If no token in header, check cookies
  if (!token) {
    token = req.cookies.access_token || req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  });
};

// Enhanced middleware to verify token and ensure user exists
export const verifyTokenAndUser = async (req, res, next) => {
  // Check for token in Authorization header first
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  
  // If no token in header, check cookies
  if (!token) {
    token = req.cookies.access_token || req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }
    
    // Add user info to request
    req.user = decoded;
    req.userData = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Default export for compatibility
export default { verifyToken, verifyTokenAndUser };
