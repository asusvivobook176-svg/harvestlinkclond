import pandas as pd
import numpy as np
import joblib
import os
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt

def evaluate_demand_model():
    models_dir = 'models'
    data_path = os.path.join('data', 'market_demand.csv')
    
    if not os.path.exists(data_path):
        print("Data not found.")
        return
        
    df = pd.read_csv(data_path)
    reg_data = joblib.load(os.path.join(models_dir, 'demand_regression_models.pkl'))
    encoders = joblib.load(os.path.join(models_dir, 'demand_encoders.pkl'))
    scaler = joblib.load(os.path.join(models_dir, 'demand_scaler.pkl'))
    
    from model2_demand.preprocessing import preprocess_demand_data
    df_processed = preprocess_demand_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    X = df_processed[reg_data['features']]
    y_d_true = df['target_next_week_demand_kg']
    y_p_true = df['predicted_price_rs']
    
    d_pred = reg_data['rf_demand'].predict(X)
    p_pred = reg_data['lr_price'].predict(X)
    
    print("\n=== Model 2: Demand & Price Evaluation (Regression) ===")
    print(f"Demand RMSE: {np.sqrt(mean_squared_error(y_d_true, d_pred)):.2f}")
    print(f"Demand MAE:  {mean_absolute_error(y_d_true, d_pred):.2f}")
    print(f"Demand R2:   {r2_score(y_d_true, d_pred):.4f}")
    
    print(f"Price RMSE:  {np.sqrt(mean_squared_error(y_p_true, p_pred)):.2f}")
    print(f"Price MAE:   {mean_absolute_error(y_p_true, p_pred):.2f}")
    print(f"Price R2:    {r2_score(y_p_true, p_pred):.4f}")
    
    # Plotting
    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    plt.scatter(y_d_true, d_pred, alpha=0.3)
    plt.plot([y_d_true.min(), y_d_true.max()], [y_d_true.min(), y_d_true.max()], 'r--')
    plt.title('Demand: Actual vs Predicted')
    plt.xlabel('Actual (kg)')
    plt.ylabel('Predicted (kg)')
    
    plt.subplot(1, 2, 2)
    plt.scatter(y_p_true, p_pred, alpha=0.3, color='orange')
    plt.plot([y_p_true.min(), y_p_true.max()], [y_p_true.min(), y_p_true.max()], 'r--')
    plt.title('Price: Actual vs Predicted')
    plt.xlabel('Actual (Rs)')
    plt.ylabel('Predicted (Rs)')
    
    plt.tight_layout()
    plt.savefig(os.path.join('ml', 'model2_demand', 'evaluation_plot.png'))
    print(f"Evaluation plot saved to ml/model2_demand/evaluation_plot.png")

    # Save metrics to JSON for versioning
    import json
    with open(os.path.join(models_dir, 'demand_metrics.json'), 'w') as f:
        json.dump({
            "demand_rmse": float(np.sqrt(mean_squared_error(y_d_true, d_pred))),
            "demand_mae": float(mean_absolute_error(y_d_true, d_pred)),
            "demand_r2": float(r2_score(y_d_true, d_pred)),
            "price_rmse": float(np.sqrt(mean_squared_error(y_p_true, p_pred))),
            "price_mae": float(mean_absolute_error(y_p_true, p_pred)),
            "price_r2": float(r2_score(y_p_true, p_pred))
        }, f)

if __name__ == "__main__":
    evaluate_demand_model()
