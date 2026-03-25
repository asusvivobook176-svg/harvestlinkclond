import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from ml.model3_price_crash.preprocessing import preprocess_crash_data

def train_crash_model():
    data_path = os.path.join('data', 'price_crash.csv')
    if not os.path.exists(data_path):
        from ml.model3_price_crash.generate_data import generate_price_crash_data
        generate_price_crash_data()
        
    df = pd.read_csv(data_path)
    
    # Preprocess
    df_processed, encoders, scaler = preprocess_crash_data(df, is_training=True)
    
    features = ['vegetable_name', 'current_price_rs', 'prev_week_price_rs', 'current_supply_kg', 
                'current_demand_kg', 'supply_demand_ratio', 'month', 'festival_next_week', 
                'rainfall_mm', 'num_farmers_producing', 'cold_storage_available', 'district', 
                'price_change_percent']
    
    X = df_processed[features]
    y_crash = df['crash_alert']
    y_price = df['predicted_price_next_week']
    y_sev = df_processed['crash_severity']
    
    X_train, X_test, yc_train, yc_test, yp_train, yp_test, ys_train, ys_test = train_test_split(
        X, y_crash, y_price, y_sev, test_size=0.2, random_state=42
    )
    
    # Model 1: Crash Alert (Classifier)
    # Using class_weight='balanced' to handle potential imbalance
    model_crash = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
    model_crash.fit(X_train, yc_train)
    
    # Model 2: Price Prediction (Regressor)
    model_price = LinearRegression()
    model_price.fit(X_train, yp_train)
    
    # Model 3: Severity (Classifier)
    model_sev = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
    model_sev.fit(X_train, ys_train)
    
    # Evaluations
    yc_pred = model_crash.predict(X_test)
    print("=== Model 3: Price Crash Alert Evaluation ===")
    print(f"Accuracy:  {accuracy_score(yc_test, yc_pred):.4f}")
    print(f"Precision: {precision_score(yc_test, yc_pred):.4f}")
    print(f"Recall:    {recall_score(yc_test, yc_pred):.4f} (Crucial!)")
    print(f"F1-Score:  {f1_score(yc_test, yc_pred):.4f}")
    print(f"ROC-AUC:   {roc_auc_score(yc_test, yc_pred):.4f}")
    
    os.makedirs('models', exist_ok=True)
    joblib.dump({
        'model_crash': model_crash,
        'model_price': model_price,
        'model_sev': model_sev,
        'features': features
    }, os.path.join('models', 'price_crash_model.pkl'))
    
    joblib.dump(encoders, os.path.join('models', 'crash_encoders.pkl'))
    joblib.dump(scaler, os.path.join('models', 'crash_scaler.pkl'))
    
    print("Model 3 trained and saved.")
    
    # Trigger Evaluation Visualization
    from ml.model3_price_crash.evaluate import evaluate_crash_model
    evaluate_crash_model()

if __name__ == "__main__":
    train_crash_model()
