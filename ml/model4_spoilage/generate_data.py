import pandas as pd
import numpy as np
import os

def generate_spoilage_data(n_rows=2000):
    np.random.seed(42)
    
    vegs = ['Tomato', 'Leafy Greens', 'Beans', 'Brinjal', 'Okra', 'Onion', 'Carrot', 'Drumstick']
    storage_types = ['Open Air', 'Cold Storage', 'Covered Shed', 'Refrigerated Truck']
    packaging_types = ['Loose', 'Jute Bag', 'Plastic Crate', 'Cardboard Box']
    bruising_levels = ['None', 'Minor', 'Severe']
    districts = ['Salem', 'Madurai', 'Chennai', 'Coimbatore']
    seasons = ['Summer', 'Monsoon', 'Winter']
    
    data = []
    
    for _ in range(n_rows):
        veg = np.random.choice(vegs)
        storage = np.random.choice(storage_types)
        pkg = np.random.choice(packaging_types)
        bruise = np.random.choice(bruising_levels)
        dist = np.random.choice(districts)
        season = np.random.choice(seasons)
        
        # Base days remaining
        if veg == 'Onion': base_days = np.random.uniform(20, 60)
        elif veg == 'Leafy Greens': base_days = np.random.uniform(1, 4)
        elif veg == 'Tomato': base_days = np.random.uniform(3, 7)
        else: base_days = np.random.uniform(5, 12)
        
        # Temp/Humidity
        if season == 'Summer':
            temp = np.random.uniform(30, 42)
            hum = np.random.uniform(30, 60)
        else:
            temp = np.random.uniform(20, 30)
            hum = np.random.uniform(60, 95)
            
        # Storage Effect
        if storage == 'Cold Storage' or storage == 'Refrigerated Truck':
            temp = np.random.uniform(2, 6)
            base_days *= 2.5
        elif storage == 'Open Air' and season == 'Summer':
            base_days *= 0.6
            
        transport_time = np.random.uniform(1, 48)
        days_since_harvest = np.random.randint(0, 5)
        
        # Quality score
        initial_score = np.random.uniform(7, 10)
        
        # Final days remaining calc
        days_rem = base_days - days_since_harvest - (transport_time / 24)
        if bruise == 'Severe': days_rem *= 0.5
        elif bruise == 'Minor': days_rem *= 0.8
        
        days_rem = max(0, days_rem)
        
        # Risk level
        if days_rem < 2: risk = 'High'
        elif days_rem < 5: risk = 'Medium'
        else: risk = 'Low'
        
        # Recommended action
        if risk == 'High' and days_rem < 1: action = 'Send to Compost'
        elif risk == 'High': action = 'Donate to Food Bank'
        elif risk == 'Medium': action = 'Sell Immediately'
        else: action = 'Safe to Store'
        
        data.append({
            'vegetable_type': veg,
            'storage_temperature_celsius': temp,
            'humidity_percent': hum,
            'transport_time_hours': transport_time,
            'days_since_harvest': days_since_harvest,
            'storage_type': storage,
            'packaging_type': pkg,
            'bruising_level': bruise,
            'initial_quality_score': initial_score,
            'season': season,
            'district': dist,
            'spoilage_risk_level': risk,
            'estimated_days_remaining': int(days_rem),
            'recommended_action': action
        })
        
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv(os.path.join('data', 'spoilage_data.csv'), index=False)
    print(f"Generated {n_rows} rows in data/spoilage_data.csv")

if __name__ == "__main__":
    generate_spoilage_data()
