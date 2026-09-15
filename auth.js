const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify token, attach user info to req.user
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided. Access denied.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
        }
        req.user = decoded; // { id, email, role }
        next();
    });
};

// Only allow admin role
const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access only.' });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };
