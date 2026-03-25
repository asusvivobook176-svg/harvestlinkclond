from flask import Blueprint, request, jsonify, current_app
from backend.services.market_intelligence_service import get_market_intelligence, UserType
from flask_cors import cross_origin
import asyncio
import logging
from datetime import datetime

try:
    from backend.routes.auth_routes import require_auth
except ImportError:
    def require_auth(f):
        return f

logger = logging.getLogger(__name__)

market_chatbot_bp = Blueprint('market_chatbot', __name__)


@market_chatbot_bp.route('/ask', methods=['POST'])
@cross_origin()
def ask_market_query():
    """Handle market intelligence queries"""
    try:
        data = request.json
        query = data.get('query')
        user_id = data.get('user_id', 1)
        user_type_str = data.get('user_type', 'shop_owner')
        location = data.get('location')

        if not query:
            return jsonify({'error': 'Query is required'}), 400

        market_service = get_market_intelligence()

        # Validate user_type enum
        try:
            user_type = UserType(user_type_str)
        except ValueError:
            user_type = UserType.SHOP_OWNER

        # Flask doesn't support async route handlers – run in a fresh event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            response = loop.run_until_complete(
                market_service.answer_market_query(
                    query=query,
                    user_id=user_id,
                    user_type=user_type,
                    location=location
                )
            )
        finally:
            loop.close()

        return jsonify(response)

    except Exception as e:
        logger.error(f"Market chatbot error: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500


@market_chatbot_bp.route('/price-check', methods=['GET'])
@cross_origin()
def get_price_check():
    """Get quick price check for a crop"""
    crop = request.args.get('crop', 'tomato')
    market_service = get_market_intelligence()
    data = market_service.market_data.get(crop.lower())

    if not data:
        return jsonify({'error': 'Crop not found'}), 404

    return jsonify({
        'crop': crop,
        'price': data['current_price'],
        'status': data['market_status'],
        'trend': 'up' if data['market_status'] == 'BULLISH' else 'stable'
    })


@market_chatbot_bp.route('/suppliers', methods=['GET'])
@cross_origin()
def get_suppliers():
    """Get suppliers for a crop and location"""
    crop = request.args.get('crop', 'tomato')
    location = request.args.get('location', 'coimbatore')

    market_service = get_market_intelligence()
    suppliers = market_service._get_nearby_suppliers(crop.lower(), location.lower())

    return jsonify({
        'crop': crop,
        'location': location,
        'suppliers': suppliers
    })


@market_chatbot_bp.route('/profit-calculator', methods=['POST'])
@cross_origin()
def calculate_profit():
    """Calculate estimated profit for a bulk purchase"""
    data = request.json
    crop = data.get('crop')
    qty = data.get('quantity', 100)  # kg
    buy_price = data.get('buy_price')

    market_service = get_market_intelligence()
    crop_data = market_service.market_data.get(crop.lower()) if crop else None

    if not crop_data:
        return jsonify({'error': 'Crop not found'}), 404

    sell_price = crop_data['current_price'] * 1.3  # 30% markup typical
    total_cost = qty * (buy_price or crop_data['current_price'])
    total_revenue = qty * sell_price
    profit = total_revenue - total_cost

    return jsonify({
        'crop': crop,
        'quantity': qty,
        'estimated_sell_price': round(sell_price, 2),
        'total_cost': round(total_cost, 2),
        'total_revenue': round(total_revenue, 2),
        'estimated_profit': round(profit, 2),
        'margin_percentage': round((profit / total_cost) * 100, 2) if total_cost > 0 else 0
    })


@market_chatbot_bp.route('/market-report', methods=['GET'])
@cross_origin()
def get_market_report():
    """Get high-level market summary report"""
    report = {
        'timestamp': datetime.utcnow().isoformat(),
        'top_demand': ['tomato', 'chilli', 'onion'],
        'price_alerts': [
            {'crop': 'Chilli', 'alert': 'Low supply, high demand. Prices rising fast.'},
            {'crop': 'Onion', 'alert': 'Large surplus in Salem market. Prices falling.'}
        ],
        'opportunities': [
            'Bulk buy onions now for long-term storage',
            'Tomato demand peaking next week in Chennai'
        ]
    }

    return jsonify(report)
