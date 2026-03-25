import pandas as pd
import numpy as np
import os

def generate_failure_data(n_rows=1000):
    np.random.seed(42)
    
    crops = ['Rice', 'Maize', 'Tomato', 'Onion', 'Beans', 'Brinjal', 'Ladies Finger', 'Banana']
    irrigation_types = ['Borewell', 'Canal', 'Rainfed', 'Tank']
    
    data = []
    
    for _ in range(n_rows):
        crop = np.random.choice(crops)
        irrigation = np.random.choice(irrigation_types)
        rainfall = np.random.uniform(100, 1500)
        moisture = np.random.uniform(10, 80)
        temp = np.random.uniform(25, 45)
        experience = np.random.randint(1, 40)
        
        # Failure logic
        failure_prob = 0.1
        if rainfall < 300: failure_prob += 0.4
        if moisture < 20: failure_prob += 0.3
        if temp > 40: failure_prob += 0.2
        if experience < 5: failure_prob += 0.1
        if irrigation == 'Rainfed' and rainfall < 500: failure_prob += 0.4
        
        failure_prob = min(0.9, failure_prob)
        failure = 1 if np.random.rand() < failure_prob else 0
        
        # Risk levels
        if failure_prob > 0.7: risk = 'High'
        elif failure_prob > 0.3: risk = 'Medium'
        else: risk = 'Low'
        
        data.append({
            'rainfall_mm': rainfall,
            'soil_moisture_pct': moisture,
            'temperature_avg': temp,
            'crop_type': crop,
            'sowing_date': (datetime(2024, 1, 1) + timedelta(days=np.random.randint(0, 365))).strftime('%Y-%m-%d'),
            'farmer_experience_years': experience,
            'irrigation_type': irrigation,
            'target_failure': failure,
            'risk_level': risk
        })
        
    from datetime import datetime, timedelta
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv(os.path.join('data', 'crop_failure.csv'), index=False)
    print(f"Generated {n_rows} rows in data/crop_failure.csv")

if __name__ == "__main__":
    generate_failure_data()
