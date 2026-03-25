from flask import Blueprint, request, jsonify
from backend import db
from backend.models import Notification, NotificationPreference
from datetime import datetime

notification_bp = Blueprint('notifications', __name__)

@notification_bp.route('/<int:user_id>', methods=['GET'])
def get_notifications(user_id):
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).limit(50).all()
    return jsonify([n.to_dict() for n in notifications])

@notification_bp.route('/read/<int:notification_id>', methods=['POST'])
def mark_as_read(notification_id):
    notification = Notification.query.get(notification_id)
    if notification:
        notification.is_read = True
        db.session.commit()
        return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "Notification not found"}), 404

@notification_bp.route('/preferences/<int:user_id>', methods=['GET'])
def get_preferences(user_id):
    pref = NotificationPreference.query.filter_by(user_id=user_id).first()
    if not pref:
        pref = NotificationPreference(user_id=user_id)
        db.session.add(pref)
        db.session.commit()
    return jsonify(pref.to_dict())

@notification_bp.route('/preferences/<int:user_id>', methods=['POST'])
def update_preferences(user_id):
    data = request.get_json()
    pref = NotificationPreference.query.filter_by(user_id=user_id).first()
    if not pref:
        pref = NotificationPreference(user_id=user_id)
        db.session.add(pref)
    
    pref.in_app = data.get('in_app', pref.in_app)
    pref.email = data.get('email', pref.email)
    pref.sms = data.get('sms', pref.sms)
    pref.push = data.get('push', pref.push)
    
    db.session.commit()
    return jsonify(pref.to_dict())
