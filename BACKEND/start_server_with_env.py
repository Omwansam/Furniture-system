#!/usr/bin/env python3
"""
Start Flask server with proper environment variables
"""

import os
import sys

# Set environment variables directly
os.environ['SECRET_KEY'] = '12627e006079cc86b16d75f3'
os.environ['JWT_SECRET_KEY'] = '3e7262fb18190b962c35a39f'
os.environ['DATABASE_URL'] = 'sqlite:///vitraxlimited.db'

# M-Pesa sandbox credentials
os.environ['MPESA_CONSUMER_KEY'] = 'BCjpmMKEzK95mr7AwYYkSCQhjCCgiqyV9lhsch1ETO39lpAx'
os.environ['MPESA_CONSUMER_SECRET'] = 'duoaeGtyLHSS0nKbBfuy9qRDv74AAGNKEKCudzXD0QGD2B1qcchbwpOSAW9FhQYA'
os.environ['MPESA_SHORTCODE'] = '174379'
os.environ['MPESA_PASSKEY'] = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
os.environ['MPESA_CALLBACK_URL'] = 'https://6e3364172bc9.ngrok-free.app/callback'
os.environ['MPESA_ENVIRONMENT'] = 'sandbox'

# Email Configuration
os.environ['MAIL_SERVER'] = 'smtp.gmail.com'
os.environ['MAIL_PORT'] = '587'
os.environ['MAIL_USE_TLS'] = 'true'
os.environ['MAIL_USERNAME'] = 'your-email@gmail.com'
os.environ['MAIL_PASSWORD'] = 'your-app-password'
os.environ['MAIL_DEFAULT_SENDER'] = 'your-email@gmail.com'

# Stripe Configuration
os.environ['STRIPE_SECRET_KEY'] = 'your-stripe-secret-key'
os.environ['STRIPE_WEBHOOK_SECRET'] = 'your-stripe-webhook-secret'

print("🔧 Environment variables set successfully!")
print("✅ MPESA_CONSUMER_KEY:", os.environ['MPESA_CONSUMER_KEY'][:10] + "...")
print("✅ MPESA_CONSUMER_SECRET:", os.environ['MPESA_CONSUMER_SECRET'][:10] + "...")
print("✅ MPESA_SHORTCODE:", os.environ['MPESA_SHORTCODE'])
print("✅ MPESA_ENVIRONMENT:", os.environ['MPESA_ENVIRONMENT'])

# Add server directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

# Import and run the Flask app
from server.app import app

if __name__ == '__main__':
    print("\n🚀 Starting Flask server with M-Pesa configuration...")
    print("🌐 Server will be available at: http://localhost:5000")
    print("📱 M-Pesa endpoints:")
    print("   - POST /payments/mpesa/stkpush")
    print("   - GET /payments/mpesa/status/<checkout_request_id>")
    print("   - GET /payments/test-mpesa-config")
    print("\n" + "="*60)
    
    app.run(debug=True, port=5000, host='0.0.0.0')
