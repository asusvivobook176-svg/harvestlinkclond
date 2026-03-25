import pandas as pd
import joblib
import os
from sklearn.preprocessing import LabelEncoder

def preprocess_data(df, is_training=True, encoders=None):
    # Categorical columns to encode
    cat_cols = ['soil_type', 'water_availability', 'irrigation_type', 'season', 
                'previous_crop', 'market_demand_level', 'district']
    
    if is_training:
        encoders = {}
        for col in cat_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].fillna('Unknown'))
            encoders[col] = le
            
        # Encode target
        le_target = LabelEncoder()
        df['recommended_crop'] = le_target.fit_transform(df['recommended_crop'])
        encoders['recommended_crop'] = le_target
        
        return df, encoders
    else:
        if encoders is None:
            raise ValueError("Encoders must be provided for inference")
        
        for col in cat_cols:
            if col in df.columns:
                classes = list(encoders[col].classes_)
                if col == 'irrigation_type':
                    df[col] = df[col].replace({'Drip': 'Borewell', 'Flood': 'Canal', 'Rain-fed': 'Rainfed', 'Rain-Fed': 'Rainfed'})
                
                # Safely handle any remaining unseen labels by defaulting to the first known class
                df[col] = df[col].apply(lambda x: x if x in classes else classes[0])
                df[col] = encoders[col].transform(df[col])
        
        return df

if __name__ == "__main__":
    # Test preprocessing
    data_path = os.path.join('data', 'crops_dataset.csv')
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        processed_df, encoders = preprocess_data(df)
        print("Preprocessing successful.")
        os.makedirs('models', exist_ok=True)
        joblib.dump(encoders, os.path.join('models', 'crop_encoders.pkl'))
        print("Encoders saved to models/crop_encoders.pkl")
