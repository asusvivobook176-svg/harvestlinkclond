import os
from celery import Celery
from twilio.rest import Client
from backend import db
from backend.models import Notification, NotificationPreference, PilotParticipant
from flask import current_app

# Celery Configuration
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

celery = Celery('harvestlink', broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)

# Twilio Configuration (Placeholders)
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID', 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN', 'your_auth_token')
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER', '+1234567890')

@celery.task
def send_notification_task(user_id, title, message, notification_type):
    """
    Sends notification based on user preferences.
    """
    # Get user preferences
    pref = NotificationPreference.query.filter_by(user_id=user_id).first()
    if not pref:
        # Default preferences if not set
        pref = NotificationPreference(user_id=user_id)
        db.session.add(pref)
        db.session.commit()

    # 1. In-App Notification (Always stored if in_app is enabled)
    if pref.in_app:
        new_notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type
        )
        db.session.add(new_notif)
        db.session.commit()
        print(f"Stored in-app notification for user {user_id}")

    # 2. SMS Notification (via Twilio)
    if pref.sms:
        participant = PilotParticipant.query.filter_by(user_id=user_id).first()
        if participant and participant.phone_number:
            try:
                client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                client.messages.create(
                    body=f"{title}: {message}",
                    from_=TWILIO_PHONE_NUMBER,
                    to=participant.phone_number
                )
                print(f"Sent SMS to user {user_id}")
            except Exception as e:
                print(f"Failed to send SMS: {e}")

    # 3. Email/Push (Placeholders for now)
    if pref.email:
        print(f"Mock: Sending Email to user {user_id} - {title}")
    
    if pref.push:
        print(f"Mock: Sending Push notification to user {user_id} - {title}")

def trigger_notification(user_id, title, message, notification_type):
    """
    Helper function to queue the notification task.
    """
    send_notification_task.delay(user_id, title, message, notification_type)

def broadcast_pilot_notification(title, message, notification_type):
    """
    Sends notification to all pilot participants.
    """
    participants = PilotParticipant.query.all()
    for p in participants:
        trigger_notification(p.user_id, title, message, notification_type)
