import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import LabelEncoder, StandardScaler

def preprocess_crash_data(df, is_training=True, encoders=None, scaler=None):
    cat_cols = ['vegetable_name', 'district']
    num_cols = ['current_price_rs', 'prev_week_price_rs', 'current_supply_kg', 
                'current_demand_kg', 'supply_demand_ratio', 'month', 
                'festival_next_week', 'rainfall_mm', 'num_farmers_producing', 
                'cold_storage_available']
    
    df = df.copy()
    
    # Feature Engineering: supply_demand_ratio already in data but good to re-derive if needed
    df['supply_demand_ratio'] = df['current_supply_kg'] / df['current_demand_kg']
    df['price_change_percent'] = (df['current_price_rs'] - df['prev_week_price_rs']) / df['prev_week_price_rs'] * 100
    
    num_cols.append('price_change_percent')
    
    if is_training:
        encoders = {}
        for col in cat_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            encoders[col] = le
            
        # Target encoder for severity
        le_sev = LabelEncoder()
        df['crash_severity'] = le_sev.fit_transform(df['crash_severity'])
        encoders['crash_severity'] = le_sev
        
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
    data_path = os.path.join('data', 'price_crash.csv')
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        processed_df, encoders, scaler = preprocess_crash_data(df)
        os.makedirs('models', exist_ok=True)
        joblib.dump(encoders, os.path.join('models', 'crash_encoders.pkl'))
        joblib.dump(scaler, os.path.join('models', 'crash_scaler.pkl'))
        print("Crash model preprocessing components saved.")
