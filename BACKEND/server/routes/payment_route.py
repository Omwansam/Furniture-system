from flask import Blueprint, request, jsonify, current_app
from extensions import db
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import logging


from models import Order, PaymentStatus, Payment, PaymentResponse, Transaction
from utils.daraja_client import initiate_stk_push

#Blueprint Configuration
payment_bp = Blueprint('payment', __name__)


def _extract_user_id(identity):
    if identity is None:
        return None
    if isinstance(identity, dict):
        return identity.get('id')
    return identity
logger=logging.getLogger(__name__)



@payment_bp.route('/mpesa/stkpush', methods=['POST'])
@jwt_required()
def mpesa_stk_push():
    """
    Initiate M-Pesa STK Push payment
    Required JSON:
    {
        "phone_number": "2547XXXXXXXX",
        "order_id": 123,
        "amount": 1000
    }
    """
    identity = get_jwt_identity()
    user_id = _extract_user_id(identity)
    data = request.get_json()
    
    logger.info(f"M-Pesa STK Push request received: {data}")
    logger.info(f"User ID: {user_id}")
    
    # Validate input
    required_fields = ['phone_number', 'order_id', 'amount']
    if not all(field in data for field in required_fields):
        logger.error(f"Missing required fields. Received: {data}")
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        amount = float(data['amount'])
        if amount <= 0:
            return jsonify({"error": "Amount must be greater than 0"}), 400
    except ValueError:
        return jsonify({"error": "Invalid amount"}), 400
    
    # Verify order belongs to user
    order = Order.query.filter_by(order_id=data['order_id'], user_id=user_id).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404
    
    # Check if order already has a payment
    if order.payment and order.payment.payment_status != PaymentStatus.PENDING:
        return jsonify({"error": "Order already has a completed payment"}), 400
    
    # Use the helper function to initiate STK Push
    logger.info(f"Initiating STK push for order {data['order_id']} with amount {data['amount']}")
    response, status_code = initiate_stk_push(
        phone_number=data['phone_number'],
        amount=data['amount'],
        order_id=data['order_id'],
        description=f"Payment for order {data['order_id']}"
    )
    
    logger.info(f"STK push response: {response}, status: {status_code}")
    
    if status_code != 200:
        logger.error(f"STK push failed with status {status_code}: {response}")
        return jsonify(response), status_code
    
    # Create or update payment record if STK Push was successful
    if order.payment:
        payment = order.payment
        payment.payment_amount = str(amount)
        payment.transaction_id = response.get('CheckoutRequestID')
        payment.payment_status = PaymentStatus.PENDING
    else:
        payment = Payment(
            order_id=data['order_id'],
            user_id =user_id,
            payment_amount=str(amount),
            transaction_id=response.get('CheckoutRequestID'),
            payment_status=PaymentStatus.PENDING,
            payment_method_id=1  # Assuming 1 is M-Pesa payment method ID
        )
    db.session.add(payment)
    db.session.commit()

    #Create Transaction record
    transactions = Transaction(
        transaction_id=response.get('MerchantRequestID'),
        amount=amount,
        phone_number=data['phone_number'],
        status='PENDING',
        payment=payment,
        user_id=user_id
    )
    db.session.add(transactions)

    try:
        db.session.commit()
        return jsonify({
            "message": "STK Push initiated successfully",
            "checkout_request_id": response.get('CheckoutRequestID'),
            "merchant_request_id": response.get('MerchantRequestID'),
            "payment_id": payment.payment_id
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Database error: {str(e)}")
        return jsonify({"error": "Failed to save payment details"}), 500
    


######################################################################################################################################################################################

@payment_bp.route('/test-mpesa-config', methods=['GET'])
def test_mpesa_config():
    """Test endpoint to verify M-Pesa configuration"""
    try:
        # Check if all required environment variables are set
        required_vars = [
            'MPESA_CONSUMER_KEY',
            'MPESA_CONSUMER_SECRET', 
            'MPESA_SHORTCODE',
            'MPESA_PASSKEY',
            'MPESA_CALLBACK_URL'
        ]
        
        missing_vars = []
        config_values = {}
        
        for var in required_vars:
            value = current_app.config.get(var)
            if not value:
                missing_vars.append(var)
            else:
                # Mask sensitive values
                if 'KEY' in var or 'SECRET' in var or 'PASSKEY' in var:
                    config_values[var] = value[:10] + "..." if len(value) > 10 else "***"
                else:
                    config_values[var] = value
        
        if missing_vars:
            return jsonify({
                "success": False,
                "error": f"Missing required environment variables: {', '.join(missing_vars)}",
                "missing_vars": missing_vars,
                "config": config_values
            }), 400
        
        # Test access token generation
        from utils.daraja_client import get_mpesa_access_token
        
        access_token = get_mpesa_access_token()
        
        return jsonify({
            "success": True,
            "message": "M-Pesa configuration is working",
            "access_token": access_token[:20] + "..." if access_token else None,
            "config": config_values
        }), 200
    except Exception as e:
        logger.error(f"M-Pesa config test failed: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "config": {
                "auth_url": current_app.config.get('DARAJA_AUTH_URL'),
                "stk_push_url": current_app.config.get('DARAJA_STK_PUSH_URL'),
                "environment": current_app.config.get('MPESA_ENVIRONMENT')
            }
        }), 500

@payment_bp.route('/callback', methods=['POST'])
def payment_callback():
    try:
        callback_data = request.get_json()
        logger.info(f"Received callback: {json.dumps(callback_data, indent=2)}")
        
        if not callback_data or 'Body' not in callback_data or 'stkCallback' not in callback_data['Body']:
            logger.error("Invalid callback structure received")
            return jsonify({"ResultCode": 1, "ResultDesc": "Invalid callback structure"}), 400

        stk_callback = callback_data['Body']['stkCallback']
        result_code = stk_callback.get('ResultCode')
        result_desc = stk_callback.get('ResultDesc')
        merchant_request_id = stk_callback.get('MerchantRequestID')
        checkout_request_id = stk_callback.get('CheckoutRequestID')

        # Save the raw callback response
        payment_response = PaymentResponse(
            response_code=str(result_code),
            response_description=result_desc,
            merchant_request_id=merchant_request_id,
            checkout_request_id=checkout_request_id,
            result_code=str(result_code),
            result_description=result_desc,
            raw_callback=callback_data
        )
        db.session.add(payment_response)

        # Find the related payment
        payment = Payment.query.filter_by(transaction_id=checkout_request_id).first()
        if not payment:
            logger.error(f"Payment not found for checkout_request_id: {checkout_request_id}")
            return jsonify({"ResultCode": 1, "ResultDesc": "Payment not found"}), 404

        # Link the response to the payment
        payment_response.payment_id = payment.payment_id

        # Process successful payments
        if str(result_code) == '0':
            callback_metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
            payment_details = {
                'amount': None,
                'mpesa_receipt': None,
                'phone_number': None,
                'transaction_date': None
            }

            for item in callback_metadata:
                name = item.get('Name')
                value = item.get('Value')
                if name == 'Amount':
                    payment_details['amount'] = value
                elif name == 'MpesaReceiptNumber':
                    payment_details['mpesa_receipt'] = value
                elif name == 'PhoneNumber':
                    payment_details['phone_number'] = value
                elif name == 'TransactionDate':
                    payment_details['transaction_date'] = value

            logger.info(f"Payment successful. Details: {payment_details}")

            # Update payment status
            payment.payment_status = PaymentStatus.COMPLETED
            payment.payment_date = datetime.now()

            # Update transaction
            transaction = Transaction.query.filter_by(transaction_id=merchant_request_id).first()
            if transaction:
                transaction.status = 'COMPLETED'
                transaction.mpesa_receipt_number = payment_details['mpesa_receipt']
                transaction.amount = payment_details['amount']
        else:
            # Payment failed
            payment.payment_status = PaymentStatus.FAILED
            transaction = Transaction.query.filter_by(transaction_id=merchant_request_id).first()
            if transaction:
                transaction.status = 'FAILED'

        db.session.commit()
        logger.info("Callback processed successfully")
        
        return jsonify({
            "ResultCode": 0,
            "ResultDesc": "Callback processed successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error processing callback: {str(e)}", exc_info=True)
        return jsonify({
            "ResultCode": 1,
            "ResultDesc": f"Error processing callback: {str(e)}"
        }), 500