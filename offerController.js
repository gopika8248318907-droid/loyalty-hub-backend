const db = require('../config/db');

// Public: get all active offers
exports.getAllOffers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM offers ORDER BY created_at DESC');
        res.json({ success: true, offers: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Public: get single offer
exports.getOfferById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM offers WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Offer not found.' });
        res.json({ success: true, offer: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Admin: create offer
exports.createOffer = async (req, res) => {
    try {
        const { title, description, points_required, valid_from, valid_until, status } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title is required.' });

        const [result] = await db.query(
            'INSERT INTO offers (title, description, points_required, valid_from, valid_until, status) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description || '', points_required || 0, valid_from || null, valid_until || null, status || 'active']
        );
        res.status(201).json({ success: true, message: 'Offer created.', offerId: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Admin: update offer
exports.updateOffer = async (req, res) => {
    try {
        const { title, description, points_required, valid_from, valid_until, status } = req.body;
        const [result] = await db.query(
            'UPDATE offers SET title=?, description=?, points_required=?, valid_from=?, valid_until=?, status=? WHERE id=?',
            [title, description, points_required, valid_from, valid_until, status, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Offer not found.' });
        res.json({ success: true, message: 'Offer updated.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// Admin: delete offer
exports.deleteOffer = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM offers WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Offer not found.' });
        res.json({ success: true, message: 'Offer deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};
