const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Customer: view own points/history
router.get('/my-points', verifyToken, rewardController.getMyRewards);

// Customer: redeem points for an offer
router.post('/redeem', verifyToken, rewardController.redeemPoints);

// Admin: add points to a user
router.post('/add', verifyToken, verifyAdmin, rewardController.addPoints);

module.exports = router;
