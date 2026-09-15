const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/dashboard', verifyToken, verifyAdmin, adminController.getDashboardStats);
router.get('/users', verifyToken, verifyAdmin, adminController.getAllUsers);

module.exports = router;
