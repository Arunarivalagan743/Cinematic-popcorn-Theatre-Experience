// export const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  
//     console.log('Received token:', token); // Log token for debugging
  
//     if (!token) {
//       return res.status(401).json({ message: 'Access token is missing' });
//     }
  
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//       if (err) {
//         console.error('JWT verification failed:', err); // Log the error for debugging
//         return res.status(403).json({ message: 'Invalid token' });
//       }
//       req.user = user; // Attach user to the request object
//       next(); // Proceed to the next middleware or route handler
//     });
//   };
