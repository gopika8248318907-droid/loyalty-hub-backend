const db = require('../config/db');

// Get logged-in user's reward points + history
exports.getMyRewards = async (req, res) => {
    try {
        const [userRows] = await db.query('SELECT reward_points FROM users WHERE id = ?', [req.user.id]);
        const [history] = await db.query(
            'SELECT * FROM reward_transactions WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json({ success: true, reward_points: userRows[0].reward_points, history });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Add points to a user (e.g. after a purchase) - admin action
exports.addPoints = async (req, res) => {
    try {
        const { user_id, points, reason } = req.body;
        if (!user_id || !points) {
            return res.status(400).json({ success: false, message: 'user_id and points are required.' });
        }

        await db.query('UPDATE users SET reward_points = reward_points + ? WHERE id = ?', [points, user_id]);
        await db.query(
            'INSERT INTO reward_transactions (user_id, points, type, reason) VALUES (?, ?, ?, ?)',
            [user_id, points, 'earned', reason || 'Points added']
        );

        res.json({ success: true, message: 'Points added successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Redeem points against an offer
exports.redeemPoints = async (req, res) => {
    try {
        const { offer_id } = req.body;
        const userId = req.user.id;

        const [offerRows] = await db.query('SELECT * FROM offers WHERE id = ? AND status = "active"', [offer_id]);
        if (offerRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Offer not found or inactive.' });
        }
        const offer = offerRows[0];

        const [userRows] = await db.query('SELECT reward_points FROM users WHERE id = ?', [userId]);
        const currentPoints = userRows[0].reward_points;

        if (currentPoints < offer.points_required) {
            return res.status(400).json({ success: false, message: 'Not enough reward points.' });
        }

        await db.query('UPDATE users SET reward_points = reward_points - ? WHERE id = ?', [offer.points_required, userId]);
        await db.query(
            'INSERT INTO reward_transactions (user_id, points, type, reason) VALUES (?, ?, ?, ?)',
            [userId, offer.points_required, 'redeemed', `Redeemed for: ${offer.title}`]
        );

        res.json({ success: true, message: `Redeemed successfully for ${offer.title}!` });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};
