// Payment Gateway Service
// SECURITY: Payment provider is determined by backend admin settings
// Frontend cannot override the payment method - this prevents fraud
// All payment verification is done server-side for security

export type PaymentProvider = 'mpesa' | 'mtn_momo' | 'airtel_money' | 'card' | 'bank_transfer' | 'flutterwave' | 'korapay' | 'dgateway' | 'megapay' | 'tenz' | 'pesaflux' | 'pesapal' | 'pawapay' | 'intasend';

export interface PaymentRequest {
  amount: number;
  phone_number: string;
  currency?: string;
  country_code?: string;
  provider: PaymentProvider;
  reference?: string;
  callback_url?: string;
  customer_email?: string;
  customer_name?: string;
}

export interface PaymentResponse {
  success: boolean;
  reference: string;
  message: string;
  status: 'pending' | 'completed' | 'failed';
  provider: PaymentProvider;
  checkout_url?: string;
  auth_model?: 'STK_PROMPT' | 'OTP' | 'REDIRECT';
  requires_action?: boolean;
}

export interface PaymentVerification {
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  amount?: number;
}

class PaymentService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    this.token = localStorage.getItem('player_token') || localStorage.getItem('token');
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // MPesa Connect Integration (Daraja API)
  async initiateMpesaPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/player/deposit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          provider: 'mpesa',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id || `MPESA-${Date.now()}`,
          message: data.message || 'Deposit initiated successfully',
          status: data.status || 'pending',
          provider: 'mpesa',
          auth_model: 'STK_PROMPT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'Payment failed. Please check your details and try again.',
          status: 'failed',
          provider: 'mpesa',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error. Please check your connection and try again.',
        status: 'failed',
        provider: 'mpesa',
      };
    }
  }

  // MTN Mobile Money Integration
  async initiateMtnMoMoPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/mtn-momo/charge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          currency: request.currency || 'UGX',
          reference: request.reference || `MTN-${Date.now()}`,
          customer_email: request.customer_email,
          customer_name: request.customer_name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'MTN MoMo payment initiated',
          status: 'pending',
          provider: 'mtn_momo',
          auth_model: data.auth_model || 'STK_PROMPT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'MTN MoMo payment failed',
          status: 'failed',
          provider: 'mtn_momo',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating MTN MoMo payment',
        status: 'failed',
        provider: 'mtn_momo',
      };
    }
  }

  // Airtel Money Integration
  async initiateAirtelPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/airtel/charge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          currency: request.currency || 'UGX',
          reference: request.reference || `AIRTEL-${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'Airtel Money payment initiated',
          status: 'pending',
          provider: 'airtel_money',
          auth_model: 'STK_PROMPT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'Airtel Money payment failed',
          status: 'failed',
          provider: 'airtel_money',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating Airtel Money payment',
        status: 'failed',
        provider: 'airtel_money',
      };
    }
  }

  // Flutterwave Integration (Card + Mobile Money)
  async initiateFlutterwavePayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/flutterwave/charge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          currency: request.currency || 'KES',
          reference: request.reference || `FW-${Date.now()}`,
          customer_email: request.customer_email,
          customer_name: request.customer_name,
          redirect_url: request.callback_url,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'Flutterwave payment initiated',
          status: 'pending',
          provider: 'flutterwave',
          checkout_url: data.checkout_url || data.link,
          auth_model: data.auth_model || 'REDIRECT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'Flutterwave payment failed',
          status: 'failed',
          provider: 'flutterwave',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating Flutterwave payment',
        status: 'failed',
        provider: 'flutterwave',
      };
    }
  }

  // Korapay Integration
  async initiateKorapayPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/korapay/charge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          currency: request.currency || 'NGN',
          reference: request.reference || `KORA-${Date.now()}`,
          customer_email: request.customer_email,
          customer_name: request.customer_name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'Korapay payment initiated',
          status: 'pending',
          provider: 'korapay',
          auth_model: data.auth_model || 'STK_PROMPT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'Korapay payment failed',
          status: 'failed',
          provider: 'korapay',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating Korapay payment',
        status: 'failed',
        provider: 'korapay',
      };
    }
  }

  // DGateway Integration
  async initiateDGatewayPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/dgateway/charge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          currency: request.currency || 'RWF',
          reference: request.reference || `DG-${Date.now()}`,
          customer_email: request.customer_email,
          customer_name: request.customer_name,
          redirect_url: request.callback_url,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'DGateway payment initiated',
          status: 'pending',
          provider: 'dgateway',
          checkout_url: data.checkout_url || data.payment_url,
          auth_model: data.auth_model || 'REDIRECT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'DGateway payment failed',
          status: 'failed',
          provider: 'dgateway',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating DGateway payment',
        status: 'failed',
        provider: 'dgateway',
      };
    }
  }

  // Megapay Integration
  async initiateMegapayPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/megapay/charge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          currency: request.currency || 'KES',
          reference: request.reference || `MEGA-${Date.now()}`,
          customer_email: request.customer_email,
          customer_name: request.customer_name,
          redirect_url: request.callback_url,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'Megapay payment initiated',
          status: 'pending',
          provider: 'megapay',
          checkout_url: data.checkout_url || data.payment_url,
          auth_model: data.auth_model || 'REDIRECT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'Megapay payment failed',
          status: 'failed',
          provider: 'megapay',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating Megapay payment',
        status: 'failed',
        provider: 'megapay',
      };
    }
  }

  // Tenz Integration
  async initiateTenzPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/tenz/charge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          currency: request.currency || 'KES',
          reference: request.reference || `TENZ-${Date.now()}`,
          customer_email: request.customer_email,
          customer_name: request.customer_name,
          redirect_url: request.callback_url,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'Tenz payment initiated',
          status: 'pending',
          provider: 'tenz',
          checkout_url: data.checkout_url || data.payment_url,
          auth_model: data.auth_model || 'REDIRECT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'Tenz payment failed',
          status: 'failed',
          provider: 'tenz',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating Tenz payment',
        status: 'failed',
        provider: 'tenz',
      };
    }
  }

  // Pesaflux Integration
  async initiatePesafluxPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/pesaflux/charge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          currency: request.currency || 'KES',
          reference: request.reference || `FLUX-${Date.now()}`,
          customer_email: request.customer_email,
          customer_name: request.customer_name,
          redirect_url: request.callback_url,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'Pesaflux payment initiated',
          status: 'pending',
          provider: 'pesaflux',
          checkout_url: data.checkout_url || data.payment_url,
          auth_model: data.auth_model || 'REDIRECT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'Pesaflux payment failed',
          status: 'failed',
          provider: 'pesaflux',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating Pesaflux payment',
        status: 'failed',
        provider: 'pesaflux',
      };
    }
  }

  // PesaPal Integration
  async initiatePesapalPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/pesapal/charge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          currency: request.currency || 'KES',
          reference: request.reference || `PESA-${Date.now()}`,
          customer_email: request.customer_email,
          customer_name: request.customer_name,
          redirect_url: request.callback_url,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'PesaPal payment initiated',
          status: 'pending',
          provider: 'pesapal',
          checkout_url: data.checkout_url || data.payment_url,
          auth_model: data.auth_model || 'REDIRECT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'PesaPal payment failed',
          status: 'failed',
          provider: 'pesapal',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating PesaPal payment',
        status: 'failed',
        provider: 'pesapal',
      };
    }
  }

  // Pawapay Integration
  async initiatePawapayPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/pawapay/charge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          currency: request.currency || 'KES',
          reference: request.reference || `PAWA-${Date.now()}`,
          customer_email: request.customer_email,
          customer_name: request.customer_name,
          redirect_url: request.callback_url,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'Pawapay payment initiated',
          status: 'pending',
          provider: 'pawapay',
          auth_model: data.auth_model || 'STK_PROMPT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'Pawapay payment failed',
          status: 'failed',
          provider: 'pawapay',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating Pawapay payment',
        status: 'failed',
        provider: 'pawapay',
      };
    }
  }

  // Intasend Integration
  async initiateIntasendPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/intasend/charge`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          phone_number: request.phone_number,
          currency: request.currency || 'KES',
          reference: request.reference || `INTA-${Date.now()}`,
          customer_email: request.customer_email,
          customer_name: request.customer_name,
          redirect_url: request.callback_url,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'Intasend payment initiated',
          status: 'pending',
          provider: 'intasend',
          checkout_url: data.checkout_url || data.payment_url,
          auth_model: data.auth_model || 'REDIRECT',
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'Intasend payment failed',
          status: 'failed',
          provider: 'intasend',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating Intasend payment',
        status: 'failed',
        provider: 'intasend',
      };
    }
  }

  // Generic Card Payment
  async initiateCardPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    // Default to Flutterwave for card payments
    return this.initiateFlutterwavePayment(request);
  }

  // Generic Bank Transfer
  async initiateBankTransferPayment(request: Omit<PaymentRequest, 'provider'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/bank-transfer/initiate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency || 'KES',
          reference: request.reference || `BANK-${Date.now()}`,
          customer_email: request.customer_email,
          customer_name: request.customer_name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          reference: data.reference || data.transaction_id,
          message: data.message || 'Bank transfer initiated',
          status: 'pending',
          provider: 'bank_transfer',
          checkout_url: data.checkout_url,
          requires_action: true,
        };
      } else {
        return {
          success: false,
          reference: '',
          message: data.error || data.message || 'Bank transfer failed',
          status: 'failed',
          provider: 'bank_transfer',
        };
      }
    } catch (error) {
      return {
        success: false,
        reference: '',
        message: 'Network error initiating bank transfer',
        status: 'failed',
        provider: 'bank_transfer',
      };
    }
  }

  // Unified Payment Method
  // SECURITY: Provider is determined by backend settings, not frontend selection
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    switch (request.provider) {
      case 'mpesa':
        return this.initiateMpesaPayment(request);
      case 'mtn_momo':
        return this.initiateMtnMoMoPayment(request);
      case 'airtel_money':
        return this.initiateAirtelPayment(request);
      case 'card':
        return this.initiateCardPayment(request);
      case 'bank_transfer':
        return this.initiateBankTransferPayment(request);
      case 'flutterwave':
        return this.initiateFlutterwavePayment(request);
      case 'korapay':
        return this.initiateKorapayPayment(request);
      case 'dgateway':
        return this.initiateDGatewayPayment(request);
      case 'megapay':
        return this.initiateMegapayPayment(request);
      case 'tenz':
        return this.initiateTenzPayment(request);
      case 'pesaflux':
        return this.initiatePesafluxPayment(request);
      case 'pesapal':
        return this.initiatePesapalPayment(request);
      case 'pawapay':
        return this.initiatePawapayPayment(request);
      case 'intasend':
        return this.initiateIntasendPayment(request);
      default:
        // Default to M-PESA for Kenya
        return this.initiateMpesaPayment(request);
    }
  }

  // Verify Payment Status
  async verifyPayment(reference: string, provider: PaymentProvider): Promise<PaymentVerification> {
    try {
      const response = await fetch(`${this.baseUrl}/api/player/deposit/verify`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          reference,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          reference,
          status: data.status || 'pending',
          amount: data.amount,
        };
      } else {
        return {
          reference,
          status: 'failed',
        };
      }
    } catch (error) {
      return {
        reference,
        status: 'pending', // Don't fail on network error, keep polling
      };
    }
  }

  // Get Available Payment Methods for Country
  getAvailablePaymentMethods(countryCode: string): PaymentProvider[] {
    // Kenya only supports M-PESA via Daraja
    return ['mpesa'];
  }

  // Get Payment Provider Display Info
  getProviderInfo(provider: PaymentProvider) {
    const providerInfo: Record<PaymentProvider, { name: string; icon: string; description: string }> = {
      mpesa: {
        name: 'M-PESA',
        icon: '📱',
        description: 'Instant STK Push payment',
      },
      mtn_momo: {
        name: 'MTN MoMo',
        icon: '📱',
        description: 'Mobile money payment',
      },
      airtel_money: {
        name: 'Airtel Money',
        icon: '❤️',
        description: 'Mobile money payment',
      },
      card: {
        name: 'Card Payment',
        icon: '💳',
        description: 'Visa, Mastercard, etc.',
      },
      bank_transfer: {
        name: 'Bank Transfer',
        icon: '🏦',
        description: 'Direct bank transfer',
      },
      flutterwave: {
        name: 'Flutterwave',
        icon: '🌊',
        description: 'Multiple payment options',
      },
      korapay: {
        name: 'Korapay',
        icon: '💎',
        description: 'Card and bank transfer',
      },
      dgateway: {
        name: 'DGateway',
        icon: '🔗',
        description: 'Unified payment gateway',
      },
      megapay: {
        name: 'Megapay',
        icon: '⚡',
        description: 'Fast mobile payments',
      },
      tenz: {
        name: 'Tenz',
        icon: '🎯',
        description: 'Simple payment gateway',
      },
      pesaflux: {
        name: 'Pesaflux',
        icon: '💵',
        description: 'Digital payment solutions',
      },
      pesapal: {
        name: 'PesaPal',
        icon: '🅿️',
        description: 'East African payments',
      },
      pawapay: {
        name: 'Pawapay',
        icon: '🐾',
        description: 'Pan-African payments',
      },
      intasend: {
        name: 'Intasend',
        icon: '🚀',
        description: 'Modern payment gateway',
      },
    };

    return providerInfo[provider] || providerInfo.card;
  }
}

// Export singleton instance
export const paymentService = new PaymentService();