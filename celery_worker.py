from app import app
from backend.services.notification_service import celery

if __name__ == '__main__':
    with app.app_context():
        celery.start()
