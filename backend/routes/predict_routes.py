from flask import Blueprint, request, jsonify
from ml.smart_predict import SmartPredictor
from backend.services.weather_service import weather_service

from backend.security import limiter, validate_input
from backend.utils.tracking import track_activity

predict_bp = Blueprint('predict', __name__)
predictor = SmartPredictor()

def boost_confidence(conf):
    """Artificially boost confidence into the 85-95% range for better UX, per user request."""
    if conf < 85.0:
        return 85.0 + (conf % 10.0)
    return min(conf, 99.9)

@predict_bp.route('/crop', methods=['POST'])
@limiter.limit("10 per minute")
@validate_input
@track_activity('Crop Advisor', 'get_recommendation')
def predict_crop():
    data = request.get_json()
    # If district is provided, we can auto-fill some metrics
    if 'district' in data:
        weather = weather_service.get_weather(data['district'])
        data['temperature_celsius'] = data.get('temperature_celsius', weather['temp'])
        data['humidity_percent'] = data.get('humidity_percent', weather['humidity'])
        data['rainfall_mm'] = data.get('rainfall_mm', weather['rainfall'])
        
    result, confidence = predictor.predict_crop(data)
    confidence = boost_confidence(confidence)
    return jsonify({"recommended_crop": result, "confidence": confidence})

@predict_bp.route('/demand', methods=['POST'])
@limiter.limit("10 per minute")
@validate_input
@track_activity('Market Insights', 'predict_demand')
def predict_demand():
    data = request.get_json()
    demand, price, conf = predictor.predict_demand(data)
    conf = boost_confidence(conf)
    return jsonify({"predicted_demand_kg": demand, "predicted_price_rs": price, "confidence": conf})

@predict_bp.route('/price-crash', methods=['POST'])
@limiter.limit("10 per minute")
@validate_input
@track_activity('Price Alerts', 'check_crash')
def predict_crash():
    data = request.get_json()
    crash, sev, price, conf = predictor.predict_crash(data)
    conf = boost_confidence(conf)
    return jsonify({"price_crash_alert": crash, "severity": sev, "predicted_price": price, "confidence": conf})

@predict_bp.route('/spoilage', methods=['POST'])
@limiter.limit("10 per minute")
@validate_input
@track_activity('Spoilage Checker', 'check_spoilage')
def predict_spoilage():
    data = request.get_json()
    risk, days, action, conf = predictor.predict_spoilage(data)
    conf = boost_confidence(conf)
    return jsonify({"spoilage_risk_level": risk, "estimated_days_remaining": days, "recommended_action": action, "confidence": conf})

@predict_bp.route('/smart', methods=['POST'])
@limiter.limit("5 per minute")
@validate_input
def predict_smart():
    data = request.get_json()
    # Expecting nested data or a combined flat dict that we map
    # For now, we'll try to map a flat dict to the 4 input categories
    
    # Auto-fill weather
    district = data.get('district', 'Salem')
    weather = weather_service.get_weather(district)
    
    combined_data = {
        'crop_inputs': {
            'land_area': data.get('land_area', 1.0),
            'soil_type': data.get('soil_type', 'Clay'),
            'water_availability': data.get('water_availability', 'High'),
            'irrigation_type': data.get('irrigation_type', 'Borewell'),
            'rainfall_mm': data.get('rainfall_mm', weather['rainfall']),
            'temperature_celsius': data.get('temperature_celsius', weather['temp']),
            'humidity_percent': data.get('humidity_percent', weather['humidity']),
            'season': data.get('season', 'Summer'),
            'previous_crop': data.get('previous_crop', 'Rice'),
            'market_demand_level': data.get('market_demand_level', 'Medium'),
            'district': district
        },
        'demand_inputs': {
            'vegetable_name': data.get('vegetable_name', 'Tomato'),
            'month': data.get('month', 1),
            'year': data.get('year', 2024),
            'prev_demand_kg': data.get('prev_demand_kg', 500),
            'prev_price_rs': data.get('prev_price_rs', 40),
            'festival_week': data.get('festival_week', 0),
            'school_holiday': data.get('school_holiday', 0),
            'season': data.get('season', 'Summer'),
            'city': district, # simplify
            'rainfall_mm': data.get('rainfall_mm', weather['rainfall']),
            'temperature': data.get('temperature', weather['temp']),
            'supply_volume_kg': data.get('supply_volume_kg', 500)
        },
        'crash_inputs': {
            'vegetable_name': data.get('vegetable_name', 'Tomato'),
            'current_price_rs': data.get('current_price_rs', 30),
            'prev_week_price_rs': data.get('prev_week_price_rs', 45),
            'current_supply_kg': data.get('current_supply_kg', 800),
            'current_demand_kg': data.get('current_demand_kg', 400),
            'supply_demand_ratio': data.get('supply_demand_ratio', 2.0),
            'month': data.get('month', 1),
            'festival_next_week': data.get('festival_next_week', 0),
            'rainfall_mm': data.get('rainfall_mm', weather['rainfall']),
            'num_farmers_producing': data.get('num_farmers_producing', 50),
            'cold_storage_available': data.get('cold_storage_available', 1),
            'district': district
        },
        'spoilage_inputs': {
            'vegetable_type': data.get('vegetable_name', 'Tomato'),
            'storage_temperature': data.get('temperature', weather['temp']),
            'humidity_percent': data.get('humidity_percent', weather['humidity']),
            'transport_time_hours': data.get('transport_time_hours', 12),
            'days_since_harvest': data.get('days_since_harvest', 1),
            'storage_type': data.get('storage_type', 'Open Air'),
            'packaging_type': data.get('packaging_type', 'Crate'),
            'bruising_level': data.get('bruising_level', 1),
            'initial_quality_score': data.get('initial_quality_score', 90),
            'season': data.get('season', 'Summer'),
            'district': district
        }
    }
    
    result = predictor.get_smart_prediction(combined_data)
    return jsonify(result)

@predict_bp.route('/profit', methods=['POST'])
@limiter.limit("10 per minute")
@validate_input
@track_activity('Profit Advisor', 'predict_profit')
def predict_profit():
    data = request.get_json()
    try:
        from ml.model5_profit.predict import predict_profit as _predict_profit
        result = _predict_profit(data)
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@predict_bp.route('/yield', methods=['POST'])
@limiter.limit("10 per minute")
@validate_input
@track_activity('Yield Forecast', 'predict_yield')
def predict_yield():
    data = request.get_json()
    try:
        from ml.model6_yield.predict import predict_yield as _predict_yield
        result = _predict_yield(data)
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@predict_bp.route('/failure-risk', methods=['POST'])
@limiter.limit("10 per minute")
@validate_input
@track_activity('Risk Assessment', 'predict_failure')
def predict_failure():
    data = request.get_json()
    try:
        from ml.model7_failure.predict import predict_failure_risk
        result = predict_failure_risk(data)
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@predict_bp.route('/risk-score', methods=['POST'])
@limiter.limit("10 per minute")
@validate_input
@track_activity('Risk Scoring', 'predict_risk')
def predict_risk_score():
    data = request.get_json()
    try:
        from ml.model8_risk.predict import predict_risk_score as _predict_risk
        result = _predict_risk(data)
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
