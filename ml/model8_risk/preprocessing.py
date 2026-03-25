import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import LabelEncoder, StandardScaler

def preprocess_risk_data(df, is_training=True, encoders=None, scaler=None):
    num_cols = ['weather_variability', 'market_volatility', 'water_scarcity', 
                'crop_price_fluctuation', 'historical_yield_instability']
    
    df = df.copy()
    
    if is_training:
        encoders = {}
        le = LabelEncoder()
        df['target_risk_level'] = le.fit_transform(df['target_risk_level'])
        encoders['target_risk_level'] = le
        
        scaler = StandardScaler()
        df[num_cols] = scaler.fit_transform(df[num_cols])
        
        return df, encoders, scaler
    else:
        df[num_cols] = scaler.transform(df[num_cols])
        return df

if __name__ == "__main__":
    data_path = os.path.join('data', 'risk_scoring.csv')
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        _, encoders, scaler = preprocess_risk_data(df)
        os.makedirs('models', exist_ok=True)
        joblib.dump(encoders, os.path.join('models', 'risk_encoders.pkl'))
        joblib.dump(scaler, os.path.join('models', 'risk_scaler.pkl'))
