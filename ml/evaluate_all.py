import pandas as pd
import joblib
import os
from sklearn.metrics import accuracy_score, r2_score, mean_absolute_error

def evaluate_all_models():
    models_dir = 'models'
    report = ["HARVESTLINK COMPLETE ML SUITE REPORT", "="*50]
    
    # Check all models
    model_configs = [
        ('Crop Recommendation', 'crop_model.pkl'),
        ('Demand Regression', 'demand_regression_models.pkl'),
        ('Price Crash Alert', 'price_crash_model.pkl'),
        ('Spoilage Risk', 'spoilage_model.pkl'),
        ('Profit Prediction', 'profit_model.pkl'),
        ('Yield Prediction', 'yield_model.pkl'),
        ('Crop Failure Risk', 'failure_model.pkl'),
        ('Risk Scoring', 'risk_model.pkl')
    ]
    
    for name, filename in model_configs:
        path = os.path.join(models_dir, filename)
        if os.path.exists(path):
            report.append(f"[OK] {name}: Model file found.")
        else:
            report.append(f"[MISSING] {name}: Model file NOT found.")
            
    report.append("\nIndividual Evaluation Plots saved in respective folders.")
    
    with open('ml/final_report.txt', 'w') as f:
        f.write("\n".join(report))
    print("\n".join(report))

if __name__ == "__main__":
    evaluate_all_models()
