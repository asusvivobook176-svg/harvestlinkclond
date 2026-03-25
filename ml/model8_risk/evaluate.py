import pandas as pd
import numpy as np
import joblib
import os
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

def evaluate_risk_model():
    models_dir = 'models'
    data_path = os.path.join('data', 'risk_scoring.csv')
    
    if not os.path.exists(data_path):
        return
        
    df = pd.read_csv(data_path)
    data = joblib.load(os.path.join(models_dir, 'risk_model.pkl'))
    encoders = joblib.load(os.path.join(models_dir, 'risk_encoders.pkl'))
    scaler = joblib.load(os.path.join(models_dir, 'risk_scaler.pkl'))
    
    from ml.model8_risk.preprocessing import preprocess_risk_data
    df_processed = preprocess_risk_data(df, is_training=False, encoders=None, scaler=scaler)
    
    X = df_processed[data['features']]
    y_true = encoders['target_risk_level'].transform(df['target_risk_level'])
    y_pred = data['model'].predict(X)
    
    plt.figure(figsize=(10, 8))
    cm = confusion_matrix(y_true, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='YlOrRd',
                xticklabels=encoders['target_risk_level'].classes_,
                yticklabels=encoders['target_risk_level'].classes_)
    plt.title('Risk Scoring Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    
    plt.tight_layout()
    plt.savefig(os.path.join('ml', 'model8_risk', 'evaluation_plot.png'))
    print(f"Evaluation plot saved to ml/model8_risk/evaluation_plot.png")

if __name__ == "__main__":
    evaluate_risk_model()
