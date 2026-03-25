"""
Disease Detection API Routes
Handles image uploads and disease prediction
"""

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import asyncio
import logging
from datetime import datetime

from backend.services.disease_detection_service import get_disease_service

from flask import g
try:
    from backend.routes.auth_routes import require_auth
except ImportError:
    def require_auth(f):
        return f

def get_current_user():
    class CurrentUser:
        id = getattr(g, 'user_id', 1)
    return CurrentUser()

disease_bp = Blueprint('disease', __name__)
logger = logging.getLogger(__name__)

disease_service = get_disease_service()

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
UPLOAD_FOLDER = 'uploads/disease_images'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@disease_bp.route('/api/disease/detect', methods=['POST'])
@require_auth
def detect_disease():
    try:
        current_user = get_current_user()
        
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Use PNG, JPG, GIF, BMP'}), 400
        
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
        filepath = os.path.join(UPLOAD_FOLDER, timestamp + filename)
        file.save(filepath)
        
        logger.info(f"Image saved: {filepath}")
        
        crop_name = request.form.get('crop_name')
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        result = loop.run_until_complete(
            disease_service.detect_disease(filepath, crop_name)
        )
        loop.close()
        
        result['user_id'] = current_user.id
        result['image_path'] = filepath
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Disease detection error: {e}")
        return jsonify({'error': str(e)}), 500


@disease_bp.route('/api/disease/history', methods=['GET'])
@require_auth
def get_disease_history():
    try:
        current_user = get_current_user()
        page = request.args.get('page', 1, type=int)
        
        return jsonify({
            'cases': [],
            'total': 0,
            'page': page
        }), 200
    except Exception as e:
        logger.error(f"Error fetching disease history: {e}")
        return jsonify({'error': str(e)}), 500
