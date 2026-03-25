import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from .preprocessing import preprocess_demand_data, create_sequences

try:
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense, Dropout
    HAS_TF = True
except ImportError:
    HAS_TF = False

def train_demand_model():
    # Dynamic hyperparameters from environment variables
    epochs_val = int(os.getenv("ML_EPOCHS", 10))
    batch_size_val = int(os.getenv("ML_BATCH_SIZE", 32))
    lr_val = float(os.getenv("ML_LEARNING_RATE", 0.001))
    
    print(f"Training Model 2 LSTM with Epochs={epochs_val}, BatchSize={batch_size_val}, LR={lr_val}")

    data_path = os.path.join('data', 'market_demand.csv')
    if not os.path.exists(data_path):
        from model2_demand.generate_data import generate_demand_data
        generate_demand_data()
        
    df = pd.read_csv(data_path)
    df_processed, encoders, scaler = preprocess_demand_data(df, is_training=True)
    
    features = ['vegetable_name', 'month', 'year', 'prev_month_demand_kg', 'prev_month_price_rs', 
                'festival_week', 'school_holiday', 'season', 'city', 'rainfall_mm', 
                'temperature_celsius', 'supply_volume_kg']
    
    X = df_processed[features]
    y_demand_target = df['target_next_week_demand_kg']
    y_price_target = df['predicted_price_rs']
    
    # Regression models for legacy support and evaluation
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.linear_model import LinearRegression
    X_train_r, X_test_r, y_d_train, y_d_test, y_p_train, y_p_test = train_test_split(
        X, y_demand_target, y_price_target, test_size=0.2, random_state=42
    )
    
    rf_demand = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_demand.fit(X_train_r, y_d_train)
    
    lr_price = LinearRegression()
    lr_price.fit(X_train_r, y_p_train)
    
    joblib.dump({
        'rf_demand': rf_demand,
        'lr_price': lr_price,
        'features': features
    }, os.path.join('models', 'demand_regression_models.pkl'))

    # LSTM Sequences
    # We need the vegetable_name and city preserved for grouping in create_sequences
    X_seq, y_seq = create_sequences(df_processed, features, 'target_next_week_demand_kg', 30)
    X_train, X_test, y_train, y_test = train_test_split(X_seq, y_seq, test_size=0.2, random_state=42)
    
    if HAS_TF:
        model = Sequential([
            LSTM(64, activation='relu', input_shape=(30, X_seq.shape[2]), return_sequences=True),
            Dropout(0.2),
            LSTM(32, activation='relu'),
            Dense(1)
        ])
        optimizer = tf.keras.optimizers.Adam(learning_rate=lr_val)
        model.compile(optimizer=optimizer, loss='mse')
        
        print("Starting LSTM training...")
        model.fit(X_train, y_train, epochs=epochs_val, batch_size=batch_size_val, 
                  validation_split=0.1, verbose=1)
        
        os.makedirs('models', exist_ok=True)
        model.save(os.path.join('models', 'demand_lstm_model.h5'))
        print("Model 2 LSTM trained and saved.")
        
    joblib.dump(encoders, os.path.join('models', 'demand_encoders.pkl'))
    joblib.dump(scaler, os.path.join('models', 'demand_scaler.pkl'))
    
    # Trigger Evaluation
    from model2_demand.evaluate import evaluate_demand_model
    evaluate_demand_model()

if __name__ == "__main__":
    train_demand_model()
