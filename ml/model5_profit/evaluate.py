import pandas as pd
import numpy as np
import joblib
import os
from sklearn.metrics import mean_absolute_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns

def evaluate_profit_model():
    models_dir = 'models'
    data_path = os.path.join('data', 'profit_data.csv')
    
    if not os.path.exists(data_path):
        return
        
    df = pd.read_csv(data_path)
    data = joblib.load(os.path.join(models_dir, 'profit_model.pkl'))
    encoders = joblib.load(os.path.join(models_dir, 'profit_encoders.pkl'))
    scaler = joblib.load(os.path.join(models_dir, 'profit_scaler.pkl'))
    
    from ml.model5_profit.preprocessing import preprocess_profit_data
    df_processed = preprocess_profit_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    X = df_processed[data['features']]
    y_true = df['target_profit_rs']
    y_pred = data['model'].predict(X)
    
    plt.figure(figsize=(10, 6))
    plt.scatter(y_true, y_pred, alpha=0.3, color='purple')
    plt.plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], 'r--')
    plt.title('Profit Prediction: Actual vs Predicted')
    plt.xlabel('Actual Profit (Rs)')
    plt.ylabel('Predicted Profit (Rs)')
    
    plt.tight_layout()
    plt.savefig(os.path.join('ml', 'model5_profit', 'evaluation_plot.png'))
    print(f"Evaluation plot saved to ml/model5_profit/evaluation_plot.png")

if __name__ == "__main__":
    evaluate_profit_model()
