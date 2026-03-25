import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from ml.model5_profit.preprocessing import preprocess_profit_data

# Use XGBoost if available
try:
    import xgboost as xgb
except ImportError:
    from sklearn.ensemble import RandomForestRegressor as xgb_reg # Fallback

def train_profit_model():
    data_path = os.path.join('data', 'profit_data.csv')
    if not os.path.exists(data_path):
        from ml.model5_profit.generate_data import generate_profit_data
        generate_profit_data()
        
    df = pd.read_csv(data_path)
    
    # Preprocess
    df_processed, encoders, scaler = preprocess_profit_data(df, is_training=True)
    
    features = ['land_area_acres', 'crop_type', 'yield_kg_expected', 'selling_price_forecast', 
                'input_costs_fertilizer_labor', 'water_cost', 'labor_days', 'market_distance_km', 
                'cost_per_acre', 'yield_per_acre']
    
    X = df_processed[features]
    y = df['target_profit_rs']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train
    if 'xgboost' in str(type(xgb)):
        model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
    else:
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        
    model.fit(X_train, y_train)
    
    # Eval
    y_pred = model.predict(X_test)
    print("=== Model 5: Profit Prediction Evaluation ===")
    print(f"MAE: Rs. {mean_absolute_error(y_test, y_pred):.2f}")
    print(f"R2 : {r2_score(y_test, y_pred):.4f}")
    
    os.makedirs('models', exist_ok=True)
    joblib.dump({
        'model': model,
        'features': features
    }, os.path.join('models', 'profit_model.pkl'))
    
    joblib.dump(encoders, os.path.join('models', 'profit_encoders.pkl'))
    joblib.dump(scaler, os.path.join('models', 'profit_scaler.pkl'))
    
    print("Model 5 trained and saved.")
    
    # Trigger Evaluation
    from ml.model5_profit.evaluate import evaluate_profit_model
    evaluate_profit_model()

if __name__ == "__main__":
    from sklearn.ensemble import RandomForestRegressor # for fallback string check
    train_profit_model()
