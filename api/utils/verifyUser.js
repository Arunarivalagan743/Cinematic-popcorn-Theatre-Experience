import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token || req.cookies.token;

    if (!token) return next(errorHandler(401, 'You are not authenticated!'));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('JWT verification error:', err.message);
            // Clear invalid token
            res.clearCookie('access_token');
            res.clearCookie('token');
            return next(errorHandler(401, 'Session expired. Please sign in again.'));
        }

        req.user = user;
        next();
    });
}