from flask import Blueprint, request, jsonify, g
from functools import wraps
import jwt
import datetime
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from backend.config import Config

from backend.security import limiter

auth_bp = Blueprint('auth', __name__)

def get_db_connection():
    conn = sqlite3.connect(Config.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'error': 'Authentication token is missing'}), 401
        
        try:
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            # Add user data to request context (g object)
            g.user_id = payload.get('user_id')
            g.user_role = payload.get('role')
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'error': str(e)}), 401
            
        return f(*args, **kwargs)
    return decorated

@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per hour")
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'farmer')
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
        
    password_hash = generate_password_hash(password)
    
    try:
        conn = get_db_connection()
        conn.execute('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                     (name, email, password_hash, role))
        conn.commit()
        conn.close()
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("20 per minute")
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    
    if user and check_password_hash(user['password_hash'], password):
        token = jwt.encode({
            'user_id': user['id'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=Config.JWT_EXPIRATION_HOURS)
        }, Config.SECRET_KEY, algorithm="HS256")
        
        return jsonify({
            "token": token,
            "user": {
                "id": user['id'],
                "name": user['name'],
                "role": user['role']
            }
        })
        
    return jsonify({"error": "Invalid credentials"}), 401
@auth_bp.route('/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    
    if user:
        return jsonify(dict(user))
    return jsonify({"error": "User not found"}), 404
