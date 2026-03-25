from flask import Blueprint, jsonify
import logging
from datetime import datetime
from backend.ml_service import get_ml_service

monitoring_bp = Blueprint('monitoring', __name__, url_prefix='/api/monitoring')
logger = logging.getLogger(__name__)
ml_service = get_ml_service()

@monitoring_bp.route('/model-health', methods=['GET'])
def model_health():
    """Check health of all ML models"""
    try:
        models_status = {}
        for key in ['crop', 'demand', 'price_crash', 'spoilage']:
            models_status[key] = {
                'status': 'healthy' if ml_service.models.get(key) is not None else 'error',
                'loaded': ml_service.models.get(key) is not None
            }
        
        return jsonify({
            'timestamp': datetime.now().isoformat(),
            'status': 'online',
            'models': models_status
        }), 200
    except Exception as e:
        logger.error(f"Error checking model health: {e}")
        return jsonify({
            'timestamp': datetime.now().isoformat(),
            'status': 'error',
            'error': str(e)
        }), 500
