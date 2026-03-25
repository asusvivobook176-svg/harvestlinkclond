import pandas as pd
import numpy as np
import joblib
import os
from sklearn.metrics import confusion_matrix, classification_report, mean_absolute_error, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns

def evaluate_spoilage_model():
    models_dir = 'models'
    data_path = os.path.join('data', 'spoilage_data.csv')
    
    if not os.path.exists(data_path):
        return
        
    df = pd.read_csv(data_path)
    data = joblib.load(os.path.join(models_dir, 'spoilage_model.pkl'))
    encoders = joblib.load(os.path.join(models_dir, 'spoilage_encoders.pkl'))
    scaler = joblib.load(os.path.join(models_dir, 'spoilage_scaler.pkl'))
    
    from model4_spoilage.preprocessing import preprocess_spoilage_data
    df_processed = preprocess_spoilage_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    X = df_processed[data['features']]
    y_risk_true = encoders['spoilage_risk_level'].transform(df['spoilage_risk_level'])
    y_days_true = df['estimated_days_remaining']
    
    yr_pred = data['model_risk'].predict(X)
    yd_pred = data['model_days'].predict(X)
    
    plt.figure(figsize=(15, 5))
    
    # 1. Confusion Matrix for Risk
    plt.subplot(1, 3, 1)
    cm = confusion_matrix(y_risk_true, yr_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Oranges', 
                xticklabels=encoders['spoilage_risk_level'].classes_,
                yticklabels=encoders['spoilage_risk_level'].classes_)
    plt.title('Risk Level Confusion Matrix')
    
    # 2. Actual vs Predicted Days
    plt.subplot(1, 3, 2)
    plt.scatter(y_days_true, yd_pred, alpha=0.3, color='green')
    plt.plot([y_days_true.min(), y_days_true.max()], [y_days_true.min(), y_days_true.max()], 'r--')
    plt.title('Days Remaining: Actual vs Predicted')
    plt.xlabel('Actual Days')
    plt.ylabel('Predicted Days')
    
    # 3. Feature Importance
    plt.subplot(1, 3, 3)
    importances = data['model_risk'].feature_importances_
    indices = np.argsort(importances)[-10:]
    plt.barh(range(len(indices)), importances[indices], align='center', color='lime')
    plt.yticks(range(len(indices)), [data['features'][i] for i in indices])
    plt.title('Top Feature Importances (Risk)')
    
    plt.tight_layout()
    plt.savefig(os.path.join('ml', 'model4_spoilage', 'evaluation_plot.png'))
    print(f"Evaluation plot saved to ml/model4_spoilage/evaluation_plot.png")

    # Save metrics to JSON for versioning
    import json
    with open(os.path.join(models_dir, 'spoilage_metrics.json'), 'w') as f:
        json.dump({
            "risk_accuracy": float(accuracy_score(y_risk_true, yr_pred)),
            "days_mae": float(mean_absolute_error(y_days_true, yd_pred))
        }, f)

if __name__ == "__main__":
    evaluate_spoilage_model()
