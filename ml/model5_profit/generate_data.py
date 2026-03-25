import pandas as pd
import numpy as np
import os

def generate_profit_data(n_rows=1000):
    np.random.seed(42)
    
    crops = ['Rice', 'Maize', 'Tomato', 'Onion', 'Beans', 'Brinjal', 'Ladies Finger', 'Banana']
    
    data = []
    
    for _ in range(n_rows):
        land_area = np.random.uniform(0.5, 20.0)
        crop = np.random.choice(crops)
        
        # Base yield and price
        if crop == 'Rice': yield_base, price_base = 3000, 25
        elif crop == 'Maize': yield_base, price_base = 2500, 20
        elif crop == 'Tomato': yield_base, price_base = 15000, 30
        else: yield_base, price_base = 5000, 40
        
        yield_kg = yield_base * land_area * np.random.uniform(0.8, 1.2)
        selling_price = price_base * np.random.uniform(0.7, 1.3)
        
        # Costs
        fertilizer_labor = land_area * np.random.uniform(10000, 25000)
        water_cost = land_area * np.random.uniform(2000, 8000)
        labor_days = int(land_area * np.random.uniform(20, 60))
        dist = np.random.uniform(5, 100)
        
        input_costs = fertilizer_labor + water_cost + (labor_days * 500) # 500/day
        
        # Profit
        revenue = yield_kg * selling_price
        profit = revenue - input_costs
        
        data.append({
            'land_area_acres': land_area,
            'crop_type': crop,
            'yield_kg_expected': yield_kg,
            'selling_price_forecast': selling_price,
            'input_costs_fertilizer_labor': fertilizer_labor,
            'water_cost': water_cost,
            'labor_days': labor_days,
            'market_distance_km': dist,
            'target_profit_rs': profit
        })
        
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv(os.path.join('data', 'profit_data.csv'), index=False)
    print(f"Generated {n_rows} rows in data/profit_data.csv")

if __name__ == "__main__":
    generate_profit_data()
