import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from .preprocessing import preprocess_data

def train_crop_model():
    # Dynamic hyperparameters from environment variables
    epochs = int(os.getenv("ML_EPOCHS", 10))
    batch_size = int(os.getenv("ML_BATCH_SIZE", 32))
    lr = float(os.getenv("ML_LEARNING_RATE", 0.001))
    
    print(f"Training Model 1 with Epochs={epochs}, BatchSize={batch_size}, LR={lr}")
    
    data_path = os.path.join('data', 'crops_dataset.csv')
    if not os.path.exists(data_path):
        from ml.model1_crop.generate_data import generate_crop_dataset
        generate_crop_dataset()
        
    df = pd.read_csv(data_path)
    df_processed, encoders = preprocess_data(df, is_training=True)
    
    features = ['land_area', 'soil_type', 'water_availability', 'irrigation_type', 
                'rainfall_mm', 'temperature_celsius', 'humidity_percent', 
                'season', 'previous_crop', 'market_demand_level', 'district']
    
    X = df_processed[features]
    y = df_processed['recommended_crop']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # RandomForest doesn't use epochs/lr like SGD/Adam, but we can simulate it for the demo
    # or just use them to set n_estimators or other params.
    model = RandomForestClassifier(n_estimators=epochs * 10, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    print(f"Model 1 trained. Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, os.path.join('models', 'crop_model.pkl'))
    joblib.dump(encoders, os.path.join('models', 'crop_encoders.pkl'))
    
    # Trigger Evaluation
    try:
        from ml.model1_crop.evaluate import evaluate_crop_model
        evaluate_crop_model()
    except Exception as e:
        print(f"Evaluation failed: {e}")

if __name__ == "__main__":
    train_crop_model()
