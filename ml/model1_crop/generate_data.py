import pandas as pd
import numpy as np
import os

def generate_crop_dataset(n_rows=1200):
    np.random.seed(42)
    
    districts = ['Salem', 'Coimbatore', 'Madurai', 'Chennai', 'Trichy', 'Tirunelveli', 'Vellore', 'Erode']
    soil_types = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red']
    water_levels = ['High', 'Medium', 'Low']
    irrigation_types = ['Borewell', 'Canal', 'Rainfed', 'Tank']
    seasons = ['Kharif', 'Rabi', 'Summer']
    demand_levels = ['High', 'Medium', 'Low']
    
    crops = ['Rice', 'Maize', 'Tomato', 'Onion', 'Beans', 'Brinjal', 'Ladies Finger', 'Banana']
    
    data = []
    
    for _ in range(n_rows):
        land_area = np.random.uniform(0.5, 20.0)
        soil = np.random.choice(soil_types)
        water = np.random.choice(water_levels)
        irrigation = np.random.choice(irrigation_types)
        rainfall = np.random.uniform(300, 2000)
        temp = np.random.uniform(20, 42)
        humidity = np.random.uniform(40, 95)
        season = np.random.choice(seasons)
        prev_crop = np.random.choice(crops + ['None'])
        demand = np.random.choice(demand_levels)
        district = np.random.choice(districts)
        
        # Add noise and more conditions for a realistic dataset
        if water == 'High' and rainfall > 900 and season == 'Kharif':
            recommended = 'Rice'
        elif temp > 30 and water == 'Low' and soil in ['Sandy', 'Red']:
            recommended = 'Maize'
        elif soil == 'Black' and temp < 32 and season == 'Rabi':
            recommended = 'Tomato'
        elif soil == 'Red' and water in ['Medium', 'High'] and season == 'Summer':
            recommended = 'Banana'
        elif season == 'Summer' and temp > 28 and soil in ['Loamy', 'Black']:
            recommended = 'Ladies Finger'
        elif season == 'Rabi' and water == 'Medium' and soil == 'Red':
            recommended = 'Onion'
        elif soil == 'Loamy' and rainfall > 500:
            recommended = 'Beans'
        else:
            recommended = 'Brinjal'
            
        # Introduce randomness
        if np.random.rand() < 0.15:
            recommended = np.random.choice(crops)
            
        data.append({
            'land_area': land_area,
            'soil_type': soil,
            'water_availability': water,
            'irrigation_type': irrigation,
            'rainfall_mm': rainfall,
            'temperature_celsius': temp,
            'humidity_percent': humidity,
            'season': season,
            'previous_crop': prev_crop,
            'market_demand_level': demand,
            'district': district,
            'recommended_crop': recommended
        })
        
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv(os.path.join('data', 'crops_dataset.csv'), index=False)
    print(f"Generated {n_rows} rows in data/crops_dataset.csv")

if __name__ == "__main__":
    generate_crop_dataset()
