from flask import Blueprint, request, jsonify
import sqlite3
from backend.config import Config

farmer_bp = Blueprint('farmer', __name__)

def get_db_connection():
    conn = sqlite3.connect(Config.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@farmer_bp.route('/register', methods=['POST'])
def register_farmer_profile():
    data = request.get_json()
    # Assume authenticated user_id is passed or handled via middleware
    user_id = data.get('user_id')
    
    try:
        conn = get_db_connection()
        conn.execute('''INSERT INTO farmers (user_id, name, phone, village, district, land_area, soil_type, water_availability, irrigation_type)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                     (user_id, data.get('name'), data.get('phone'), data.get('village'), data.get('district'),
                      data.get('land_area'), data.get('soil_type'), data.get('water_availability'), data.get('irrigation_type')))
        conn.commit()
        conn.close()
        return jsonify({"message": "Farmer profile created"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@farmer_bp.route('/<int:farmer_id>', methods=['GET'])
def get_farmer(farmer_id):
    conn = get_db_connection()
    farmer = conn.execute('SELECT * FROM farmers WHERE id = ?', (farmer_id,)).fetchone()
    conn.close()
    if farmer:
        return jsonify(dict(farmer))
    return jsonify({"error": "Farmer not found"}), 404

@farmer_bp.route('/update', methods=['POST'])
def update_farmer():
    data = request.get_json()
    farmer_id = data.get('id')
    try:
        conn = get_db_connection()
        conn.execute('''UPDATE farmers SET name=?, phone=?, village=?, district=?, land_area=?, soil_type=?, water_availability=?, irrigation_type=?
                     WHERE id=?''',
                     (data.get('name'), data.get('phone'), data.get('village'), data.get('district'),
                      data.get('land_area'), data.get('soil_type'), data.get('water_availability'), data.get('irrigation_type'), farmer_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Profile updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
