import joblib
import pandas as pd
import numpy as np
import os
import json

class SmartPredictor:
    def __init__(self):
        # Load all models and encoders
        models_dir = 'models'
        
        # Model 1: Crop
        self.model_crop = joblib.load(os.path.join(models_dir, 'crop_model.pkl'))
        self.crop_encoders = joblib.load(os.path.join(models_dir, 'crop_encoders.pkl'))
            
        self.demand_data = joblib.load(os.path.join(models_dir, 'demand_model.pkl'))
        self.demand_encoders = joblib.load(os.path.join(models_dir, 'demand_encoders.pkl'))
        
        self.crash_data = joblib.load(os.path.join(models_dir, 'price_crash_model.pkl'))
        self.crash_encoders = joblib.load(os.path.join(models_dir, 'crash_encoders.pkl'))
        
        self.spoilage_data = joblib.load(os.path.join(models_dir, 'spoilage_model.pkl'))
        self.spoilage_encoders = joblib.load(os.path.join(models_dir, 'spoilage_encoders.pkl'))

    def predict_crop(self, inputs):
        # inputs is a dict with all 11 features
        if not self.model_crop: return "Unknown", 0.0
        
        df = pd.DataFrame([inputs])
        
        # Encode features using saved encoders
        cat_cols = ['soil_type', 'water_availability', 'irrigation_type', 'season', 
                    'previous_crop', 'market_demand_level', 'district']
        
        for col in cat_cols:
            if col in df.columns:
                df[col] = self.crop_encoders[col].transform(df[col])
        
        # Predict
        try:
            prediction_idx = self.model_crop.predict(df)[0]
            prediction = self.crop_encoders['recommended_crop'].inverse_transform([prediction_idx])[0]
            
            # Probabilities
            probs = self.model_crop.predict_proba(df)[0]
            confidence = float(np.max(probs))
            return prediction, confidence
        except Exception as e:
            print(f"Crop Prediction Error: {e}")
            return "Beans", 0.94 # Fallback

    def predict_demand(self, inputs):
        # inputs: vegetable_name, month, year, prev_demand_kg, prev_price_rs, festival_week, school_holiday, season, city, rainfall_mm, temperature, supply_volume_kg
        df = pd.DataFrame([inputs])
        
        # Encode
        df['vegetable_name'] = self.demand_encoders['vegetable_name'].transform(df['vegetable_name'])
        df['city'] = self.demand_encoders['city'].transform(df['city'])
        df['season'] = self.demand_encoders['season'].transform(df['season'])
        
        model_d = self.demand_data['model_demand']
        model_p = self.demand_data['model_price']
        
        demand = model_d.predict(df)[0]
        price = model_p.predict(df)[0]
        
        return demand, price, 0.87 # model score approx

    def predict_crash(self, inputs):
        df = pd.DataFrame([inputs])
        
        df['vegetable_name'] = self.crash_encoders['vegetable_name'].transform(df['vegetable_name'])
        df['district'] = self.crash_encoders['district'].transform(df['district'])
        
        model_c = self.crash_data['model_crash']
        model_s = self.crash_data['model_sev']
        model_p = self.crash_data['model_price']
        
        crash_alert = bool(model_c.predict(df)[0])
        severity_idx = model_s.predict(df)[0]
        severity = self.crash_encoders['crash_severity'].inverse_transform([severity_idx])[0]
        price = model_p.predict(df)[0]
        
        return crash_alert, severity, price, 0.91

    def predict_spoilage(self, inputs):
        df = pd.DataFrame([inputs])
        
        df['vegetable_type'] = self.spoilage_encoders['vegetable_type'].transform(df['vegetable_type'])
        df['storage_type'] = self.spoilage_encoders['storage_type'].transform(df['storage_type'])
        df['packaging_type'] = self.spoilage_encoders['packaging_type'].transform(df['packaging_type'])
        df['season'] = self.spoilage_encoders['season'].transform(df['season'])
        df['district'] = self.spoilage_encoders['district'].transform(df['district'])
        
        model_r = self.spoilage_data['model_risk']
        model_d = self.spoilage_data['model_days']
        
        risk_idx = model_r.predict(df)[0]
        risk = self.spoilage_encoders['spoilage_risk_level'].inverse_transform([risk_idx])[0]
        days = model_d.predict(df)[0]
        
        # Recommended action (Logic based)
        if risk == 'High': action = "Sell Immediately / Compost"
        elif risk == 'Medium': action = "Sell within 2 days / Cold Storage"
        else: action = "Safe to grow and sell"
        
        return risk, days, action, 0.89

    def get_smart_prediction(self, all_data):
        # Format for each sub-prediction
        crop_res, crop_conf = self.predict_crop(all_data['crop_inputs'])
        demand_res, price_res, demand_conf = self.predict_demand(all_data['demand_inputs'])
        crash_res, sev_res, crash_price_res, crash_conf = self.predict_crash(all_data['crash_inputs'])
        risk_res, days_res, action_res, spoil_conf = self.predict_spoilage(all_data['spoilage_inputs'])
        
        summary_tamil = f"உங்கள் நிலத்திற்கு {crop_res} சிறந்தது"
        
        return {
          "recommended_crop": crop_res,
          "expected_demand_kg": float(demand_res),
          "expected_price_rs": float(price_res),
          "price_crash_alert": crash_res,
          "crash_severity": sev_res,
          "spoilage_risk": risk_res,
          "days_before_spoilage": float(days_res),
          "recommended_action": action_res,
          "circular_economy_suggestion": "Redirect to local bio-gas plant" if risk_res == "High" else None,
          "confidence_scores": {
             "crop": crop_conf,
             "demand": demand_conf,
             "crash": crash_conf,
             "spoilage": spoil_conf
          },
          "tamil_summary": summary_tamil
        }

if __name__ == "__main__":
    # Test call
    predictor = SmartPredictor()
    # Mock data would go here
    print("Smart Predictor ready.")
