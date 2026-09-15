const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public
router.get('/', discountController.getAllDiscounts);

// Admin only
router.post('/', verifyToken, verifyAdmin, discountController.createDiscount);
router.put('/:id', verifyToken, verifyAdmin, discountController.updateDiscount);
router.delete('/:id', verifyToken, verifyAdmin, discountController.deleteDiscount);

module.exports = router;
