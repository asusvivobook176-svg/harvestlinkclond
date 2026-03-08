import pandas as pd
import joblib
import os
from sklearn.metrics import accuracy_score, precision_score, f1_score, r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split

def evaluate_all_models():
    models_dir = 'models'
    data_dir = 'data'
    report = []
    
    report.append("="*50)
    report.append("HARVESTLINK ML MODEL EVALUATION REPORT")
    report.append("="*50)
    
    # --- Model 1: Crop Recommendation ---
    report.append("\n[MODEL 1: Crop Recommendation]")
    try:
        model = joblib.load(os.path.join(models_dir, 'crop_model.pkl'))
        encoders = joblib.load(os.path.join(models_dir, 'crop_encoders.pkl'))
        df = pd.read_csv(os.path.join(data_dir, 'crops_dataset.csv'))
        
        for col in ['soil_type', 'water_availability', 'irrigation_type', 'season', 'previous_crop', 'market_demand_level', 'district']:
            df[col] = encoders[col].transform(df[col])
        X = df.drop('recommended_crop', axis=1)
        y = encoders['recommended_crop'].transform(df['recommended_crop'])
        _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        y_pred = model.predict(X_test)
        report.append(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
        report.append(f"Precision: {precision_score(y_test, y_pred, average='weighted'):.4f}")
        report.append(f"F1-Score:  {f1_score(y_test, y_pred, average='weighted'):.4f}")
    except Exception as e: report.append(f"Error evaluating Model 1: {e}")

    # --- Model 2: Demand Forecast ---
    report.append("\n[MODEL 2: Demand & Price Forecast]")
    try:
        data = joblib.load(os.path.join(models_dir, 'demand_model.pkl'))
        df = pd.read_csv(os.path.join(data_dir, 'market_demand.csv'))
        enc = joblib.load(os.path.join(models_dir, 'demand_encoders.pkl'))
        
        for col in ['vegetable_name', 'city', 'season']:
            df[col] = enc[col].transform(df[col])
            
        X = df[data['features']]
        _, X_test, _, y_d_test, _, y_p_test = train_test_split(X, df['predicted_demand_kg'], df['predicted_price_rs'], test_size=0.2, random_state=42)
        
        d_pred = data['model_demand'].predict(X_test)
        p_pred = data['model_price'].predict(X_test)
        report.append(f"Demand R2 Score: {r2_score(y_d_test, d_pred):.4f}")
        report.append(f"Price R2 Score:  {r2_score(y_p_test, p_pred):.4f}")
    except Exception as e: report.append(f"Error evaluating Model 2: {e}")

    # --- Model 3: Price Crash Alert ---
    report.append("\n[MODEL 3: Price Crash Alert]")
    try:
        from sklearn.metrics import recall_score
        data = joblib.load(os.path.join(models_dir, 'price_crash_model.pkl'))
        df = pd.read_csv(os.path.join(data_dir, 'price_crash.csv'))
        enc = joblib.load(os.path.join(models_dir, 'crash_encoders.pkl'))
        
        for col in ['vegetable_name', 'district']:
            df[col] = enc[col].transform(df[col])
            
        X = df[data['features']]
        _, X_test, _, y_c_test = train_test_split(X, df['crash_alert'], test_size=0.2, random_state=42)
        
        y_pred = data['model_crash'].predict(X_test)
        report.append(f"Accuracy:  {accuracy_score(y_c_test, y_pred):.4f}")
        report.append(f"Precision: {precision_score(y_c_test, y_pred):.4f}")
        report.append(f"Recall:    {recall_score(y_c_test, y_pred):.4f}")
        report.append(f"F1-Score:  {f1_score(y_c_test, y_pred):.4f}")
    except Exception as e: report.append(f"Error evaluating Model 3: {e}")

    # --- Model 4: Spoilage Risk ---
    report.append("\n[MODEL 4: Spoilage Risk]")
    try:
        data = joblib.load(os.path.join(models_dir, 'spoilage_model.pkl'))
        df = pd.read_csv(os.path.join(data_dir, 'spoilage_data.csv'))
        enc = joblib.load(os.path.join(models_dir, 'spoilage_encoders.pkl'))
        
        for col in ['vegetable_type', 'storage_type', 'packaging_type', 'district', 'season']:
            df[col] = enc[col].transform(df[col])
        X = df[data['features']]
        y_risk = enc['spoilage_risk_level'].transform(df['spoilage_risk_level'])
        _, X_test, _, y_test = train_test_split(X, y_risk, test_size=0.2, random_state=42)
        
        y_pred = data['model_risk'].predict(X_test)
        report.append(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
        report.append(f"Precision: {precision_score(y_test, y_pred, average='weighted'):.4f}")
        report.append(f"F1-Score:  {f1_score(y_test, y_pred, average='weighted'):.4f}")
    except Exception as e: report.append(f"Error evaluating Model 4: {e}")

    report.append("\n" + "="*50)
    
    with open('ml/final_report.txt', 'w') as f:
        f.write("\n".join(report))
    print("Report generated in ml/final_report.txt")

if __name__ == "__main__":
    evaluate_all_models()
