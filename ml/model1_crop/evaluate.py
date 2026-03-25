import pandas as pd
import joblib
import os
import json
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

def evaluate_crop_model():
    models_dir = 'models'
    data_path = os.path.join('data', 'crops_dataset.csv')
    
    if not os.path.exists(data_path):
        print("Data file not found.")
        return
        
    df = pd.read_csv(data_path)
    model = joblib.load(os.path.join(models_dir, 'crop_model.pkl'))
    encoders = joblib.load(os.path.join(models_dir, 'crop_encoders.pkl'))
    
    from model1_crop.preprocessing import preprocess_data
    df_processed = preprocess_data(df, is_training=False, encoders=encoders)
    
    features = ['land_area', 'soil_type', 'water_availability', 'irrigation_type', 
                'rainfall_mm', 'temperature_celsius', 'humidity_percent', 
                'season', 'previous_crop', 'market_demand_level', 'district']
    
    X = df_processed[features]
    
    y_encoded = encoders['recommended_crop'].transform(df['recommended_crop'])
    y_pred = model.predict(X)
    
    # Metrics
    acc = accuracy_score(y_encoded, y_pred)
    prec = precision_score(y_encoded, y_pred, average='weighted')
    rec = recall_score(y_encoded, y_pred, average='weighted')
    f1 = f1_score(y_encoded, y_pred, average='weighted')
    
    print("\n=== Model 1: Crop Recommendation Evaluation ===")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    
    target_names = encoders['recommended_crop'].classes_
    print("\nClassification Report:")
    print(classification_report(y_encoded, y_pred, target_names=target_names))
    
    # Plotting
    cm = confusion_matrix(y_encoded, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=target_names, yticklabels=target_names)
    plt.title('Confusion Matrix: Crop Recommendation')
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.savefig(os.path.join('ml', 'model1_crop', 'evaluation_plot.png'))
    print(f"Evaluation plot saved to ml/model1_crop/evaluation_plot.png")

    # Save metrics to JSON for versioning
    with open(os.path.join(models_dir, 'crop_metrics.json'), 'w') as f:
        json.dump({
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1
        }, f)

if __name__ == "__main__":
    evaluate_crop_model()
