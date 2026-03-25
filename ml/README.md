# HarvestLink ML Service

A comprehensive machine learning suite for smart agriculture in Tamil Nadu, India.

## Folder Structure
```text
ml/
├── model1_crop/            # Crop Recommendation
├── model2_demand/          # Demand Forecasting (LSTM + RF)
├── model3_price_crash/      # Price Crash Alert
├── model4_spoilage/        # Spoilage Risk & Circular Economy
├── model5_profit/          # Profit Prediction (XGBoost)
├── model6_yield/           # Yield Prediction
├── model7_failure/         # Crop Failure Risk (SMOTE + RFC)
├── model8_risk/            # Overall Risk Scoring
├── smart_predict.py        # Unified Prediction Gateway
├── evaluate_all.py         # Complete Suite Evaluation
├── api_example.py          # FastAPI/Flask Integration
└── __init__.py
```

## How to Run
1. Generate data for all models:
   `python ml/evaluate_all.py` (checks if data/models exist)
2. Train all models:
   `python ml/model1_crop/train.py`, `python ml/model2_demand/train.py`, etc.
3. Use the unified predictor:
   ```python
   from ml.smart_predict import SmartPredictor
   predictor = SmartPredictor()
   report = predictor.get_comprehensive_report(inputs)
   ```

## Models Summary
- **Crop Recommendation**: Recommends best crop based on soil, weather, and demand.
- **Demand forecasting**: Predicts next month demand and price.
- **Price Crash Alert**: Predicts sudden price drops (>40%) and provides farmer warnings.
- **Spoilage Risk**: Estimates shelf life and suggests circular economy actions.
- **Profit Prediction**: Calculates expected profit and offers what-if analysis.
- **Yield Prediction**: Forecasts crop output per acre.
- **Crop Failure Risk**: Identifies high-risk conditions for crop failure.
- **Risk Scoring**: Provides an overall risk assessment score.
