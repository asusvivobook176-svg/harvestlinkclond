import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from ml.model6_yield.preprocessing import preprocess_yield_data

def train_yield_model():
    data_path = os.path.join('data', 'yield_data.csv')
    if not os.path.exists(data_path):
        from ml.model6_yield.generate_data import generate_yield_data
        generate_yield_data()
        
    df = pd.read_csv(data_path)
    
    # Preprocess
    df_processed, encoders, scaler = preprocess_yield_data(df, is_training=True)
    
    features = ['soil_type', 'rainfall', 'water_availability', 'fertilizer_usage', 'temperature', 'crop_type']
    
    X = df_processed[features]
    y = df['target_yield_kg']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Eval
    y_pred = model.predict(X_test)
    print("=== Model 6: Yield Prediction Evaluation ===")
    print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f} kg")
    print(f"R2  : {r2_score(y_test, y_pred):.4f}")
    
    os.makedirs('models', exist_ok=True)
    joblib.dump({
        'model': model,
        'features': features
    }, os.path.join('models', 'yield_model.pkl'))
    
    joblib.dump(encoders, os.path.join('models', 'yield_encoders.pkl'))
    joblib.dump(scaler, os.path.join('models', 'yield_scaler.pkl'))
    
    print("Model 6 trained and saved.")
    
    # Trigger evaluation
    from ml.model6_yield.evaluate import evaluate_yield_model
    evaluate_yield_model()

if __name__ == "__main__":
    train_yield_model()
