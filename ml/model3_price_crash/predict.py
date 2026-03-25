import joblib
import pandas as pd
import numpy as np
import os
from ml.model3_price_crash.preprocessing import preprocess_crash_data

def predict_crash_risk(input_data):
    """
    input_data: dict with features: vegetable_name, current_price_rs, prev_week_price_rs,
                current_supply_kg, current_demand_kg, month, festival_next_week,
                rainfall_mm, num_farmers_producing, cold_storage_available, district
    """
    models_dir = 'models'
    model_path = os.path.join(models_dir, 'price_crash_model.pkl')
    enc_path = os.path.join(models_dir, 'crash_encoders.pkl')
    sca_path = os.path.join(models_dir, 'crash_scaler.pkl')
    
    if not all(os.path.exists(p) for p in [model_path, enc_path, sca_path]):
        return None
    
    data = joblib.load(model_path)
    encoders = joblib.load(enc_path)
    scaler = joblib.load(sca_path)
    
    df = pd.DataFrame([input_data])
    df_processed = preprocess_crash_data(df, is_training=False, encoders=encoders, scaler=scaler)
    
    feat_order = data['features']
    crash_alert = bool(data['model_crash'].predict(df_processed[feat_order])[0])
    predicted_price = data['model_price'].predict(df_processed[feat_order])[0]
    severity_idx = data['model_sev'].predict(df_processed[feat_order])[0]
    severity = encoders['crash_severity'].inverse_transform([severity_idx])[0]
    
    # Messages
    if crash_alert:
        msg_en = f"ALERT: High risk of price crash ({severity})! Predicted price: Rs.{predicted_price:.2f}"
        msg_ta = f"எச்சரிக்கை: விலை வீழ்ச்சிக்கான அதிக வாய்ப்பு ({severity})! எதிர்பார்க்கப்படும் விலை: ரூ.{predicted_price:.2f}"
        action = "Recommend immediate harvest and sale, or use cold storage if available."
    else:
        msg_en = "Price is stable. No immediate crash risk."
        msg_ta = "விலை நிலையானது. உடனடி வீழ்ச்சி ஆபத்து இல்லை."
        action = "Continue regular farming activities."
        
    return {
        'crash_alert': crash_alert,
        'alert_message_en': msg_en,
        'alert_message_ta': msg_ta,
        'predicted_price': float(predicted_price),
        'severity': severity,
        'recommended_action': action
    }

if __name__ == "__main__":
    # Sample test
    sample = {
        'vegetable_name': 'Tomato', 'current_price_rs': 25.0, 'prev_week_price_rs': 28.0,
        'current_supply_kg': 5000.0, 'current_demand_kg': 2000.0, 'month': 11,
        'festival_next_week': 0, 'rainfall_mm': 50.0, 'num_farmers_producing': 200,
        'cold_storage_available': 0, 'district': 'Salem'
    }
    res = predict_crash_risk(sample)
    if res:
        print(f"Crash Alert: {res['crash_alert']}")
        print(f"Message: {res['alert_message_en']}")
        print(f"Severity: {res['severity']}")
        print(f"Action: {res['recommended_action']}")
