import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import LabelEncoder, StandardScaler

def preprocess_yield_data(df, is_training=True, encoders=None, scaler=None):
    cat_cols = ['soil_type', 'water_availability', 'crop_type']
    num_cols = ['rainfall', 'fertilizer_usage', 'temperature']
    
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
    data_path = os.path.join('data', 'yield_data.csv')
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        _, encoders, scaler = preprocess_yield_data(df)
        os.makedirs('models', exist_ok=True)
        joblib.dump(encoders, os.path.join('models', 'yield_encoders.pkl'))
        joblib.dump(scaler, os.path.join('models', 'yield_scaler.pkl'))
        print("Yield preprocessing components saved.")
