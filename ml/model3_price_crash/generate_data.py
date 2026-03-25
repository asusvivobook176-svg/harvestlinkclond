import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_price_crash_data(n_rows=1500):
    np.random.seed(42)
    
    vegetables = ['Tomato', 'Onion', 'Brinjal', 'Beans', 'Okra', 'Carrot', 'Greens', 'Drumstick']
    districts = ['Salem', 'Madurai', 'Chennai', 'Coimbatore', 'Trichy']
    
    data = []
    
    for _ in range(n_rows):
        veg = np.random.choice(vegetables)
        dist = np.random.choice(districts)
        month = np.random.randint(1, 13)
        
        # Base price
        current_price = np.random.uniform(10, 80)
        prev_week_price = current_price * np.random.uniform(0.8, 1.2)
        
        # Supply/Demand
        demand = np.random.uniform(1000, 5000)
        # Crash scenarios: High supply, low demand
        # Make crashes more common for Tomato and some other cases
        if (veg == 'Tomato' and np.random.rand() > 0.4) or (np.random.rand() > 0.7):
            supply = demand * np.random.uniform(1.8, 3.5) # Heavy Oversupply
        else:
            supply = demand * np.random.uniform(0.7, 1.1)
            
        ratio = supply / demand
        
        # Festival next week
        fest = 1 if np.random.rand() > 0.85 else 0
        
        # Other features
        rainfall = np.random.uniform(0, 200)
        farmers = np.random.randint(50, 500)
        cold_storage = 1 if np.random.rand() > 0.5 else 0
        
        # Target calculation (Price drop)
        # Definition: Crash if > 40% drop
        price_drop_pct = (ratio * 10) + (rainfall / 10) - (fest * 20) + np.random.normal(0, 5)
        # Clip drop pct to 0-100
        price_drop_pct = np.clip(price_drop_pct, 0, 100)
        
        crash_alert = 1 if price_drop_pct > 40 else 0
        
        # Next week price
        predicted_price = current_price * (1 - (price_drop_pct / 100))
        
        # Severity
        if price_drop_pct > 60: severity = 'Severe'
        elif price_drop_pct > 40: severity = 'Mild'
        else: severity = 'None'
        
        data.append({
            'vegetable_name': veg,
            'current_price_rs': current_price,
            'prev_week_price_rs': prev_week_price,
            'current_supply_kg': supply,
            'current_demand_kg': demand,
            'supply_demand_ratio': ratio,
            'month': month,
            'festival_next_week': fest,
            'rainfall_mm': rainfall,
            'num_farmers_producing': farmers,
            'cold_storage_available': cold_storage,
            'district': dist,
            'price_drop_pct': price_drop_pct, # For internal use
            'crash_alert': crash_alert,
            'predicted_price_next_week': predicted_price,
            'crash_severity': severity
        })
        
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv(os.path.join('data', 'price_crash.csv'), index=False)
    print(f"Generated {n_rows} rows in data/price_crash.csv")

if __name__ == "__main__":
    generate_price_crash_data()
