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

    credentials = f"{consumer_key}:{consumer_secret}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/json"
    }
    
    try:

        response = requests.get(url, headers=headers)
        response_data = response.json()

        if "access_token" in response_data:
            return response_data["access_token"]
        else:
            error_msg = response_data.get('error_description', 'Unknown error')
            logger.error(f"Error obtaining access token: {error_msg}")
            raise Exception(f"Error obtaining access token: {error_msg}")

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
        response = requests.post(
            current_app.config['MPESA_STK_PUSH_URL'],
            json=payload,
            headers=headers,
            timeout=30
        )
        response.raise_for_status()

        response_data = response.json()
        logger.info(f"stk push initiated successfully: {response_data}")
        return response_data, 200
        
    except requests.exceptions.RequestException as e:
        logger.error(f"STK Push failed: {str(e)}")
        try:
            error_data = e.response.json()
            return error_data, e.response.status_code
        except:
            return {"error": str(e)}, 500
    except Exception as e:
        logger.error(f"Unexpected error in STK Push: {str(e)}")
        return {"error": "Internal server error"}, 500   

###########################################################################################################################################################

