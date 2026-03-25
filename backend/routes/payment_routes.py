from flask import Blueprint, request, jsonify
import razorpay
import os
from backend.utils.exceptions import ValidationError, HarvestLinkError
from backend.routes.auth_routes import require_auth
import logging

payment_bp = Blueprint('payment', __name__)
logger = logging.getLogger('harvestlink.payment')

# Razorpay client initialization
# In production, these should be in environment variables
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', 'rzp_test_placeholder')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', 'placeholder_secret')

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

@payment_bp.route('/create-order', methods=['POST'])
@require_auth
def create_order():
    """Create a new Razorpay order"""
    try:
        data = request.get_json()
        amount = data.get('amount') # in paise (e.g. 500.00 INR = 50000 paise)
        currency = data.get('currency', 'INR')
        
        if not amount or not isinstance(amount, int):
            raise ValidationError("Invalid amount. Must be an integer in paise.")

        order_data = {
            'amount': amount,
            'currency': currency,
            'payment_capture': 1 # auto capture
        }
        
        order = client.order.create(data=order_data)
        return jsonify(order), 200
        
    except Exception as e:
        logger.error(f"Error creating Razorpay order: {e}")
        return jsonify({"error": "Could not create payment order"}), 500

@payment_bp.route('/verify', methods=['POST'])
@require_auth
def verify_payment():
    """Verify Razorpay payment signature"""
    try:
        data = request.get_json()
        params_dict = {
            'razorpay_order_id': data.get('razorpay_order_id'),
            'razorpay_payment_id': data.get('razorpay_payment_id'),
            'razorpay_signature': data.get('razorpay_signature')
        }
        
        # Verify signature
        try:
            client.utility.verify_payment_signature(params_dict)
            # Payment success logic here (e.g. update order status in DB)
            return jsonify({"status": "Payment verified"}), 200
        except Exception:
            return jsonify({"status": "Payment verification failed"}), 400
            
    except Exception as e:
        logger.error(f"Error verifying payment: {e}")
        return jsonify({"error": "Could not verify payment"}), 500
