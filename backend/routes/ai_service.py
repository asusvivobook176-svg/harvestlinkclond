from flask import Blueprint, request, jsonify
from backend.ml_service import get_ml_service
from backend import db
from backend.models import AIRecommendation, SpoilageCheck, PriceAlert, DemandForecast
from backend.config import Config
import jwt
from functools import wraps
from datetime import datetime

ai_service_bp = Blueprint('ai_service', __name__, url_prefix='/api/ai')
ml_service = get_ml_service()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            current_user_id = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(current_user_id, *args, **kwargs)
    
    return decorated

@ai_service_bp.route('/crop-recommendations', methods=['POST'])
@token_required
def crop_recommendations(user_id):
    data = request.get_json()
    result = ml_service.get_crop_recommendations(data)
    
    if result.get('success'):
        # Save each recommendation to history
        for rec in result['recommendations']:
            new_rec = AIRecommendation(
                farmer_id=user_id,
                recommendation_type='crop',
                crop_suggested=rec['crop'],
                confidence_score=rec['confidence'],
                reasoning=rec['reasoning']
            )
            db.session.add(new_rec)
        db.session.commit()
        return jsonify(result), 200
    return jsonify(result), 400

@ai_service_bp.route('/save-recommendation/<int:rec_id>', methods=['POST'])
@token_required
def save_recommendation_action(user_id, rec_id):
    """Mark a recommendation as acted upon."""
    try:
        data = request.get_json()
        recommendation = AIRecommendation.query.filter_by(
            id=rec_id,
            farmer_id=user_id
        ).first()
        
        if not recommendation:
            return jsonify({'error': 'Recommendation not found'}), 404
        
        recommendation.action_taken = data.get('action', 'none')
        # Add a field for notes if we decide to add it to the model later, 
        # for now action_taken is the main one.
        
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ai_service_bp.route('/demand-forecast', methods=['POST'])
@token_required
def demand_forecast(user_id):
    data = request.get_json()
    result = ml_service.forecast_demand(data)
    
    if result.get('success'):
        # Save summary to history
        new_forecast = DemandForecast(
            farmer_id=user_id,
            crop_name=data.get('crop_name', 'Unknown'),
            forecast_data=str(result['forecast']),
            trend='increasing' if any(f['predicted_price_rs'] > result['forecast'][0]['predicted_price_rs'] for f in result['forecast']) else 'decreasing',
            confidence_score=0.9952 # Model score
        )
        db.session.add(new_forecast)
        db.session.commit()
        return jsonify(result), 200
    return jsonify(result), 400

@ai_service_bp.route('/price-alert-check', methods=['POST'])
@token_required
def price_alert_check(user_id):
    data = request.get_json()
    result = ml_service.detect_price_crash_risk(data)
    
    if result.get('success'):
        new_alert = PriceAlert(
            farmer_id=user_id,
            crop_name=data.get('crop_name', 'Unknown'),
            alert_type='crash_risk',
            current_price=data.get('current_price', 0),
            predicted_crash_price=result['predicted_price'],
            risk_level=result['risk_level']
        )
        db.session.add(new_alert)
        db.session.commit()
        return jsonify(result), 200
    return jsonify(result), 400

@ai_service_bp.route('/spoilage-check', methods=['POST'])
@token_required
def spoilage_check(user_id):
    data = request.get_json()
    result = ml_service.predict_spoilage_risk(data)
    
    if result.get('success'):
        new_check = SpoilageCheck(
            farmer_id=user_id,
            crop_name=data.get('crop_name', 'Unknown'),
            harvest_date=datetime.strptime(data.get('harvest_date'), '%Y-%m-%d').date() if data.get('harvest_date') else None,
            estimated_shelf_life_days=int(result['shelf_life_days']),
            risk_level=result['risk_level']
        )
        db.session.add(new_check)
        db.session.commit()
        return jsonify(result), 200
    return jsonify(result), 400

@ai_service_bp.route('/recommendations-history', methods=['GET'])
@token_required
def recommendations_history(user_id):
    recs = AIRecommendation.query.filter_by(farmer_id=user_id).order_by(AIRecommendation.created_at.desc()).all()
    return jsonify({"history": [r.to_dict() for r in recs]}), 200

@ai_service_bp.route('/alerts-history', methods=['GET'])
@token_required
def alerts_history(user_id):
    alerts = PriceAlert.query.filter_by(farmer_id=user_id).order_by(PriceAlert.created_at.desc()).all()
    return jsonify({"history": [a.to_dict() for a in alerts]}), 200

@ai_service_bp.route('/spoilage-history', methods=['GET'])
@token_required
def spoilage_history(user_id):
    checks = SpoilageCheck.query.filter_by(farmer_id=user_id).order_by(SpoilageCheck.created_at.desc()).all()
    return jsonify({"history": [c.to_dict() for c in checks]}), 200

@ai_service_bp.route('/model-status', methods=['GET'])
def model_status():
    status = {
        "status": "online",
        "models": {
            "crop": "Ready",
            "demand": "Ready",
            "price_crash": "Ready",
            "spoilage": "Ready"
        },
        "database": "Connected"
    }
    return jsonify(status), 200
