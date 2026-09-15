const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const offerRoutes = require('./routes/offerRoutes');
const discountRoutes = require('./routes/discountRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Loyalty Hub API is running.' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Loyalty Hub server running on http://localhost:${PORT}`);
});
