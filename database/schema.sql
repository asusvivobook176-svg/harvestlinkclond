-- HarvestLink Database Schema (SQLite)

-- 1. Users table (for authentication and role management)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('farmer', 'shop', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Farmers table
CREATE TABLE IF NOT EXISTS farmers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    phone TEXT,
    village TEXT,
    district TEXT,
    land_area REAL,
    soil_type TEXT,
    water_availability TEXT,
    irrigation_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3. Shops table
CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    owner_name TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    location TEXT,
    phone TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. Crops table (farmer's current plantings)
CREATE TABLE IF NOT EXISTS crops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER,
    crop_name TEXT NOT NULL,
    season TEXT,
    quantity_kg REAL,
    planted_date DATE,
    expected_harvest DATE,
    status TEXT DEFAULT 'planted',
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- 5. Market Demand table (historical and predicted demand data)
CREATE TABLE IF NOT EXISTS market_demand (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vegetable_name TEXT NOT NULL,
    month INTEGER,
    year INTEGER,
    demand_volume REAL,
    avg_price REAL,
    festival_week BOOLEAN DEFAULT 0,
    city TEXT
);

-- 5.1 Demand Forecasts table
CREATE TABLE IF NOT EXISTS demand_forecasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,
    crop_name TEXT NOT NULL,
    forecast_data TEXT,  -- JSON string
    trend TEXT,
    confidence_score REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- 6. AI Recommendations table (AI crop suggestions)
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,
    recommendation_type TEXT,  -- 'crop', 'technique'
    crop_suggested TEXT,
    confidence_score REAL,
    reasoning TEXT,
    action_taken TEXT,  -- 'planted', 'ignored'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- 7. Price Alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,
    crop_name TEXT NOT NULL,
    alert_type TEXT,  -- 'crash_risk', 'surge'
    current_price REAL,
    predicted_crash_price REAL,
    risk_level TEXT,  -- 'LOW', 'MEDIUM', 'HIGH'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- 7.1 Spoilage Checks table
CREATE TABLE IF NOT EXISTS spoilage_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,
    crop_name TEXT,
    harvest_date DATE,
    estimated_shelf_life_days INTEGER,
    risk_level TEXT,  -- 'LOW', 'MEDIUM', 'HIGH'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- 8. Crop Listings table (for marketplace)
CREATE TABLE IF NOT EXISTS crop_listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER,
    crop_name TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT DEFAULT 'kg',
    price_per_unit REAL NOT NULL,
    location TEXT,
    description TEXT,
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- 9. Demand Posts table (for shop requirements)
CREATE TABLE IF NOT EXISTS demand_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_id INTEGER,
    vegetable_name TEXT NOT NULL,
    required_quantity REAL NOT NULL,
    unit TEXT DEFAULT 'kg',
    target_price REAL,
    urgency TEXT DEFAULT 'Standard',
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- 10. Pilot Participants table
CREATE TABLE IF NOT EXISTS pilot_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT,
    location TEXT, -- Coimbatore / Salem
    crop_type TEXT, -- tomato, onion, potato
    farm_size TEXT, -- Small, Medium, Large
    phone_number TEXT,
    training_completed BOOLEAN DEFAULT 0,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 11. Activity Logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    feature TEXT, -- Crop Advisor, Price Alerts, Spoilage Checker
    action TEXT, -- view, check, recommendation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 12. Pilot Feedback table
CREATE TABLE IF NOT EXISTS pilot_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    feedback_type TEXT, -- Survey, Bug, WhatsApp
    content TEXT,
    prediction_accurate BOOLEAN,
    rating INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 12.1 Pilot Training table
CREATE TABLE IF NOT EXISTS pilot_training (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,
    crop_advisor_trained BOOLEAN DEFAULT 0,
    price_alerts_trained BOOLEAN DEFAULT 0,
    spoilage_checker_trained BOOLEAN DEFAULT 0,
    training_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT DEFAULT 'completed',
    FOREIGN KEY (farmer_id) REFERENCES pilot_participants(id)
);

-- 13. Transactions table (for revenue and purchase analytics)
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL, -- farmer_id
    buyer_id INTEGER NOT NULL,  -- shop_id
    crop_name TEXT NOT NULL,
    quantity REAL NOT NULL,
    price_per_unit REAL NOT NULL,
    total_price REAL NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES farmers(id),
    FOREIGN KEY (buyer_id) REFERENCES shops(id)
);

-- 14. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT,
    message TEXT,
    notification_type TEXT, -- price_alert, spoilage_warning, demand_update, recommendation
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 15. Notification Preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    in_app BOOLEAN DEFAULT 1,
    email BOOLEAN DEFAULT 1,
    sms BOOLEAN DEFAULT 0,
    push BOOLEAN DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
