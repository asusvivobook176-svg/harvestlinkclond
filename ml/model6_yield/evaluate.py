import pandas as pd
import numpy as np
import joblib
import os
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

def evaluate_yield_model():
    models_dir = 'models'
    data_path = os.path.join('data', 'yield_data.csv')
    
    if not os.path.exists(data_path):
        return
        
    df = pd.read_csv(data_path)
    data = joblib.load(os.path.join(models_dir, 'yield_model.pkl'))
    encoders = joblib.load(os.path.join(models_dir, 'yield_encoders.pkl'))
    scaler = joblib.load(os.path.join(models_dir, 'yield_scaler.pkl'))
    
    from ml.model6_yield.preprocessing import preprocess_yield_data
    df_processed = preprocess_yield_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    X = df_processed[data['features']]
    y_true = df['target_yield_kg']
    y_pred = data['model'].predict(X)
    
    plt.figure(figsize=(10, 6))
    plt.scatter(y_true, y_pred, alpha=0.3, color='teal')
    plt.plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], 'r--')
    plt.title('Yield Prediction: Actual vs Predicted')
    plt.xlabel('Actual Yield (kg)')
    plt.ylabel('Predicted Yield (kg)')
    
    plt.tight_layout()
    plt.savefig(os.path.join('ml', 'model6_yield', 'evaluation_plot.png'))
    print(f"Evaluation plot saved to ml/model6_yield/evaluation_plot.png")

if __name__ == "__main__":
    evaluate_yield_model()
