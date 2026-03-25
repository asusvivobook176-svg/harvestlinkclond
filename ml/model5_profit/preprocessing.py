import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import LabelEncoder, StandardScaler

def preprocess_profit_data(df, is_training=True, encoders=None, scaler=None):
    cat_cols = ['crop_type']
    num_cols = ['land_area_acres', 'yield_kg_expected', 'selling_price_forecast', 
                'input_costs_fertilizer_labor', 'water_cost', 'labor_days', 'market_distance_km']
    
    df = df.copy()
    
    # Feature Engineering
    df['cost_per_acre'] = (df['input_costs_fertilizer_labor'] + df['water_cost']) / df['land_area_acres']
    df['yield_per_acre'] = df['yield_kg_expected'] / df['land_area_acres']
    
    num_cols.extend(['cost_per_acre', 'yield_per_acre'])
    
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
    data_path = os.path.join('data', 'profit_data.csv')
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        _, encoders, scaler = preprocess_profit_data(df)
        os.makedirs('models', exist_ok=True)
        joblib.dump(encoders, os.path.join('models', 'profit_encoders.pkl'))
        joblib.dump(scaler, os.path.join('models', 'profit_scaler.pkl'))
        print("Profit preprocessing components saved.")
