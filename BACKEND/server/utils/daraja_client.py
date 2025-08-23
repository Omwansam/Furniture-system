import base64
import requests
from datetime import datetime
from flask import current_app
import logging

logger = logging.getLogger(__name__)




def get_mpesa_access_token():

    """Generates an access token required for authenticating M-Pesa API calls."""

    url = current_app.config['DARAJA_AUTH_URL']
    consumer_key = current_app.config['MPESA_CONSUMER_KEY']
    consumer_secret = current_app.config['MPESA_CONSUMER_SECRET']

    logger.info(f"Getting M-Pesa access token from: {url}")
    logger.info(f"Consumer key: {consumer_key[:10]}...")  # Log first 10 chars for security

    credentials = f"{consumer_key}:{consumer_secret}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/json"
    }
    
    try:

        response = requests.get(url, headers=headers)
        logger.info(f"M-Pesa auth response status: {response.status_code}")
        logger.info(f"M-Pesa auth response headers: {dict(response.headers)}")
        
        # Check if response is JSON
        content_type = response.headers.get('content-type', '')
        if 'application/json' not in content_type:
            logger.error(f"Expected JSON response but got: {content_type}")
            logger.error(f"Response text: {response.text[:500]}")  # Log first 500 chars
            raise Exception(f"M-Pesa API returned non-JSON response. Status: {response.status_code}")
        
        try:
            response_data = response.json()
            logger.info(f"M-Pesa auth response: {response_data}")
        except Exception as json_error:
            logger.error(f"Failed to parse JSON response: {response.text[:500]}")
            raise Exception(f"Invalid JSON response from M-Pesa API: {str(json_error)}")

        if "access_token" in response_data:
            logger.info("M-Pesa access token obtained successfully")
            return response_data["access_token"]
        else:
            error_msg = response_data.get('error_description', 'Unknown error')
            logger.error(f"Error obtaining access token: {error_msg}")
            raise Exception(f"Error obtaining access token: {error_msg}")

    except requests.exceptions.RequestException as e:
        logger.error(f"Network error fetching M-pesa access token: {str(e)}")
        raise Exception(f"Network error: {str(e)}")
    except Exception as e:
        logger.error(f"Error fetching M-pesa access token: {str(e)}")
        raise Exception(f"Error fetching M-pesa access token: {str(e)}")
    

#######################################################################################################################################################################################################################    
def generate_mpesa_password(timestamp):
    """Generate M-Pesa API password"""
    shortcode = current_app.config['MPESA_SHORTCODE']
    passkey = current_app.config['MPESA_PASSKEY']
    return base64.b64encode(f"{shortcode}{passkey}{timestamp}".encode()).decode()
    

############################################################################################################################################################################################################    

def sanitize_phone_number(phone):
    """Convert phone number to 2547XXXXXXXX format"""
    phone = ''.join(c for c in str(phone) if c.isdigit())
    
    if phone.startswith('0'):
        return '254' + phone[1:]
    elif phone.startswith('+254'):
        return phone[1:]
    elif phone.startswith('254') and len(phone) == 12:
        return phone
    elif len(phone) == 9:  # Assumes 712345678
        return '254' + phone
    return None    

###########################################################################################################################################################################################################

def initiate_stk_push(phone_number, amount, order_id, description='Furniture Payment'):

    """ Initiates M-Pesa STK Push payment request"""  

    logger.info(f"Starting STK push for order {order_id}, amount {amount}, phone {phone_number}")

    access_token = get_mpesa_access_token()

    if not access_token:
        logger.error("Failed to authenticate with M-Pesa")
        return {"error": "Failed to authenticate with M-Pesa"}, 500

    # Validate and format phone number
    phone_number = sanitize_phone_number(phone_number)
    if not phone_number:
        logger.error("Invalid phone number format")
        return {"error": "Invalid phone number format. Use 2547XXXXXXXXX"}, 400
    
    try:

        amount = int(round(float(amount)))
        if amount <= 0:
            logger.error("Amount must be greater than 0")
            return{"error": "Amount must be greater than 0"},400
    except(ValueError, TypeError):
        logger.error("Invalid amount provided")
        return {"error": "Invalid amount"}, 400 


    #prepare the stk push request parameter
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password = generate_mpesa_password(timestamp)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "BusinessShortCode": current_app.config['MPESA_SHORTCODE'],
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": current_app.config['MPESA_SHORTCODE'],
        "PhoneNumber": phone_number,
        "CallBackURL": current_app.config['MPESA_CALLBACK_URL'],
        "AccountReference": str(order_id)[:12],  # Max 12 chars
        "TransactionDesc": description[:13]  # Max 13 chars
    }
    
    # Make API request
    try:
        stk_push_url = current_app.config.get('DARAJA_STK_PUSH_URL', current_app.config.get('MPESA_STK_PUSH_URL'))
        logger.info(f"Making STK push request to: {stk_push_url}")
        logger.info(f"STK push payload: {payload}")
        
        response = requests.post(
            stk_push_url,
            json=payload,
            headers=headers,
            timeout=30
        )
        logger.info(f"STK push response status: {response.status_code}")
        logger.info(f"STK push response headers: {dict(response.headers)}")
        
        # Check if response is JSON
        content_type = response.headers.get('content-type', '')
        if 'application/json' not in content_type:
            logger.error(f"Expected JSON response but got: {content_type}")
            logger.error(f"Response text: {response.text[:500]}")  # Log first 500 chars
            return {"error": f"M-Pesa API returned non-JSON response. Status: {response.status_code}"}, 500
        
        try:
            response_data = response.json()
            logger.info(f"STK push initiated successfully: {response_data}")
            return response_data, 200
        except Exception as json_error:
            logger.error(f"Failed to parse JSON response: {response.text[:500]}")
            return {"error": f"Invalid JSON response from M-Pesa API: {str(json_error)}"}, 500
        
    except requests.exceptions.RequestException as e:
        logger.error(f"STK Push failed: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                return error_data, e.response.status_code
            except:
                logger.error(f"Failed to parse error response: {e.response.text[:500]}")
                return {"error": f"Network error: {str(e)}"}, 500
        else:
            return {"error": f"Network error: {str(e)}"}, 500
    except Exception as e:
        logger.error(f"Unexpected error in STK Push: {str(e)}")
        return {"error": "Internal server error"}, 500   

###########################################################################################################################################################

