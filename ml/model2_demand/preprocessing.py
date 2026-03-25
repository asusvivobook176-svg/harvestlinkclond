import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import LabelEncoder, StandardScaler

def preprocess_demand_data(df, is_training=True, encoders=None, scaler=None):
    cat_cols = ['vegetable_name', 'season', 'city']
    num_cols = ['month', 'year', 'prev_month_demand_kg', 'prev_month_price_rs', 
                'festival_week', 'school_holiday', 'rainfall_mm', 
                'temperature_celsius', 'supply_volume_kg']
    
    df = df.copy()
    
    if is_training:
        encoders = {}
        for col in cat_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            encoders[col] = le
            
        scaler = StandardScaler()
        df[num_cols] = scaler.fit_transform(df[num_cols])
        
        return df, encoders, scaler
    else:
        if encoders is None or scaler is None:
            raise ValueError("Encoders and Scaler must be provided for inference")
        
        for col in cat_cols:
            df[col] = encoders[col].transform(df[col])
            
        df[num_cols] = scaler.transform(df[num_cols])
        return df

def create_sequences(df, features, target_col, seq_length=30):
    # This is specifically for LSTM: creating sequences per (veg, city) group
    # to avoid mixing data between different segments.
    X, y = [], []
    
    # Ensure data is sorted for time-series integrity
    if 'date' in df.columns:
        df = df.sort_values('date')
        
    for (veg, city), group in df.groupby(['vegetable_name', 'city']):
        values = group[features].values
        targets = group[target_col].values
        
        if len(values) > seq_length:
            for i in range(len(values) - seq_length):
                X.append(values[i : i + seq_length])
                y.append(targets[i + seq_length])
            
    return np.array(X), np.array(y)

if __name__ == "__main__":
    data_path = os.path.join('data', 'market_demand.csv')
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        processed_df, encoders, scaler = preprocess_demand_data(df)
        os.makedirs('models', exist_ok=True)
        joblib.dump(encoders, os.path.join('models', 'demand_encoders.pkl'))
        joblib.dump(scaler, os.path.join('models', 'demand_scaler.pkl'))
        print("Preprocessing components saved.")
