# Payment Gateway Integration

This service provides a unified interface for multiple payment gateways across African markets.

## Supported Payment Providers

### Mobile Money
- **M-PESA** (Kenya) - STK Push via Daraja API
- **MTN MoMo** (Uganda, Ghana, Rwanda, etc.)
- **Airtel Money** (Uganda, Ghana, Rwanda, etc.)

### Card & Bank Payments
- **Flutterwave** - Pan-African payment gateway
- **Korapay** - Nigeria-focused payment gateway
- **DGateway** - Rwanda payment gateway
- **Card Payments** - Visa, Mastercard via Flutterwave
- **Bank Transfer** - Direct bank transfers

## Setup Instructions

### 1. Environment Configuration

Copy the `.env.example` to `.env` and configure your payment gateway credentials:

```bash
cp .env.example .env
```

Add your payment gateway credentials to the `.env` file:

```env
# MPesa Connect (Daraja API)
VITE_MPESA_CONSUMER_KEY=your_consumer_key
VITE_MPESA_CONSUMER_SECRET=your_consumer_secret
VITE_MPESA_PASSKEY=your_passkey
VITE_MPESA_SHORTCODE=your_shortcode

# Flutterwave
VITE_FLUTTERWAVE_PUBLIC_KEY=your_public_key
VITE_FLUTTERWAVE_SECRET_KEY=your_secret_key

# Korapay
VITE_KORAPAY_PUBLIC_KEY=your_public_key
VITE_KORAPAY_SECRET_KEY=your_secret_key

# DGateway
VITE_DGATEWAY_PUBLIC_KEY=your_public_key
VITE_DGATEWAY_SECRET_KEY=your_secret_key

# MTN MoMo
VITE_MTN_MOMO_API_KEY=your_api_key
VITE_MTN_MOMO_API_SECRET=your_api_secret

# Airtel Money
VITE_AIRTEL_CLIENT_ID=your_client_id
VITE_AIRTEL_CLIENT_SECRET=your_client_secret
```

### 2. Backend API Setup

Your backend API needs to implement the following endpoints:

#### MPesa Endpoints
- `POST /api/payment/mpesa/stk-push` - Initiate STK Push
- `POST /api/payment/mpesa/verify` - Verify payment status

#### MTN MoMo Endpoints
- `POST /api/payment/mtn-momo/charge` - Initiate MTN MoMo payment
- `POST /api/payment/mtn-momo/verify` - Verify payment status

#### Airtel Money Endpoints
- `POST /api/payment/airtel/charge` - Initiate Airtel Money payment
- `POST /api/payment/airtel/verify` - Verify payment status

#### Flutterwave Endpoints
- `POST /api/payment/flutterwave/charge` - Initiate Flutterwave payment
- `POST /api/payment/flutterwave/verify` - Verify payment status

#### Korapay Endpoints
- `POST /api/payment/korapay/charge` - Initiate Korapay payment
- `POST /api/payment/korapay/verify` - Verify payment status

#### DGateway Endpoints
- `POST /api/payment/dgateway/charge` - Initiate DGateway payment
- `POST /api/payment/dgateway/verify` - Verify payment status

#### General Payment Endpoints
- `POST /api/payment/verify` - Generic payment verification
- `POST /api/payment/bank-transfer/initiate` - Initiate bank transfer

### 3. Usage Example

```typescript
import { paymentService, PaymentProvider } from '../services/paymentService';

// Initiate payment
const paymentResponse = await paymentService.initiatePayment({
  amount: 500,
  phone_number: '+254712345678',
  currency: 'KES',
  country_code: 'KE',
  provider: 'mpesa',
  customer_email: 'user@example.com',
  customer_name: 'John Doe',
});

// Verify payment
const verification = await paymentService.verifyPayment(
  paymentResponse.reference,
  'mpesa'
);

// Get available payment methods for a country
const methods = paymentService.getAvailablePaymentMethods('KE');
// Returns: ['mpesa', 'card', 'bank_transfer', 'flutterwave']
```

## Country-Specific Payment Methods

The service automatically provides the most relevant payment methods based on the user's country:

- **Kenya (KE)**: M-PESA, Card, Bank Transfer, Flutterwave
- **Uganda (UG)**: MTN MoMo, Airtel Money, Card, Bank Transfer, Flutterwave
- **Tanzania (TZ)**: MTN MoMo, Airtel Money, Card, Bank Transfer, Flutterwave
- **Ghana (GH)**: MTN MoMo, Airtel Money, Card, Bank Transfer, Korapay
- **Rwanda (RW)**: MTN MoMo, Airtel Money, Card, Bank Transfer, DGateway
- **Zambia (ZM)**: MTN MoMo, Airtel Money, Card, Bank Transfer, Flutterwave
- **Nigeria (NG)**: Card, Bank Transfer, Korapay, Flutterwave
- **Cameroon (CM)**: MTN MoMo, Airtel Money, Card, Bank Transfer, Flutterwave
- **Côte d'Ivoire (CI)**: MTN MoMo, Airtel Money, Card, Bank Transfer, Flutterwave

## Payment Flow

1. **User Selection**: User selects country and payment method
2. **Payment Initiation**: Frontend calls `paymentService.initiatePayment()`
3. **Authorization**: User completes payment (STK Push, OTP, Redirect)
4. **Verification**: Frontend polls `paymentService.verifyPayment()`
5. **Completion**: Payment status updated, wallet credited

## Security Notes

- **Never commit `.env` files** to version control
- **Use environment variables** for all sensitive credentials
- **Implement proper webhook verification** on your backend
- **Use HTTPS** for all payment-related API calls
- **Validate all payment responses** on your backend server

## Testing

Each payment gateway provides sandbox/test environments:

- **MPesa**: Use Daraja sandbox environment
- **Flutterwave**: Use test mode with test keys
- **Korapay**: Use test environment during development
- **DGateway**: Use test keys for development

## Support

For payment gateway-specific issues, refer to:
- [MPesa Daraja Documentation](https://developer.safaricom.co.ke/Documentation)
- [Flutterwave Documentation](https://developer.flutterwave.com/docs)
- [Korapay Documentation](https://docs.korapay.com/)
- [DGateway Documentation](https://dgateway.desispay.com/docs)