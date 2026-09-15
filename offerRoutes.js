const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public
router.get('/', offerController.getAllOffers);
router.get('/:id', offerController.getOfferById);

// Admin only
router.post('/', verifyToken, verifyAdmin, offerController.createOffer);
router.put('/:id', verifyToken, verifyAdmin, offerController.updateOffer);
router.delete('/:id', verifyToken, verifyAdmin, offerController.deleteOffer);

module.exports = router;
