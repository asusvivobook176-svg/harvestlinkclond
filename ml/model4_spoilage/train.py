import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import classification_report, mean_absolute_error, accuracy_score
from .preprocessing import preprocess_spoilage_data

def train_spoilage_model():
    # Dynamic hyperparameters from environment variables
    epochs = int(os.getenv("ML_EPOCHS", 10))
    batch_size = int(os.getenv("ML_BATCH_SIZE", 32))
    lr = float(os.getenv("ML_LEARNING_RATE", 0.001))
    
    print(f"Training Model 4 with Epochs={epochs}, BatchSize={batch_size}, LR={lr}")

    data_path = os.path.join('data', 'spoilage_data.csv')
    if not os.path.exists(data_path):
        from model4_spoilage.generate_data import generate_spoilage_data
        generate_spoilage_data()
        
    df = pd.read_csv(data_path)
    
    # Preprocess
    df_processed, encoders, scaler = preprocess_spoilage_data(df, is_training=True)
    
    features = ['vegetable_type', 'storage_temperature_celsius', 'humidity_percent', 
                'transport_time_hours', 'days_since_harvest', 'storage_type', 
                'packaging_type', 'bruising_level', 'initial_quality_score', 
                'season', 'district', 'temperature_humidity_index', 'storage_quality_score']
    
    X = df_processed[features]
    y_risk = df_processed['spoilage_risk_level']
    y_days = df['estimated_days_remaining']
    
    X_train, X_test, yr_train, yr_test, yd_train, yd_test = train_test_split(
        X, y_risk, y_days, test_size=0.2, random_state=42
    )
    
    # Classifier for risk level (simulating epochs with n_estimators)
    model_risk = RandomForestClassifier(n_estimators=epochs * 10, random_state=42)
    model_risk.fit(X_train, yr_train)
    
    # Regressor for days remaining
    model_days = RandomForestRegressor(n_estimators=epochs * 10, random_state=42)
    model_days.fit(X_train, yd_train)
    
    # Evaluations
    yr_pred = model_risk.predict(X_test)
    yd_pred = model_days.predict(X_test)
    
    print("=== Model 4: Spoilage Risk Evaluation ===")
    print(f"Risk Accuracy: {accuracy_score(yr_test, yr_pred):.4f}")
    print(f"Days MAE:      {mean_absolute_error(yd_test, yd_pred):.2f} days")
    
    os.makedirs('models', exist_ok=True)
    joblib.dump({
        'model_risk': model_risk,
        'model_days': model_days,
        'features': features
    }, os.path.join('models', 'spoilage_model.pkl'))
    
    joblib.dump(encoders, os.path.join('models', 'spoilage_encoders.pkl'))
    joblib.dump(scaler, os.path.join('models', 'spoilage_scaler.pkl'))
    
    print("Model 4 trained and saved.")
    
    # Trigger Evaluation
    from model4_spoilage.evaluate import evaluate_spoilage_model
    evaluate_spoilage_model()

if __name__ == "__main__":
    train_spoilage_model()
