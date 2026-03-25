import joblib
import pandas as pd
import os
from .preprocessing import preprocess_data
import numpy as np

def predict_crop(input_data):
    """
    input_data: dict containing keys: land_area, soil_type, water_availability, 
                irrigation_type, rainfall_mm, temperature_celsius, humidity_percent, 
                season, previous_crop, market_demand_level, district
    """
    models_dir = 'models'
    model_path = os.path.join(models_dir, 'crop_model.pkl')
    encoders_path = os.path.join(models_dir, 'crop_encoders.pkl')
    
    if not os.path.exists(model_path) or not os.path.exists(encoders_path):
        return "Model or encoders not found. Please train the model first.", 0.0
    
    model = joblib.load(model_path)
    encoders = joblib.load(encoders_path)
    
    df = pd.DataFrame([input_data])
    df_processed = preprocess_data(df, is_training=False, encoders=encoders)
    
    # Ensure correct feature order (matching training)
    features = ['land_area', 'soil_type', 'water_availability', 'irrigation_type', 
                'rainfall_mm', 'temperature_celsius', 'humidity_percent', 
                'season', 'previous_crop', 'market_demand_level', 'district']
    
    prediction_idx = model.predict(df_processed[features])[0]
    prediction = encoders['recommended_crop'].inverse_transform([prediction_idx])[0]
    
    # Confidence
    probs = model.predict_proba(df_processed[features])[0]
    confidence = float(np.max(probs)) * 100
    
    return prediction, confidence

if __name__ == "__main__":
    import numpy as np
    # Sample test input
    sample_input = {
        'land_area': 5.0,
        'soil_type': 'Black',
        'water_availability': 'High',
        'irrigation_type': 'Borewell',
        'rainfall_mm': 1200,
        'temperature_celsius': 28,
        'humidity_percent': 70,
        'season': 'Kharif',
        'previous_crop': 'None',
        'market_demand_level': 'High',
        'district': 'Salem'
    }
    
    crop, conf = predict_crop(sample_input)
    print(f"Recommended Crop: {crop}")
    print(f"Confidence: {conf:.2f}%")
