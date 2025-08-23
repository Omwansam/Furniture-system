# M-Pesa Integration Setup Guide

## Prerequisites

1. **M-Pesa Developer Account**: Sign up at https://developer.safaricom.co.ke/
2. **Daraja API Access**: Request access to the Daraja API
3. **Test Credentials**: Get sandbox credentials for testing

## Environment Variables Setup

Add these variables to your `.env` file in the `BACKEND/server/` directory:

```env
# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=your_shortcode_here
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=http://localhost:5000/payments/callback
MPESA_ENVIRONMENT=sandbox
```

## Getting M-Pesa Credentials

### 1. Sandbox Environment (Testing)
1. Go to https://developer.safaricom.co.ke/
2. Log in to your account
3. Navigate to "My Apps" → "Sandbox"
4. Create a new app or use existing one
5. Copy the Consumer Key and Consumer Secret
6. Use the default sandbox shortcode: `174379`
7. Use the default sandbox passkey: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`

### 2. Production Environment
1. Apply for production access
2. Get your production credentials from Safaricom
3. Set `MPESA_ENVIRONMENT=production` in your `.env`

## Testing the Setup

### 1. Test Configuration
```bash
curl http://localhost:5000/payments/test-mpesa-config
```

Expected response:
```json
{
  "success": true,
  "message": "M-Pesa configuration is working",
  "access_token": "abc123...",
  "config": {
    "MPESA_CONSUMER_KEY": "abc123...",
    "MPESA_CONSUMER_SECRET": "xyz789...",
    "MPESA_SHORTCODE": "174379",
    "MPESA_PASSKEY": "bfb279f9...",
    "MPESA_CALLBACK_URL": "http://localhost:5000/payments/callback",
    "MPESA_ENVIRONMENT": "sandbox"
  }
}
```

### 2. Test STK Push
```bash
curl -X POST http://localhost:5000/payments/mpesa/stkpush \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "phone_number": "254708374149",
    "order_id": 1,
    "amount": 1
  }'
```

## Troubleshooting

### Common Issues

#### 1. "Missing required environment variables"
**Solution**: Check your `.env` file and ensure all M-Pesa variables are set.

#### 2. "M-Pesa API returned non-JSON response"
**Solution**: 
- Verify your Consumer Key and Secret are correct
- Check if you're using the right environment (sandbox vs production)
- Ensure your IP is whitelisted (for production)

#### 3. "Invalid phone number format"
**Solution**: Use the format `2547XXXXXXXX` (12 digits starting with 254)

#### 4. "Access token error"
**Solution**:
- Verify your Consumer Key and Secret
- Check network connectivity
- Ensure you're using the correct API URLs

### Test Phone Numbers

Use these test phone numbers for sandbox testing:
- **Success**: `254708374149`
- **Insufficient Funds**: `254708374150`
- **User Cancelled**: `254708374151`

### Debug Steps

1. **Check Environment Variables**:
   ```bash
   curl http://localhost:5000/payments/test-mpesa-config
   ```

2. **Check Backend Logs**:
   Look for detailed error messages in your Flask server logs

3. **Test API Endpoints**:
   ```bash
   # Test auth endpoint directly
   curl -H "Authorization: Basic $(echo -n 'your_consumer_key:your_consumer_secret' | base64)" \
        https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
   ```

## Production Deployment

1. **Update Environment Variables**:
   - Set `MPESA_ENVIRONMENT=production`
   - Use production credentials
   - Update callback URL to your production domain

2. **Whitelist Your IP**:
   - Add your server's IP to the M-Pesa whitelist
   - Contact Safaricom support if needed

3. **SSL Certificate**:
   - Ensure your callback URL uses HTTPS
   - Valid SSL certificate required for production

## Security Best Practices

1. **Never commit credentials to version control**
2. **Use environment variables for all sensitive data**
3. **Rotate credentials regularly**
4. **Monitor API usage and logs**
5. **Implement proper error handling**

## Support

- **Safaricom Developer Portal**: https://developer.safaricom.co.ke/
- **Daraja API Documentation**: https://developer.safaricom.co.ke/docs
- **Community Forum**: https://developer.safaricom.co.ke/community
