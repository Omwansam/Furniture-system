# Stripe Payment Integration Setup

## Backend Configuration

### 1. Environment Variables
Create a `.env` file in the `BACKEND/server/` directory with the following Stripe configuration:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
```

### 2. Get Your Stripe Keys
1. Sign up for a Stripe account at https://stripe.com
2. Go to the Stripe Dashboard
3. Navigate to Developers > API Keys
4. Copy your Publishable Key and Secret Key
5. Replace the placeholder values in your `.env` file

### 3. Install Stripe Python Package
Make sure you have the Stripe Python package installed:

```bash
cd BACKEND
pipenv install stripe
```

## Frontend Configuration

### 1. Update Stripe Publishable Key
In `FRONTEND/vitrax-limited/src/components/BillingForm.jsx`, update the Stripe publishable key:

```javascript
// Replace with your actual Stripe publishable key
const stripe = window.Stripe ? window.Stripe('pk_test_your_stripe_publishable_key_here') : null;
```

## How It Works

### Payment Flow:
1. User selects "Credit Card (Stripe)" payment method
2. User fills billing form and submits
3. Backend creates order and Stripe payment intent
4. Frontend processes payment through Stripe
5. Payment is confirmed and user is redirected to order confirmation

### API Endpoints:
- `POST /stripe/create-payment-intent` - Creates Stripe payment intent
- `POST /stripe/confirm-payment` - Confirms payment
- `POST /stripe/webhook` - Handles Stripe webhooks
- `POST /stripe/refund` - Creates refunds

### Security:
- All payments are processed through Stripe's secure infrastructure
- Payment data never touches your server
- Webhook verification ensures payment authenticity

## Testing

### Test Cards:
Use these test card numbers for testing:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Authentication: `4000 0025 0000 3155`

### Test Mode:
- All transactions are in test mode by default
- No real charges will be made
- Switch to live mode by updating keys in production

## Production Deployment

1. Update Stripe keys to live keys
2. Set up webhook endpoints in Stripe Dashboard
3. Configure proper error handling
4. Test thoroughly before going live
