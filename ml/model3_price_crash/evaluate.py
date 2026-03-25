import pandas as pd
import numpy as np
import joblib
import os
from sklearn.metrics import confusion_matrix, roc_curve, auc, precision_recall_curve
import matplotlib.pyplot as plt
import seaborn as sns

def evaluate_crash_model():
    models_dir = 'models'
    data_path = os.path.join('data', 'price_crash.csv')
    
    if not os.path.exists(data_path):
        return
        
    df = pd.read_csv(data_path)
    data = joblib.load(os.path.join(models_dir, 'price_crash_model.pkl'))
    encoders = joblib.load(os.path.join(models_dir, 'crash_encoders.pkl'))
    scaler = joblib.load(os.path.join(models_dir, 'crash_scaler.pkl'))
    
    from ml.model3_price_crash.preprocessing import preprocess_crash_data
    df_processed = preprocess_crash_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    X = df_processed[data['features']]
    y_true = df['crash_alert']
    
    y_pred = data['model_crash'].predict(X)
    y_prob = data['model_crash'].predict_proba(X)[:, 1]
    
    # Metrics - handled in train.py printing, but here's visualization
    cm = confusion_matrix(y_true, y_pred)
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    roc_auc = auc(fpr, tpr)
    
    plt.figure(figsize=(15, 5))
    
    # 1. Confusion Matrix
    plt.subplot(1, 3, 1)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Reds')
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    
    # 2. ROC Curve
    plt.subplot(1, 3, 2)
    plt.plot(fpr, tpr, color='darkred', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curve')
    plt.legend(loc="lower right")
    
    # 3. Feature Importance
    plt.subplot(1, 3, 3)
    importances = data['model_crash'].feature_importances_
    indices = np.argsort(importances)[-10:]
    plt.barh(range(len(indices)), importances[indices], align='center', color='salmon')
    plt.yticks(range(len(indices)), [data['features'][i] for i in indices])
    plt.title('Top Feature Importances')
    
    plt.tight_layout()
    plt.savefig(os.path.join('ml', 'model3_price_crash', 'evaluation_plot.png'))
    print(f"Evaluation plot saved to ml/model3_price_crash/evaluation_plot.png")

if __name__ == "__main__":
    evaluate_crash_model()
