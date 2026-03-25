import joblib
import pandas as pd
import numpy as np
import os
from ml.model8_risk.preprocessing import preprocess_risk_data

def predict_risk_score(input_data):
    """
    input_data: dict with features: weather_variability, market_volatility, 
                water_scarcity, crop_price_fluctuation, historical_yield_instability
    """
    models_dir = 'models'
    path = os.path.join(models_dir, 'risk_model.pkl')
    enc_path = os.path.join(models_dir, 'risk_encoders.pkl')
    sca_path = os.path.join(models_dir, 'risk_scaler.pkl')
    
    if not all(os.path.exists(p) for p in [path, enc_path, sca_path]):
        return None
        
    data = joblib.load(path)
    encoders = joblib.load(enc_path)
    scaler = joblib.load(sca_path)
    
    df = pd.DataFrame([input_data])
    df_processed = preprocess_risk_data(df, is_training=False, encoders=None, scaler=scaler)
    
    feat_order = data['features']
    risk_idx = data['model'].predict(df_processed[feat_order])[0]
    risk_level = encoders['target_risk_level'].inverse_transform([risk_idx])[0]
    
    # Probability output (as requested)
    probs = data['model'].predict_proba(df_processed[feat_order])[0]
    prob_dict = {encoders['target_risk_level'].classes_[i]: float(probs[i]) for i in range(len(probs))}
    
    return {
        'risk_level': risk_level,
        'probabilities': prob_dict
    }

if __name__ == "__main__":
    # Test
    sample = {
        'weather_variability': 80, 'market_volatility': 70, 'water_scarcity': 90, 
        'crop_price_fluctuation': 60, 'historical_yield_instability': 85
    }
    res = predict_risk_score(sample)
    if res:
        print(f"Overall Risk Level: {res['risk_level']}")
        print(f"Probabilities: {res['probabilities']}")
