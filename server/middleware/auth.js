const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Extract token from "Bearer <token>" header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.ownerId = decoded.ownerId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;