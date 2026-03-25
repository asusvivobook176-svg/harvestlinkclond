from flask import Blueprint, request, jsonify
import sqlite3
from backend.config import Config

shop_bp = Blueprint('shop', __name__)

def get_db_connection():
    conn = sqlite3.connect(Config.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@shop_bp.route('/register', methods=['POST'])
def register_shop():
    data = request.get_json()
    user_id = data.get('user_id')
    try:
        conn = get_db_connection()
        conn.execute('''INSERT INTO shops (user_id, owner_name, shop_name, location, phone)
                     VALUES (?, ?, ?, ?, ?)''',
                     (user_id, data.get('owner_name'), data.get('shop_name'), data.get('location'), data.get('phone')))
        conn.commit()
        conn.close()
        return jsonify({"message": "Shop profile created"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@shop_bp.route('/<int:shop_id>', methods=['GET'])
def get_shop(shop_id):
    conn = get_db_connection()
    shop = conn.execute('SELECT * FROM shops WHERE id = ?', (shop_id,)).fetchone()
    conn.close()
    if shop:
        return jsonify(dict(shop))
    return jsonify({"error": "Shop not found"}), 404

@shop_bp.route('/demand', methods=['GET'])
def get_shop_demand():
    # Return general demand trends for shops
    conn = get_db_connection()
    demand = conn.execute('SELECT * FROM market_demand ORDER BY year DESC, month DESC LIMIT 10').fetchall()
    conn.close()
    return jsonify([dict(row) for row in demand])
@shop_bp.route('/update', methods=['POST'])
def update_shop():
    data = request.get_json()
    shop_id = data.get('id')
    try:
        conn = get_db_connection()
        conn.execute('''UPDATE shops SET owner_name=?, shop_name=?, location=?, phone=?, city=?
                     WHERE id=?''',
                     (data.get('owner_name'), data.get('shop_name'), data.get('location'), 
                      data.get('phone'), data.get('city'), shop_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Shop profile updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
