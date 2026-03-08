from functools import wraps
from flask import request
from backend import db
from backend.models import ActivityLog
import logging

logger = logging.getLogger(__name__)

def track_activity(feature, action):
    """
    Decorator to log user activity to the database.
    Expects user_id in request.json or request.args.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            response = f(*args, **kwargs)
            
            # Only log on successful responses (2xx)
            if hasattr(response, 'status_code') and 200 <= response.status_code < 300:
                try:
                    # Attempt to get user_id from various sources
                    user_id = None
                    if request.is_json:
                        user_id = request.get_json().get('user_id')
                    if not user_id:
                        user_id = request.args.get('user_id', type=int)
                    
                    if user_id:
                        log = ActivityLog(
                            user_id=user_id,
                            feature=feature,
                            action=action
                        )
                        db.session.add(log)
                        db.session.commit()
                        logger.info(f"Activity logged: User {user_id} - {feature} - {action}")
                except Exception as e:
                    db.session.rollback()
                    logger.error(f"Failed to log activity: {e}")
            
            return response
        return decorated_function
    return decorator
