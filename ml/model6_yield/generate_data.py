import pandas as pd
import numpy as np
import os

def generate_yield_data(n_rows=1000):
    np.random.seed(42)
    
    crops = ['Rice', 'Maize', 'Tomato', 'Onion', 'Beans', 'Brinjal', 'Ladies Finger', 'Banana']
    soil_types = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red']
    water_levels = ['High', 'Medium', 'Low']
    
    data = []
    
    for _ in range(n_rows):
        crop = np.random.choice(crops)
        soil = np.random.choice(soil_types)
        water = np.random.choice(water_levels)
        rainfall = np.random.uniform(300, 2000)
        temp = np.random.uniform(20, 42)
        fertilizer = np.random.uniform(50, 300) # kg per acre
        
        # Base yield calc
        if crop == 'Rice': base = 2500
        elif crop == 'Maize': base = 2000
        elif crop == 'Tomato': base = 12000
        else: base = 4000
        
        # Multipliers
        mult = 1.0
        if soil == 'Loamy': mult *= 1.2
        if water == 'High': mult *= 1.15
        if 25 < temp < 32: mult *= 1.1
        mult *= (1 + (fertilizer - 150)/1000)
        
        yield_kg = base * mult * np.random.uniform(0.9, 1.1)
        
        data.append({
            'soil_type': soil,
            'rainfall': rainfall,
            'water_availability': water,
            'fertilizer_usage': fertilizer,
            'temperature': temp,
            'crop_type': crop,
            'target_yield_kg': yield_kg
        })
        
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv(os.path.join('data', 'yield_data.csv'), index=False)
    print(f"Generated {n_rows} rows in data/yield_data.csv")

if __name__ == "__main__":
    generate_yield_data()
