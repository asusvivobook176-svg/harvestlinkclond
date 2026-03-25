import joblib
import pandas as pd
import numpy as np
import os
from ml.model7_failure.preprocessing import preprocess_failure_data

def predict_failure_risk(input_data):
    """
    input_data: dict with features: rainfall_mm, soil_moisture_pct, temperature_avg, 
                crop_type, farmer_experience_years, irrigation_type
    """
    models_dir = 'models'
    path = os.path.join(models_dir, 'failure_model.pkl')
    enc_path = os.path.join(models_dir, 'failure_encoders.pkl')
    sca_path = os.path.join(models_dir, 'failure_scaler.pkl')
    
    if not all(os.path.exists(p) for p in [path, enc_path, sca_path]):
        return None
        
    data = joblib.load(path)
    encoders = joblib.load(enc_path)
    scaler = joblib.load(sca_path)
    
    df = pd.DataFrame([input_data])
    df_processed = preprocess_failure_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    feat_order = data['features']
    prob = data['model'].predict_proba(df_processed[feat_order])[0][1]
    
    if prob > 0.7: risk = 'High'
    elif prob > 0.3: risk = 'Medium'
    else: risk = 'Low'
    
    # Suggestions
    if risk == 'High':
        suggestion = "Consider changing irrigation type or adding soil moisture sensors. Risk of failure is high."
    elif risk == 'Medium':
        suggestion = "Monitor weather closely. Moderate risk detected."
    else:
        suggestion = "Conditions are favorable for crop success."
        
    return {
        'failure_probability': float(prob),
        'risk_score': risk,
        'recommendation': suggestion,
        'explanation': "High temperature and low rainfall detected." if prob > 0.5 else "Stable conditions."
    }

if __name__ == "__main__":
    # Test
    sample = {
        'rainfall_mm': 200, 'soil_moisture_pct': 15, 'temperature_avg': 42, 
        'crop_type': 'Rice', 'farmer_experience_years': 3, 'irrigation_type': 'Rainfed'
    }
    res = predict_failure_risk(sample)
    if res:
        print(f"Risk Level: {res['risk_score']}")
        print(f"Probability: {res['failure_probability']:.2%}")
        print(f"Recommendation: {res['recommendation']}")
