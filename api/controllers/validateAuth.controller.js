import { verifyToken } from '../utils/verifyUser.js';

export const validateAuth = (req, res) => {
  // This endpoint will use verifyToken middleware
  // If the token is valid, it will return user info
  // If invalid, middleware will handle the error
  res.json({ 
    valid: true, 
    user: req.user,
    message: 'Token is valid' 
  });
};
