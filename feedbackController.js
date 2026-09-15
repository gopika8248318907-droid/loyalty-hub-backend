const db = require('../config/db');

// Submit feedback (logged-in customer)
exports.submitFeedback = async (req, res) => {
    try {
        const { rating, message } = req.body;
        if (!rating) return res.status(400).json({ success: false, message: 'Rating is required.' });

        const [result] = await db.query(
            'INSERT INTO feedback (user_id, rating, message) VALUES (?, ?, ?)',
            [req.user.id, rating, message || '']
        );
        res.status(201).json({ success: true, message: 'Feedback submitted. Thank you!', feedbackId: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Public: get all feedback/reviews (e.g. to display on site)
exports.getAllFeedback = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT f.id, f.rating, f.message, f.created_at, u.name AS user_name
             FROM feedback f JOIN users u ON f.user_id = u.id
             ORDER BY f.created_at DESC`
        );
        res.json({ success: true, feedback: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Admin: delete a feedback entry
exports.deleteFeedback = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM feedback WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Feedback not found.' });
        res.json({ success: true, message: 'Feedback deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};
