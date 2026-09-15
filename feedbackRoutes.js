const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public: view all reviews
router.get('/', feedbackController.getAllFeedback);

// Customer: submit feedback
router.post('/', verifyToken, feedbackController.submitFeedback);

// Admin: delete feedback
router.delete('/:id', verifyToken, verifyAdmin, feedbackController.deleteFeedback);

module.exports = router;
