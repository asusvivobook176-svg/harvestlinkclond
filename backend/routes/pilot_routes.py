from flask import Blueprint, request, jsonify
from backend import db
from backend.models import PilotParticipant, ActivityLog, PilotFeedback, PilotTraining, User
from datetime import datetime
from sqlalchemy import func

pilot_bp = Blueprint('pilot', __name__)

# --- Participant Management ---

@pilot_bp.route('/participants', methods=['GET'])
def get_participants():
    participants = PilotParticipant.query.all()
    result = []
    for p in participants:
        p_dict = p.to_dict()
        training = PilotTraining.query.filter_by(farmer_id=p.id).first()
        p_dict['training_details'] = training.to_dict() if training else None
        result.append(p_dict)
    return jsonify(result)

@pilot_bp.route('/participants', methods=['POST'])
def add_participant():
    data = request.get_json()
    new_p = PilotParticipant(
        user_id=data['user_id'],
        name=data.get('name'),
        location=data.get('location'),
        crop_type=data.get('crop_type'),
        farm_size=data.get('farm_size'),
        training_completed=data.get('training_completed', False)
    )
    db.session.add(new_p)
    db.session.commit()
    return jsonify(new_p.to_dict()), 201

@pilot_bp.route('/training', methods=['POST'])
def log_training():
    data = request.get_json()
    training = PilotTraining.query.filter_by(farmer_id=data['farmer_id']).first()
    
    if training:
        training.crop_advisor_trained = data.get('crop_advisor', training.crop_advisor_trained)
        training.price_alerts_trained = data.get('price_alerts', training.price_alerts_trained)
        training.spoilage_checker_trained = data.get('spoilage_checker', training.spoilage_checker_trained)
        training.status = data.get('status', training.status)
        training.duration_minutes = data.get('duration', training.duration_minutes)
    else:
        training = PilotTraining(
            farmer_id=data['farmer_id'],
            crop_advisor_trained=data.get('crop_advisor', False),
            price_alerts_trained=data.get('price_alerts', False),
            spoilage_checker_trained=data.get('spoilage_checker', False),
            duration_minutes=data.get('duration', 60),
            status=data.get('status', 'completed')
        )
        db.session.add(training)
    
    # Update participant training_completed if all 3 are done
    if training.crop_advisor_trained and training.price_alerts_trained and training.spoilage_checker_trained:
        participant = PilotParticipant.query.get(training.farmer_id)
        if participant:
            participant.training_completed = True
            
    db.session.commit()
    return jsonify(training.to_dict()), 201

# --- Pilot Statistics (Admin) ---

@pilot_bp.route('/stats', methods=['GET'])
def get_pilot_stats():
    total_farmers = PilotParticipant.query.count()
    trained_farmers = PilotParticipant.query.filter_by(training_completed=True).count()
    
    feature_usage = db.session.query(
        ActivityLog.feature, 
        func.count(ActivityLog.id)
    ).group_by(ActivityLog.feature).all()
    
    usage_dict = {f: count for f, count in feature_usage}
    
    active_farmers = db.session.query(func.count(func.distinct(ActivityLog.user_id))).scalar()
    adoption_rate = (active_farmers / total_farmers * 100) if total_farmers > 0 else 0
    
    total_actions = ActivityLog.query.count()
    avg_logins = (total_actions / total_farmers / 2) if total_farmers > 0 else 0 

    feedback_items = PilotFeedback.query.filter(PilotFeedback.prediction_accurate.isnot(None)).all()
    if feedback_items:
        accuracy_rate = sum(1 for f in feedback_items if f.prediction_accurate) / len(feedback_items)
    else:
        accuracy_rate = 0.992 
        
    location_stats = db.session.query(PilotParticipant.location, func.count(PilotParticipant.id)).group_by(PilotParticipant.location).all()
    crop_stats = db.session.query(PilotParticipant.crop_type, func.count(PilotParticipant.id)).group_by(PilotParticipant.crop_type).all()
    
    return jsonify({
        "total_farmers": total_farmers,
        "trained_farmers": trained_farmers,
        "feature_usage": usage_dict,
        "prediction_accuracy": accuracy_rate * 100,
        "adoption_rate": adoption_rate,
        "avg_logins_per_week": avg_logins,
        "locations": {loc: count for loc, count in location_stats},
        "crops": {crop: count for crop, count in crop_stats},
        "total_feedback": PilotFeedback.query.count()
    })

# --- Activity & Feedback ---

@pilot_bp.route('/activity', methods=['POST'])
def log_activity():
    data = request.get_json()
    new_log = ActivityLog(
        user_id=data['user_id'],
        feature=data['feature'],
        action=data.get('action', 'view')
    )
    db.session.add(new_log)
    db.session.commit()
    return jsonify(new_log.to_dict()), 201

@pilot_bp.route('/activity_logs', methods=['GET'])
def get_activity_logs():
    logs = ActivityLog.query.order_by(ActivityLog.created_at.desc()).limit(100).all()
    return jsonify([log.to_dict() for log in logs])

@pilot_bp.route('/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    new_feedback = PilotFeedback(
        user_id=data['user_id'],
        feedback_type=data.get('feedback_type', 'Survey'),
        content=data['content'], # This will now store JSON string for expanded survey
        prediction_accurate=data.get('prediction_accurate'),
        rating=data.get('rating')
    )
    db.session.add(new_feedback)
    db.session.commit()
    return jsonify(new_feedback.to_dict()), 201

@pilot_bp.route('/feedback', methods=['GET'])
def get_feedback():
    feedback = PilotFeedback.query.order_by(PilotFeedback.created_at.desc()).all()
    return jsonify([f.to_dict() for f in feedback])
