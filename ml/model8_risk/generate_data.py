import pandas as pd
import numpy as np
import os

def generate_risk_scoring_data(n_rows=1000):
    np.random.seed(42)
    
    data = []
    for _ in range(n_rows):
        weather_var = np.random.uniform(0, 100)
        market_vol = np.random.uniform(0, 100)
        water_scarcity = np.random.uniform(0, 100)
        price_fluct = np.random.uniform(0, 100)
        yield_instability = np.random.uniform(0, 100)
        
        # Overall Risk Score
        score = (weather_var + market_vol + water_scarcity + price_fluct + yield_instability) / 5
        
        if score > 70: risk = 'High'
        elif score > 30: risk = 'Medium'
        else: risk = 'Low'
        
        data.append({
            'weather_variability': weather_var,
            'market_volatility': market_vol,
            'water_scarcity': water_scarcity,
            'crop_price_fluctuation': price_fluct,
            'historical_yield_instability': yield_instability,
            'risk_score': score,
            'target_risk_level': risk
        })
        
    df = pd.DataFrame(data)
    os.makedirs('data', exist_ok=True)
    df.to_csv(os.path.join('data', 'risk_scoring.csv'), index=False)
    print(f"Generated {n_rows} rows in data/risk_scoring.csv")

if __name__ == "__main__":
    generate_risk_scoring_data()
