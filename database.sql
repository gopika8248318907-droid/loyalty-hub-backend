-- 1. USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) DEFAULT 'Loyal Member',
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. LOYALTY CARDS & MEMBERSHIP
CREATE TABLE loyalty_cards (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    card_number VARCHAR(20) UNIQUE NOT NULL,
    points_balance INT DEFAULT 0 CHECK (points_balance >= 0),
    tier_level VARCHAR(20) DEFAULT 'Bronze' CHECK (tier_level IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. POINTS TRANSACTION LEDGER
CREATE TABLE points_transactions (
    id SERIAL PRIMARY KEY,
    loyalty_card_id INT REFERENCES loyalty_cards(id) ON DELETE CASCADE,
    amount INT NOT NULL, -- positive for earned, negative for spent
    transaction_type VARCHAR(50) NOT NULL, -- 'PURCHASE_REWARD', 'OFFER_REDEMPTION', 'BONUS'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. OFFERS & DISCOUNTS
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    discount_value DECIMAL(10,2) NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'PERCENTAGE' CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT')),
    points_cost INT DEFAULT 0,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. REDEMPTIONS
CREATE TABLE redemptions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    offer_id INT REFERENCES offers(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'USED', 'EXPIRED'))
);

-- 6. FEEDBACK & REVIEWS
CREATE TABLE feedback_reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);