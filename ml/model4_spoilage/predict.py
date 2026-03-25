import joblib
import pandas as pd
import numpy as np
import os
from ml.model4_spoilage.preprocessing import preprocess_spoilage_data

def predict_spoilage_risk(input_data):
    """
    input_data: dict with features: vegetable_type, storage_temperature_celsius, 
                humidity_percent, transport_time_hours, days_since_harvest, 
                storage_type, packaging_type, bruising_level, initial_quality_score, 
                season, district
    """
    models_dir = 'models'
    model_path = os.path.join(models_dir, 'spoilage_model.pkl')
    enc_path = os.path.join(models_dir, 'spoilage_encoders.pkl')
    sca_path = os.path.join(models_dir, 'spoilage_scaler.pkl')
    
    if not all(os.path.exists(p) for p in [model_path, enc_path, sca_path]):
        return None
        
    data = joblib.load(model_path)
    encoders = joblib.load(enc_path)
    scaler = joblib.load(sca_path)
    
    df = pd.DataFrame([input_data])
    df_processed = preprocess_spoilage_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    feat_order = data['features']
    risk_idx = data['model_risk'].predict(df_processed[feat_order])[0]
    risk = encoders['spoilage_risk_level'].inverse_transform([risk_idx])[0]
    days_rem = data['model_days'].predict(df_processed[feat_order])[0]
    
    # Confidence
    probs = data['model_risk'].predict_proba(df_processed[feat_order])[0]
    confidence = float(np.max(probs)) * 100
    
    from ml.model4_spoilage.circular_economy_router import get_circular_economy_suggestion
    suggestion = get_circular_economy_suggestion(risk, days_rem)
    
    msg = f"Spoilage Risk: {risk} ({confidence:.1f}% confidence). Estimated days remaining: {days_rem:.1f} days."
    
    return {
        'risk_level': risk,
        'confidence_pct': confidence,
        'days_remaining': float(days_rem),
        'recommended_action': suggestion['action'],
        'reason': suggestion['reason'],
        'alert_message': msg
    }

if __name__ == "__main__":
    # Sample Test
    sample = {
        'vegetable_type': 'Leafy Greens', 'storage_temperature_celsius': 35.0,
        'humidity_percent': 40.0, 'transport_time_hours': 12.0, 'days_since_harvest': 1,
        'storage_type': 'Open Air', 'packaging_type': 'Jute Bag', 'bruising_level': 'Minor',
        'initial_quality_score': 8.5, 'season': 'Summer', 'district': 'Chennai'
    }
    res = predict_spoilage_risk(sample)
    if res:
        print(f"Risk: {res['risk_level']}")
        print(f"Days: {res['days_remaining']:.1f}")
        print(f"Action: {res['recommended_action']}")
