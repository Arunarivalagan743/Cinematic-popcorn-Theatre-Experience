import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    // Check for token in cookies first, then in Authorization header
    let token = req.cookies.access_token || req.cookies.token;
    
    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if (!token) {
        console.log('No token found in cookies or Authorization header');
        return next(errorHandler(401, 'You are not authenticated!'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('JWT verification error:', err.message);
            // Clear invalid token cookies
            res.clearCookie('access_token');
            res.clearCookie('token');
            
            // Provide more specific error messages
            if (err.name === 'TokenExpiredError') {
                return next(errorHandler(401, 'Your session has expired. Please log in again.'));
            } else if (err.name === 'JsonWebTokenError') {
                return next(errorHandler(401, 'Invalid token. Please log in again.'));
            } else {
                return next(errorHandler(401, 'Authentication failed. Please log in again.'));
            }
        }

        req.user = user;
        next();
    });
}