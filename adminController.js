const db = require('../config/db');

// Admin dashboard summary stats
exports.getDashboardStats = async (req, res) => {
    try {
        const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) AS totalUsers FROM users WHERE role = "customer"');
        const [[{ totalOffers }]] = await db.query('SELECT COUNT(*) AS totalOffers FROM offers');
        const [[{ activeOffers }]] = await db.query('SELECT COUNT(*) AS activeOffers FROM offers WHERE status = "active"');
        const [[{ totalDiscounts }]] = await db.query('SELECT COUNT(*) AS totalDiscounts FROM discounts');
        const [[{ totalFeedback }]] = await db.query('SELECT COUNT(*) AS totalFeedback FROM feedback');
        const [[{ avgRating }]] = await db.query('SELECT ROUND(AVG(rating), 1) AS avgRating FROM feedback');
        const [[{ totalPointsIssued }]] = await db.query(
            'SELECT IFNULL(SUM(points),0) AS totalPointsIssued FROM reward_transactions WHERE type = "earned"'
        );

        res.json({
            success: true,
            stats: { totalUsers, totalOffers, activeOffers, totalDiscounts, totalFeedback, avgRating: avgRating || 0, totalPointsIssued }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Get all customers (admin view)
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, name, email, role, reward_points, created_at FROM users WHERE role = "customer" ORDER BY created_at DESC'
        );
        res.json({ success: true, users: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};
