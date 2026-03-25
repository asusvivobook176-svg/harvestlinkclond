from backend import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat()
        }

class AIRecommendation(db.Model):
    __tablename__ = 'ai_recommendations'
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, nullable=False)
    recommendation_type = db.Column(db.String(50))
    crop_suggested = db.Column(db.String(100))
    confidence_score = db.Column(db.Float)
    reasoning = db.Column(db.Text)
    action_taken = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "farmer_id": self.farmer_id,
            "recommendation_type": self.recommendation_type,
            "crop_suggested": self.crop_suggested,
            "confidence_score": self.confidence_score,
            "reasoning": self.reasoning,
            "action_taken": self.action_taken,
            "created_at": self.created_at.isoformat()
        }

class SpoilageCheck(db.Model):
    __tablename__ = 'spoilage_checks'
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, nullable=False)
    crop_name = db.Column(db.String(100))
    harvest_date = db.Column(db.Date)
    estimated_shelf_life_days = db.Column(db.Integer)
    risk_level = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "farmer_id": self.farmer_id,
            "crop_name": self.crop_name,
            "harvest_date": self.harvest_date.isoformat() if self.harvest_date else None,
            "estimated_shelf_life_days": self.estimated_shelf_life_days,
            "risk_level": self.risk_level,
            "created_at": self.created_at.isoformat()
        }

class PriceAlert(db.Model):
    __tablename__ = 'price_alerts'
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, nullable=False)
    crop_name = db.Column(db.String(100))
    alert_type = db.Column(db.String(50))
    current_price = db.Column(db.Float)
    predicted_crash_price = db.Column(db.Float)
    risk_level = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "farmer_id": self.farmer_id,
            "crop_name": self.crop_name,
            "alert_type": self.alert_type,
            "current_price": self.current_price,
            "predicted_crash_price": self.predicted_crash_price,
            "risk_level": self.risk_level,
            "created_at": self.created_at.isoformat()
        }

class DemandForecast(db.Model):
    __tablename__ = 'demand_forecasts'
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, nullable=False)
    crop_name = db.Column(db.String(100), nullable=False)
    forecast_data = db.Column(db.Text)  # JSON string
    trend = db.Column(db.String(50))
    confidence_score = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "farmer_id": self.farmer_id,
            "crop_name": self.crop_name,
            "forecast_data": self.forecast_data,
            "trend": self.trend,
            "confidence_score": self.confidence_score,
            "created_at": self.created_at.isoformat()
        }

class PilotParticipant(db.Model):
    __tablename__ = 'pilot_participants'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100))
    location = db.Column(db.String(100)) # Coimbatore / Salem
    crop_type = db.Column(db.String(100)) # tomato, onion, potato
    farm_size = db.Column(db.String(50)) # Small, Medium, Large
    phone_number = db.Column(db.String(20))
    training_completed = db.Column(db.Boolean, default=False)
    joined_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='pilot_profile')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "location": self.location,
            "crop_type": self.crop_type,
            "farm_size": self.farm_size,
            "training_completed": self.training_completed,
            "joined_date": self.joined_date.isoformat() if self.joined_date else None,
            "created_at": self.created_at.isoformat()
        }

class PilotTraining(db.Model):
    __tablename__ = 'pilot_training'
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('pilot_participants.id'), nullable=False)
    crop_advisor_trained = db.Column(db.Boolean, default=False)
    price_alerts_trained = db.Column(db.Boolean, default=False)
    spoilage_checker_trained = db.Column(db.Boolean, default=False)
    training_date = db.Column(db.DateTime, default=datetime.utcnow)
    duration_minutes = db.Column(db.Integer, default=60)
    status = db.Column(db.String(50), default='completed') # completed, scheduled, missed

    def to_dict(self):
        return {
            "id": self.id,
            "farmer_id": self.farmer_id,
            "crop_advisor_trained": self.crop_advisor_trained,
            "price_alerts_trained": self.price_alerts_trained,
            "spoilage_checker_trained": self.spoilage_checker_trained,
            "training_date": self.training_date.isoformat(),
            "duration_minutes": self.duration_minutes,
            "status": self.status
        }

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    feature = db.Column(db.String(50)) # Crop Advisor, Price Alerts, Spoilage Checker
    action = db.Column(db.String(100)) # view, check, recommendation
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "feature": self.feature,
            "action": self.action,
            "created_at": self.created_at.isoformat()
        }

class PilotFeedback(db.Model):
    __tablename__ = 'pilot_feedback'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    feedback_type = db.Column(db.String(50)) # Survey, Bug, WhatsApp (manual log)
    content = db.Column(db.Text)
    prediction_accurate = db.Column(db.Boolean, nullable=True)
    rating = db.Column(db.Integer, nullable=True) # 1-5
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "feedback_type": self.feedback_type,
            "content": self.content,
            "prediction_accurate": self.prediction_accurate,
            "rating": self.rating,
            "created_at": self.created_at.isoformat()
        }

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    seller_id = db.Column(db.Integer, nullable=False)
    buyer_id = db.Column(db.Integer, nullable=False)
    crop_name = db.Column(db.String(100))
    quantity = db.Column(db.Float)
    price_per_unit = db.Column(db.Float)
    total_price = db.Column(db.Float)
    transaction_date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "seller_id": self.seller_id,
            "buyer_id": self.buyer_id,
            "crop_name": self.crop_name,
            "quantity": self.quantity,
            "price_per_unit": self.price_per_unit,
            "total_price": self.total_price,
            "transaction_date": self.transaction_date.isoformat()
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200))
    message = db.Column(db.Text)
    notification_type = db.Column(db.String(50)) # price_alert, spoilage_warning, demand_update, recommendation
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "message": self.message,
            "notification_type": self.notification_type,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat()
        }

class NotificationPreference(db.Model):
    __tablename__ = 'notification_preferences'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False, unique=True)
    in_app = db.Column(db.Boolean, default=True)
    email = db.Column(db.Boolean, default=True)
    sms = db.Column(db.Boolean, default=False)
    push = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "in_app": self.in_app,
            "email": self.email,
            "sms": self.sms,
            "push": self.push
        }
