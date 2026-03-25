import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from ml.model7_failure.preprocessing import preprocess_failure_data

# For Class Imbalance and Stacking
try:
    from imblearn.over_sampling import SMOTE
    HAS_SMOTE = True
except ImportError:
    HAS_SMOTE = False

def train_failure_model():
    data_path = os.path.join('data', 'crop_failure.csv')
    if not os.path.exists(data_path):
        from ml.model7_failure.generate_data import generate_failure_data
        generate_failure_data()
        
    df = pd.read_csv(data_path)
    
    # Preprocess
    df_processed, encoders, scaler = preprocess_failure_data(df, is_training=True)
    
    features = ['rainfall_mm', 'soil_moisture_pct', 'temperature_avg', 'crop_type', 
                'farmer_experience_years', 'irrigation_type']
    
    X = df_processed[features]
    y = df['target_failure']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    if HAS_SMOTE:
        smote = SMOTE(random_state=42)
        X_train, y_train = smote.fit_resample(X_train, y_train)
        print("SMOTE applied to handle class imbalance.")
        
    # Model 1: Binary Failure (Classifier)
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)
    
    # Eval
    y_pred = model.predict(X_test)
    print("=== Model 7: Crop Failure Evaluation ===")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))
    
    os.makedirs('models', exist_ok=True)
    joblib.dump({
        'model': model,
        'features': features
    }, os.path.join('models', 'failure_model.pkl'))
    
    joblib.dump(encoders, os.path.join('models', 'failure_encoders.pkl'))
    joblib.dump(scaler, os.path.join('models', 'failure_scaler.pkl'))
    
    print("Model 7 trained and saved.")
    
    # Trigger Evaluation
    from ml.model7_failure.evaluate import evaluate_failure_model
    evaluate_failure_model()

if __name__ == "__main__":
    train_failure_model()
