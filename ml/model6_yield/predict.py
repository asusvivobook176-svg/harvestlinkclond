import joblib
import pandas as pd
import numpy as np
import os
from ml.model6_yield.preprocessing import preprocess_yield_data

def predict_yield(input_data):
    """
    input_data: dict with features: soil_type, rainfall, water_availability, 
                fertilizer_usage, temperature, crop_type
    """
    models_dir = 'models'
    path = os.path.join(models_dir, 'yield_model.pkl')
    enc_path = os.path.join(models_dir, 'yield_encoders.pkl')
    sca_path = os.path.join(models_dir, 'yield_scaler.pkl')
    
    if not all(os.path.exists(p) for p in [path, enc_path, sca_path]):
        return None
        
    data = joblib.load(path)
    encoders = joblib.load(enc_path)
    scaler = joblib.load(sca_path)
    
    df = pd.DataFrame([input_data])
    df_processed = preprocess_yield_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    feat_order = data['features']
    yield_val = data['model'].predict(df_processed[feat_order])[0]
    
    return yield_val

if __name__ == "__main__":
    # Test
    sample = {
        'soil_type': 'Loamy', 'rainfall': 800, 'water_availability': 'High',
        'fertilizer_usage': 150, 'temperature': 28, 'crop_type': 'Tomato'
    }
    y = predict_yield(sample)
    if y:
        print(f"Predicted Yield: {y:.2f} kg per acre")
