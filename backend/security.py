from flask import request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import re
from functools import wraps

# Initialize Limiter
# Note: In production, use redis or memcached for storage_uri
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000 per day", "200 per hour"],
    storage_uri="memory://"
)

@limiter.request_filter
def exempt_options():
    return request.method == "OPTIONS"

def sanitize_string(s):
    """Basic string sanitization to remove common malicious characters."""
    if not isinstance(s, str):
        return s
    # Remove HTML tags
    s = re.sub(r'<[^>]*?>', '', s)
    # Basic SQL/Script characters removal (very simplistic for now)
    # In a real app, use prepared statements (which we do via SQLAlchemy)
    # and properly escaped frontend frameworks (which we do via React)
    return s.strip()

def sanitize_json(data):
    """Recursively sanitize dictionary values."""
    if isinstance(data, dict):
        return {k: sanitize_json(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_json(v) for v in data]
    else:
        return sanitize_string(data)

def validate_input(f):
    """Decorator to sanitize incoming JSON data."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.is_json:
            request.json_sanitized = sanitize_json(request.get_json())
        return f(*args, **kwargs)
    return decorated_function

def handle_rate_limit_error(e):
    return jsonify(error="Rate limit exceeded", details=str(e.description)), 429
