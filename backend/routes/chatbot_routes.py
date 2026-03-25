"""
Chatbot API Routes
Handles all chatbot interactions
"""

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import asyncio
import logging

from backend.services.chatbot_service import get_chatbot_service

from flask import g
try:
    from backend.routes.auth_routes import require_auth
except ImportError:
    def require_auth(f):
        return f

def get_current_user():
    class CurrentUser:
        id = getattr(g, 'user_id', 1)
    return CurrentUser()

chatbot_bp = Blueprint('chatbot', __name__)
logger = logging.getLogger(__name__)

chatbot_service = get_chatbot_service()


@chatbot_bp.route('/api/chatbot/ask', methods=['POST'])
@require_auth
@cross_origin()
def ask_chatbot():
    try:
        current_user = get_current_user()
        
        data = request.get_json()
        query = data.get('query')
        farm_data = data.get('farm_data')
        language = data.get('language', 'en')
        
        if not query:
            return jsonify({'error': 'Query required'}), 400
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        response = loop.run_until_complete(
            chatbot_service.process_query(
                query=query,
                user_id=current_user.id,
                farm_data=farm_data,
                language=language
            )
        )
        loop.close()
        
        return jsonify(response), 200
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        return jsonify({'error': str(e)}), 500


@chatbot_bp.route('/api/chatbot/history', methods=['GET'])
@require_auth
def get_chat_history():
    try:
        current_user = get_current_user()
        page = request.args.get('page', 1, type=int)
        
        return jsonify({
            'chats': [],
            'total': 0,
            'page': page
        }), 200
    except Exception as e:
        logger.error(f"Error fetching chat history: {e}")
        return jsonify({'error': str(e)}), 500


@chatbot_bp.route('/api/chatbot/suggestions', methods=['GET'])
@require_auth
def get_suggestions():
    try:
        crop = request.args.get('crop')
        suggestions = {
            'quick_questions': [
                "What fertilizer should I use?",
                "How much water does it need?",
                "What's the current market price?",
                "How to prevent diseases?",
                "Best planting time?"
            ],
            'crop_specific': {
                'tomato': [
                    "My tomato leaves have brown spots",
                    "How often to water?",
                    "When to harvest for best price?",
                    "What fertilizer mix for more yield?"
                ]
            }
        }
        if crop and crop.lower() in suggestions['crop_specific']:
            return jsonify({'suggestions': suggestions['crop_specific'][crop.lower()]}), 200
        
        return jsonify({'suggestions': suggestions['quick_questions']}), 200
    except Exception as e:
        logger.error(f"Error getting suggestions: {e}")
        return jsonify({'error': str(e)}), 500
