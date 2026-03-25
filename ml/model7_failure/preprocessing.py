import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import LabelEncoder, StandardScaler

def preprocess_failure_data(df, is_training=True, encoders=None, scaler=None):
    cat_cols = ['crop_type', 'irrigation_type']
    num_cols = ['rainfall_mm', 'soil_moisture_pct', 'temperature_avg', 'farmer_experience_years']
    
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
        for col in cat_cols:
            df[col] = encoders[col].transform(df[col])
        df[num_cols] = scaler.transform(df[num_cols])
        return df

if __name__ == "__main__":
    data_path = os.path.join('data', 'crop_failure.csv')
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        _, encoders, scaler = preprocess_failure_data(df)
        os.makedirs('models', exist_ok=True)
        joblib.dump(encoders, os.path.join('models', 'failure_encoders.pkl'))
        joblib.dump(scaler, os.path.join('models', 'failure_scaler.pkl'))
