import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from ml.model8_risk.preprocessing import preprocess_risk_data

def train_risk_model():
    data_path = os.path.join('data', 'risk_scoring.csv')
    if not os.path.exists(data_path):
        from ml.model8_risk.generate_data import generate_risk_scoring_data
        generate_risk_scoring_data()
        
    df = pd.read_csv(data_path)
    
    # Preprocess
    df_processed, encoders, scaler = preprocess_risk_data(df, is_training=True)
    
    features = ['weather_variability', 'market_volatility', 'water_scarcity', 
                'crop_price_fluctuation', 'historical_yield_instability']
    
    X = df_processed[features]
    y = df_processed['target_risk_level']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Eval
    y_pred = model.predict(X_test)
    print("=== Model 8: Risk Scoring Evaluation ===")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    
    os.makedirs('models', exist_ok=True)
    joblib.dump({
        'model': model,
        'features': features
    }, os.path.join('models', 'risk_model.pkl'))
    
    joblib.dump(encoders, os.path.join('models', 'risk_encoders.pkl'))
    joblib.dump(scaler, os.path.join('models', 'risk_scaler.pkl'))
    
    print("Model 8 trained and saved.")
    
    # Trigger Evaluation
    from ml.model8_risk.evaluate import evaluate_risk_model
    evaluate_risk_model()

if __name__ == "__main__":
    train_risk_model()
