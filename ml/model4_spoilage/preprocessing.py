import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import LabelEncoder, StandardScaler

def preprocess_spoilage_data(df, is_training=True, encoders=None, scaler=None):
    cat_cols = ['vegetable_type', 'storage_type', 'packaging_type', 'bruising_level', 'season', 'district']
    num_cols = ['storage_temperature_celsius', 'humidity_percent', 'transport_time_hours', 
                'days_since_harvest', 'initial_quality_score']
    
    df = df.copy()
    
    # Derived Features
    # Temperature-Humidity Index (THI) simplified
    df['temperature_humidity_index'] = (df['storage_temperature_celsius'] * 0.8) + \
                                      ((df['humidity_percent'] / 100) * (df['storage_temperature_celsius'] - 14.4)) + 46.4
    
    # Storage Quality Score (Logic based on storage type)
    storage_map = {'Cold Storage': 10, 'Refrigerated Truck': 9, 'Covered Shed': 5, 'Open Air': 2}
    df['storage_quality_score'] = df['storage_type'].map(storage_map).fillna(5)
    
    num_cols.extend(['temperature_humidity_index', 'storage_quality_score'])
    
    if is_training:
        encoders = {}
        for col in cat_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            encoders[col] = le
            
        # Target encoder for risk level
        le_risk = LabelEncoder()
        df['spoilage_risk_level'] = le_risk.fit_transform(df['spoilage_risk_level'])
        encoders['spoilage_risk_level'] = le_risk
        
        scaler = StandardScaler()
        df[num_cols] = scaler.fit_transform(df[num_cols])
        
        return df, encoders, scaler
    else:
        for col in cat_cols:
            if col in df.columns:
                classes = list(encoders[col].classes_)
                df[col] = df[col].apply(lambda x: x if x in classes else classes[0])
                df[col] = encoders[col].transform(df[col])
        
        df[num_cols] = scaler.transform(df[num_cols])
        return df

if __name__ == "__main__":
    data_path = os.path.join('data', 'spoilage_data.csv')
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        _, encoders, scaler = preprocess_spoilage_data(df)
        os.makedirs('models', exist_ok=True)
        joblib.dump(encoders, os.path.join('models', 'spoilage_encoders.pkl'))
        joblib.dump(scaler, os.path.join('models', 'spoilage_scaler.pkl'))
        print("Spoilage preprocessing components saved.")
