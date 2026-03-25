import joblib
import pandas as pd
import numpy as np
import os
import json

# Import per-model predictors (relative imports within ml package)
from .model1_crop.predict import predict_crop
from .model2_demand.predict import predict_demand
from .model3_price_crash.predict import predict_crash_risk
from .model4_spoilage.predict import predict_spoilage_risk
from .model5_profit.predict import predict_profit
# Note: Model 6 (Yield) is often part of profit or separate
from .model6_yield.predict import predict_yield
from .model7_failure.predict import predict_failure_risk
from .model8_risk.predict import predict_risk_score

class SmartPredictor:
    def __init__(self):
        print("Smart Predictor Initialized with 8 models.")

    # ─── Individual model wrappers (used by predict_routes.py) ───

    def predict_crop(self, data):
        """Returns (recommended_crop, confidence)"""
        try:
            result, confidence = predict_crop(data)
            return result, confidence
        except Exception as e:
            print(f"[SmartPredictor] Crop prediction error: {e}")
            return "Unknown", 0.0

    def predict_demand(self, data):
        """Returns (demand_kg, price_rs, confidence)"""
        try:
            result = predict_demand(data)
            if isinstance(result, dict):
                return (
                    result.get('predicted_demand_kg', 0),
                    result.get('predicted_price_rs', 0),
                    result.get('confidence', 'Medium')
                )
            # Some predict_demand implementations return a tuple
            return result if len(result) == 3 else (*result, 'Medium')
        except Exception as e:
            print(f"[SmartPredictor] Demand prediction error: {e}")
            return 0, 0, 'Low'

    def predict_crash(self, data):
        """Returns (crash_alert, severity, predicted_price, confidence)"""
        try:
            result = predict_crash_risk(data)
            if result is None:
                return False, 'None', 0.0, 0.0
            return (
                result.get('crash_alert', False),
                result.get('severity', 'None'),
                result.get('predicted_price', 0.0),
                result.get('confidence', 0.0)
            )
        except Exception as e:
            print(f"[SmartPredictor] Crash prediction error: {e}")
            return False, 'None', 0.0, 0.0

    def predict_spoilage(self, data):
        """Returns (risk_level, days_remaining, recommended_action, confidence)"""
        try:
            result = predict_spoilage_risk(data)
            if result is None:
                return 'Low', 7, 'Check storage conditions', 0.0
            return (
                result.get('risk_level', 'Low'),
                result.get('days_remaining', 7),
                result.get('recommended_action', 'Monitor conditions'),
                result.get('confidence_pct', 0.0) / 100.0
            )
        except Exception as e:
            print(f"[SmartPredictor] Spoilage prediction error: {e}")
            return 'Low', 7, 'Check storage conditions', 0.0

    def get_smart_prediction(self, combined_data):
        """Combined prediction using all 4 core models"""
        results = {}
        try:
            crop_data = combined_data.get('crop_inputs', {})
            crop_name, crop_conf = self.predict_crop(crop_data)
            results['crop'] = {'recommended_crop': crop_name, 'confidence': crop_conf}
        except Exception as e:
            results['crop'] = {'error': str(e)}

        try:
            demand_data = combined_data.get('demand_inputs', {})
            demand, price, conf = self.predict_demand(demand_data)
            results['demand'] = {'predicted_demand_kg': demand, 'predicted_price_rs': price, 'confidence': conf}
        except Exception as e:
            results['demand'] = {'error': str(e)}

        try:
            crash_data = combined_data.get('crash_inputs', {})
            crash, sev, pred_price, conf = self.predict_crash(crash_data)
            results['crash'] = {'price_crash_alert': crash, 'severity': sev, 'predicted_price': pred_price}
        except Exception as e:
            results['crash'] = {'error': str(e)}

        try:
            spoilage_data = combined_data.get('spoilage_inputs', {})
            risk, days, action, conf = self.predict_spoilage(spoilage_data)
            results['spoilage'] = {'risk_level': risk, 'days_remaining': days, 'action': action}
        except Exception as e:
            results['spoilage'] = {'error': str(e)}

        return results

    def get_comprehensive_report(self, all_inputs):
        """
        all_inputs: dict containing keys for each model:
        'crop', 'demand', 'crash', 'spoilage', 'profit', 'yield', 'failure', 'risk'
        """
        results = {}
        
        # 1. Crop Recommendation
        if 'crop' in all_inputs:
            results['crop_recommendation'] = predict_crop(all_inputs['crop'])
            
        # 2. Demand & Price Forecast
        if 'demand' in all_inputs:
            results['demand_forecast'] = predict_demand(all_inputs['demand'])
            
        # 3. Price Crash Alert
        if 'crash' in all_inputs:
            results['price_crash'] = predict_crash_risk(all_inputs['crash'])
            
        # 4. Spoilage Risk
        if 'spoilage' in all_inputs:
            results['spoilage_risk'] = predict_spoilage_risk(all_inputs['spoilage'])
            
        # 5. Profit Prediction
        if 'profit' in all_inputs:
            results['profit_prediction'] = predict_profit(all_inputs['profit'])
            
        # 6. Yield Prediction
        if 'yield' in all_inputs:
            results['yield_prediction'] = predict_yield(all_inputs['yield'])
            
        # 7. Crop Failure Risk
        if 'failure' in all_inputs:
            results['failure_risk'] = predict_failure_risk(all_inputs['failure'])
            
        # 8. Overall Risk Scoring
        if 'risk' in all_inputs:
            results['overall_risk'] = predict_risk_score(all_inputs['risk'])
            
        return results

if __name__ == "__main__":
    predictor = SmartPredictor()
    print("HarvestLink Smart Predictor handles 8 ML models.")
