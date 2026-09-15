const db = require('../config/db');

// Public: get all discount offers
exports.getAllDiscounts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM discounts ORDER BY created_at DESC');
        res.json({ success: true, discounts: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Admin: create discount
exports.createDiscount = async (req, res) => {
    try {
        const { title, description, discount_percent, valid_from, valid_until, status } = req.body;
        if (!title || !discount_percent) {
            return res.status(400).json({ success: false, message: 'Title and discount_percent are required.' });
        }
        const [result] = await db.query(
            'INSERT INTO discounts (title, description, discount_percent, valid_from, valid_until, status) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description || '', discount_percent, valid_from || null, valid_until || null, status || 'active']
        );
        res.status(201).json({ success: true, message: 'Discount created.', discountId: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Admin: update discount
exports.updateDiscount = async (req, res) => {
    try {
        const { title, description, discount_percent, valid_from, valid_until, status } = req.body;
        const [result] = await db.query(
            'UPDATE discounts SET title=?, description=?, discount_percent=?, valid_from=?, valid_until=?, status=? WHERE id=?',
            [title, description, discount_percent, valid_from, valid_until, status, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Discount not found.' });
        res.json({ success: true, message: 'Discount updated.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Admin: delete discount
exports.deleteDiscount = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM discounts WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Discount not found.' });
        res.json({ success: true, message: 'Discount deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};
