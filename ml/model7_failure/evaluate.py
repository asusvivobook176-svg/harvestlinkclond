import pandas as pd
import numpy as np
import joblib
import os
from sklearn.metrics import confusion_matrix, classification_report
import matplotlib.pyplot as plt
import seaborn as sns

def evaluate_failure_model():
    models_dir = 'models'
    data_path = os.path.join('data', 'crop_failure.csv')
    
    if not os.path.exists(data_path):
        return
        
    df = pd.read_csv(data_path)
    data = joblib.load(os.path.join(models_dir, 'failure_model.pkl'))
    encoders = joblib.load(os.path.join(models_dir, 'failure_encoders.pkl'))
    scaler = joblib.load(os.path.join(models_dir, 'failure_scaler.pkl'))
    
    from ml.model7_failure.preprocessing import preprocess_failure_data
    df_processed = preprocess_failure_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    X = df_processed[data['features']]
    y_true = df['target_failure']
    y_pred = data['model'].predict(X)
    
    plt.figure(figsize=(10, 8))
    cm = confusion_matrix(y_true, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Purples')
    plt.title('Crop Failure Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    
    plt.tight_layout()
    plt.savefig(os.path.join('ml', 'model7_failure', 'evaluation_plot.png'))
    print(f"Evaluation plot saved to ml/model7_failure/evaluation_plot.png")

if __name__ == "__main__":
    evaluate_failure_model()
