#!/usr/bin/env python3
"""
Seed script to populate the database with default settings
Run this script after creating the database to set up initial settings
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from models import db, Settings
from datetime import datetime

def seed_settings():
    """Seed the database with default settings"""
    
    # Default settings configuration
    default_settings = {
        'general': {
            'store_name': {
                'value': 'Vitrax Limited',
                'description': 'The name of your store as displayed to customers',
                'type': 'string'
            },
            'store_email': {
                'value': 'admin@vitrax.com',
                'description': 'Primary contact email for your store',
                'type': 'string'
            },
            'store_phone': {
                'value': '+254 700 000 000',
                'description': 'Primary contact phone number for your store',
                'type': 'string'
            },
            'store_address': {
                'value': 'Nairobi, Kenya',
                'description': 'Physical address of your store',
                'type': 'string'
            },
            'currency': {
                'value': 'KES',
                'description': 'Default currency for your store',
                'type': 'string'
            },
            'timezone': {
                'value': 'Africa/Nairobi',
                'description': 'Default timezone for your store',
                'type': 'string'
            },
            'tax_rate': {
                'value': 16.0,
                'description': 'Default tax rate percentage',
                'type': 'float'
            },
            'shipping_cost': {
                'value': 500.0,
                'description': 'Default shipping cost in local currency',
                'type': 'float'
            }
        },
        'notifications': {
            'email_notifications': {
                'value': True,
                'description': 'Enable email notifications',
                'type': 'boolean'
            },
            'order_notifications': {
                'value': True,
                'description': 'Get notified when new orders are placed',
                'type': 'boolean'
            },
            'low_stock_alerts': {
                'value': True,
                'description': 'Receive alerts when products are running low',
                'type': 'boolean'
            },
            'new_customer_alerts': {
                'value': True,
                'description': 'Get notified when new customers register',
                'type': 'boolean'
            },
            'marketing_emails': {
                'value': False,
                'description': 'Receive promotional and marketing emails',
                'type': 'boolean'
            },
            'inventory_alerts': {
                'value': True,
                'description': 'Receive inventory-related notifications',
                'type': 'boolean'
            },
            'payment_notifications': {
                'value': True,
                'description': 'Get notified of payment events',
                'type': 'boolean'
            }
        },
        'security': {
            'two_factor_auth': {
                'value': False,
                'description': 'Enable two-factor authentication for admin accounts',
                'type': 'boolean'
            },
            'session_timeout': {
                'value': 30,
                'description': 'Session timeout in minutes',
                'type': 'integer'
            },
            'password_expiry': {
                'value': 90,
                'description': 'Password expiry in days',
                'type': 'integer'
            },
            'login_attempts': {
                'value': 5,
                'description': 'Maximum login attempts before account lockout',
                'type': 'integer'
            },
            'password_min_length': {
                'value': 8,
                'description': 'Minimum password length',
                'type': 'integer'
            },
            'require_special_chars': {
                'value': True,
                'description': 'Require special characters in passwords',
                'type': 'boolean'
            },
            'ip_whitelist': {
                'value': [],
                'description': 'List of allowed IP addresses for admin access',
                'type': 'json'
            }
        },
        'payments': {
            'stripe_enabled': {
                'value': True,
                'description': 'Enable Stripe payment processing',
                'type': 'boolean'
            },
            'paypal_enabled': {
                'value': True,
                'description': 'Enable PayPal payment processing',
                'type': 'boolean'
            },
            'mpesa_enabled': {
                'value': True,
                'description': 'Enable M-Pesa mobile money payments',
                'type': 'boolean'
            },
            'bank_transfer_enabled': {
                'value': False,
                'description': 'Enable direct bank transfer payments',
                'type': 'boolean'
            },
            'cash_on_delivery': {
                'value': True,
                'description': 'Enable cash on delivery payments',
                'type': 'boolean'
            },
            'auto_capture': {
                'value': False,
                'description': 'Automatically capture payments on order completion',
                'type': 'boolean'
            },
            'payment_timeout': {
                'value': 30,
                'description': 'Payment timeout in minutes',
                'type': 'integer'
            }
        },
        'email': {
            'smtp_server': {
                'value': 'smtp.gmail.com',
                'description': 'SMTP server for sending emails',
                'type': 'string'
            },
            'smtp_port': {
                'value': 587,
                'description': 'SMTP port number',
                'type': 'integer'
            },
            'smtp_username': {
                'value': '',
                'description': 'SMTP username/email',
                'type': 'string'
            },
            'smtp_password': {
                'value': '',
                'description': 'SMTP password',
                'type': 'string'
            },
            'smtp_use_tls': {
                'value': True,
                'description': 'Use TLS encryption for SMTP',
                'type': 'boolean'
            },
            'from_email': {
                'value': 'noreply@vitrax.com',
                'description': 'Default sender email address',
                'type': 'string'
            },
            'from_name': {
                'value': 'Vitrax Limited',
                'description': 'Default sender name',
                'type': 'string'
            }
        },
        'social_media': {
            'facebook_enabled': {
                'value': False,
                'description': 'Enable Facebook integration',
                'type': 'boolean'
            },
            'instagram_enabled': {
                'value': False,
                'description': 'Enable Instagram integration',
                'type': 'boolean'
            },
            'twitter_enabled': {
                'value': False,
                'description': 'Enable Twitter integration',
                'type': 'boolean'
            },
            'linkedin_enabled': {
                'value': False,
                'description': 'Enable LinkedIn integration',
                'type': 'boolean'
            },
            'social_sharing': {
                'value': True,
                'description': 'Enable social sharing buttons on products',
                'type': 'boolean'
            }
        },
        'analytics': {
            'google_analytics_enabled': {
                'value': False,
                'description': 'Enable Google Analytics tracking',
                'type': 'boolean'
            },
            'google_analytics_id': {
                'value': '',
                'description': 'Google Analytics tracking ID',
                'type': 'string'
            },
            'facebook_pixel_enabled': {
                'value': False,
                'description': 'Enable Facebook Pixel tracking',
                'type': 'boolean'
            },
            'facebook_pixel_id': {
                'value': '',
                'description': 'Facebook Pixel ID',
                'type': 'string'
            },
            'track_conversions': {
                'value': True,
                'description': 'Track conversion events',
                'type': 'boolean'
            },
            'anonymize_ip': {
                'value': True,
                'description': 'Anonymize IP addresses for privacy',
                'type': 'boolean'
            }
        }
    }
    
    try:
        with app.app_context():
            # Check if settings already exist
            existing_settings = Settings.query.first()
            if existing_settings:
                print("Settings already exist in the database. Skipping seed.")
                return
            
            # Create settings
            created_count = 0
            for category, category_settings in default_settings.items():
                for setting_key, setting_data in default_settings[category].items():
                    setting = Settings(
                        setting_key=setting_key,
                        category=category,
                        description=setting_data['description'],
                        is_editable=True
                    )
                    setting.set_value(setting_data['value'])
                    db.session.add(setting)
                    created_count += 1
            
            db.session.commit()
            print(f"✅ Successfully created {created_count} default settings")
            
            # Print summary
            for category in default_settings.keys():
                count = Settings.query.filter_by(category=category).count()
                print(f"   {category}: {count} settings")
                
    except Exception as e:
        print(f"❌ Error seeding settings: {str(e)}")
        db.session.rollback()
        raise

if __name__ == '__main__':
    print("🌱 Seeding default settings...")
    seed_settings()
    print("✨ Settings seeding completed!")
