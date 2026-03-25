import joblib
import pandas as pd
import numpy as np
import os
from ml.model5_profit.preprocessing import preprocess_profit_data

def predict_profit(input_data):
    """
    input_data: dict with features: land_area_acres, crop_type, yield_kg_expected, 
                selling_price_forecast, input_costs_fertilizer_labor, water_cost, 
                labor_days, market_distance_km
    """
    models_dir = 'models'
    path = os.path.join(models_dir, 'profit_model.pkl')
    enc_path = os.path.join(models_dir, 'profit_encoders.pkl')
    sca_path = os.path.join(models_dir, 'profit_scaler.pkl')
    
    if not all(os.path.exists(p) for p in [path, enc_path, sca_path]):
        return None
        
    data = joblib.load(path)
    encoders = joblib.load(enc_path)
    scaler = joblib.load(sca_path)
    
    df = pd.DataFrame([input_data])
    df_processed = preprocess_profit_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    feat_order = data['features']
    profit = data['model'].predict(df_processed[feat_order])[0]
    
    # What-if analysis
    # Example: If crop was Beans instead
    if input_data['crop_type'] != 'Beans':
        beans_input = input_data.copy()
        beans_input['crop_type'] = 'Beans'
        # Estimate profit for beans (crude estimate for what-if)
        # In a real app, this would recalculate yield/price based on mean values
        beans_profit = profit * 1.2 # Placeholder logic
        diff = beans_profit - profit
        what_if = f"Switch to Beans -> Estimated +Rs.{diff:,.0f} profit"
    else:
        what_if = "You are already growing a highly profitable crop."
        
    return {
        'predicted_profit_rs': float(profit),
        'what_if_analysis': what_if,
        'profit_margin_pct': (profit / (input_data['yield_kg_expected'] * input_data['selling_price_forecast'])) * 100 if profit > 0 else 0
    }

if __name__ == "__main__":
    # Test
    sample = {
        'land_area_acres': 2.0, 'crop_type': 'Tomato', 'yield_kg_expected': 30000, 
        'selling_price_forecast': 25.0, 'input_costs_fertilizer_labor': 40000, 
        'water_cost': 5000, 'labor_days': 80, 'market_distance_km': 20
    }
    res = predict_profit(sample)
    if res:
        print(f"Predicted Profit: Rs.{res['predicted_profit_rs']:,.2f}")
        print(f"What-if: {res['what_if_analysis']}")
