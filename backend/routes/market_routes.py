from flask import Blueprint, jsonify, request
import sqlite3
from backend.config import Config

market_bp = Blueprint('market', __name__)

def get_db_connection():
    conn = sqlite3.connect(Config.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@market_bp.route('/listings', methods=['GET'])
def get_listings():
    conn = get_db_connection()
    listings = conn.execute('SELECT * FROM crop_listings WHERE status = "available" ORDER BY created_at DESC').fetchall()
    conn.close()
    return jsonify([dict(row) for row in listings])

@market_bp.route('/listings', methods=['POST'])
def create_listing():
    data = request.get_json()
    try:
        conn = get_db_connection()
        conn.execute('''INSERT INTO crop_listings (farmer_id, crop_name, quantity, unit, price_per_unit, location, description)
                     VALUES (?, ?, ?, ?, ?, ?, ?)''',
                     (data.get('farmer_id'), data.get('crop_name'), data.get('quantity'), data.get('unit', 'kg'),
                      data.get('price_per_unit'), data.get('location'), data.get('description')))
        conn.commit()
        conn.close()
        return jsonify({"message": "Listing created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@market_bp.route('/demands', methods=['GET'])
def get_demands():
    conn = get_db_connection()
    demands = conn.execute('SELECT * FROM demand_posts WHERE status = "open" ORDER BY created_at DESC').fetchall()
    conn.close()
    return jsonify([dict(row) for row in demands])

@market_bp.route('/demands', methods=['POST'])
def create_demand():
    data = request.get_json()
    try:
        conn = get_db_connection()
        conn.execute('''INSERT INTO demand_posts (shop_id, vegetable_name, required_quantity, unit, target_price, urgency)
                     VALUES (?, ?, ?, ?, ?, ?)''',
                     (data.get('shop_id'), data.get('vegetable_name'), data.get('required_quantity'), data.get('unit', 'kg'),
                      data.get('target_price'), data.get('urgency', 'Standard')))
        conn.commit()
        conn.close()
        return jsonify({"message": "Demand post created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@market_bp.route('/prices', methods=['GET'])
def get_prices():
    conn = get_db_connection()
    prices = conn.execute('SELECT vegetable_name, avg_price, city FROM market_demand GROUP BY vegetable_name, city').fetchall()
    conn.close()
    return jsonify([dict(row) for row in prices])

@market_bp.route('/demand', methods=['GET'])
def get_market_demand():
    conn = get_db_connection()
    demand = conn.execute('SELECT vegetable_name, SUM(demand_volume) as total_demand FROM market_demand GROUP BY vegetable_name').fetchall()
    conn.close()
    return jsonify([dict(row) for row in demand])

@market_bp.route('/alerts', methods=['GET'])
def get_alerts():
    conn = get_db_connection()
    alerts = conn.execute('SELECT * FROM price_alerts ORDER BY created_at DESC LIMIT 20').fetchall()
    conn.close()
    return jsonify([dict(row) for row in alerts])
