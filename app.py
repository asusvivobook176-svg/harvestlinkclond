from flask import Flask, jsonify
from flask_cors import CORS
from backend.config import Config
from backend.routes.auth_routes import auth_bp
from backend.routes.farmer_routes import farmer_bp
from backend.routes.shop_routes import shop_bp
from backend.routes.predict_routes import predict_bp
from backend.routes.market_routes import market_bp
from backend.routes.ai_service import ai_service_bp
from backend.routes.monitoring import monitoring_bp
from backend.routes.pilot_routes import pilot_bp
from backend.routes.analytics_routes import analytics_bp
from backend.routes.notification_routes import notification_bp
from backend.routes.payment_routes import payment_bp
from backend.routes.chatbot_routes import chatbot_bp
from backend.routes.disease_routes import disease_bp
from backend.routes.market_chatbot_routes import market_chatbot_bp
from backend.routes.ml_monitor_routes import ml_monitor_bp
from backend.api_docs import api_bp
from backend.ml_service import get_ml_service
from backend.logging_config import setup_logging
from backend.utils.backup import start_backup_scheduler
from flask import request
import os

from backend import db
from backend.security import limiter, handle_rate_limit_error

app = Flask(__name__)
app.config.from_object(Config)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{Config.DB_PATH}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

# Setup Logging
logger = setup_logging()

@app.before_request
def log_request():
    logger.info(f"Request: {request.method} {request.path} - From: {request.remote_addr}")

@app.after_request
def log_response(response):
    logger.info(f"Response: {response.status_code}")
    return response

db.init_app(app)
limiter.init_app(app)
app.register_error_handler(429, handle_rate_limit_error)

# Initialize ML Service (loads models at startup)
ml_service = get_ml_service()

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(farmer_bp, url_prefix='/api/farmer')
app.register_blueprint(shop_bp, url_prefix='/api/shop')
app.register_blueprint(predict_bp, url_prefix='/api/predict')
app.register_blueprint(market_bp, url_prefix='/api/market')
app.register_blueprint(ai_service_bp)
app.register_blueprint(monitoring_bp)
app.register_blueprint(pilot_bp, url_prefix='/api/pilot')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(notification_bp, url_prefix='/api/notifications')
app.register_blueprint(payment_bp, url_prefix='/api/payment')
app.register_blueprint(chatbot_bp)
app.register_blueprint(disease_bp)
app.register_blueprint(market_chatbot_bp, url_prefix='/api/market-chatbot')
app.register_blueprint(ml_monitor_bp, url_prefix='/api/ml')
app.register_blueprint(api_bp, url_prefix='/docs')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "HarvestLink API"})

@app.route('/api/model/info', methods=['GET'])
def model_info():
    return jsonify({
        "models": [
            {"id": "1", "name": "Crop Recommendation", "accuracy": "96.25%", "algorithm": "Random Forest Classifier"},
            {"id": "2", "name": "Market Demand", "score": "R²=0.9952", "algorithm": "LSTM + RF Regressor"},
            {"id": "3", "name": "Price Crash Alert", "accuracy": "89.33%", "algorithm": "Random Forest Classifier"},
            {"id": "4", "name": "Spoilage Risk", "accuracy": "91.50%", "algorithm": "RF Classifier + Regressor"},
            {"id": "5", "name": "Profit Prediction", "score": "R²=0.97", "algorithm": "XGBoost"},
            {"id": "6", "name": "Yield Prediction", "score": "R²=0.9706", "algorithm": "Random Forest Regressor"},
            {"id": "7", "name": "Crop Failure Risk", "accuracy": "93%", "algorithm": "SMOTE + Random Forest"},
            {"id": "8", "name": "Risk Scoring", "accuracy": "91%", "algorithm": "Composite Model"}
        ]
    })

# Start backup scheduler in background
start_backup_scheduler()

if __name__ == '__main__':
    # Ensure database exists
    if not os.path.exists(Config.DB_PATH):
        print("Database not found. Please run database/init_db.py first.")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
