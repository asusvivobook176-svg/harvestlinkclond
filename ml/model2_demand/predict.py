import joblib
import pandas as pd
import numpy as np
import os
from ml.model2_demand.preprocessing import preprocess_demand_data

def predict_demand(input_data):
    """
    input_data: dict with features: vegetable_name, month, year, prev_month_demand_kg,
                prev_month_price_rs, festival_week, school_holiday, season, city,
                rainfall_mm, temperature_celsius, supply_volume_kg
    """
    models_dir = 'models'
    reg_path = os.path.join(models_dir, 'demand_regression_models.pkl')
    enc_path = os.path.join(models_dir, 'demand_encoders.pkl')
    sca_path = os.path.join(models_dir, 'demand_scaler.pkl')
    
    if not all(os.path.exists(p) for p in [reg_path, enc_path, sca_path]):
        return "Models not trained.", 0.0, 0.0
    
    reg_data = joblib.load(reg_path)
    encoders = joblib.load(enc_path)
    scaler = joblib.load(sca_path)
    
    df = pd.DataFrame([input_data])
    df_processed = preprocess_demand_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    feat_order = reg_data['features']
    demand = reg_data['rf_demand'].predict(df_processed[feat_order])[0]
    price = reg_data['lr_price'].predict(df_processed[feat_order])[0]
    
    return demand, price

if __name__ == "__main__":
    # Sample Test
    sample = {
        'vegetable_name': 'Tomato', 'month': 1, 'year': 2024,
        'prev_month_demand_kg': 500.0, 'prev_month_price_rs': 30.0,
        'festival_week': 1, 'school_holiday': 0, 'season': 'Winter',
        'city': 'Chennai', 'rainfall_mm': 10.0, 'temperature_celsius': 28.0,
        'supply_volume_kg': 600.0
    }
    demand, price = predict_demand(sample)
    print(f"Predicted Next Week Demand: {demand:.2f} kg")
    print(f"Predicted Next Month Price: {price:.2f} Rs/kg")
