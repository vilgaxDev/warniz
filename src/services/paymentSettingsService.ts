// Payment Settings Service
// Fetches payment configuration from backend including min deposit/withdrawal amounts

export interface PaymentSettings {
  min_deposit_amount: number;
  min_withdraw_amount: number;
  deposit_amounts: number[];
  bet_amounts: number[];
  min_bet: number;
  payment_provider: string;
  // Add other payment settings as needed
}

class PaymentSettingsService {
  private baseUrl: string;
  private token: string | null;
  private cachedSettings: PaymentSettings | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    this.token = localStorage.getItem('player_token') || localStorage.getItem('token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Only add auth token if it exists (some endpoints might be public)
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async fetchPaymentSettings(): Promise<PaymentSettings> {
    // Check cache first
    if (this.cachedSettings && Date.now() < this.cacheExpiry) {
      return this.cachedSettings;
    }

    try {
      // Fetch from deposit-settings endpoint
      const response = await fetch(`${this.baseUrl}/api/player/deposit-settings`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.ok) {
        const data = await response.json();

        const settings: PaymentSettings = {
          min_deposit_amount: data.min_deposit || 500,
          min_withdraw_amount: data.min_withdraw_amount || 500,
          deposit_amounts: this.parseDepositAmounts(data.quick_deposit_amounts),
          bet_amounts: this.parseDepositAmounts(data.quick_bet_amounts),
          min_bet: data.min_bet || 100,
          payment_provider: data.payment_provider || 'mpesa',
        };

        // Cache the settings
        this.cachedSettings = settings;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;

        return settings;
      } else {
        // Return default settings if API fails (silently)
        return this.getDefaultSettings();
      }
    } catch (error) {
      // Return default settings silently if API fails
      return this.getDefaultSettings();
    }
  }

  private parseDepositAmounts(amounts: string | number[]): number[] {
    if (!amounts) return [100, 200, 500, 1000, 2000, 5000];

    try {
      // If it's already an array, return it
      if (Array.isArray(amounts)) {
        return amounts.filter(v => typeof v === 'number' && v > 0).sort((a, b) => a - b);
      }

      // If it's a string, parse it (legacy support)
      if (typeof amounts === 'string') {
        return amounts
          .split(',')
          .map(v => parseInt(v.trim()))
          .filter(v => !isNaN(v) && v > 0)
          .sort((a, b) => a - b);
      }

      return [100, 200, 500, 1000, 2000, 5000];
    } catch {
      return [100, 200, 500, 1000, 2000, 5000];
    }
  }

  private getDefaultSettings(): PaymentSettings {
    return {
      min_deposit_amount: 500,
      min_withdraw_amount: 500,
      deposit_amounts: [100, 200, 500, 1000, 2000, 5000],
      bet_amounts: [10, 20, 50, 100, 200, 500],
      min_bet: 100,
      payment_provider: 'mpesa',
    };
  }

  clearCache(): void {
    this.cachedSettings = null;
    this.cacheExpiry = 0;
  }

  // Convenience method to get just the minimum deposit amount
  async getMinDepositAmount(): Promise<number> {
    const settings = await this.fetchPaymentSettings();
    return settings.min_deposit_amount;
  }

  // Convenience method to get just the minimum withdrawal amount
  async getMinWithdrawAmount(): Promise<number> {
    const settings = await this.fetchPaymentSettings();
    return settings.min_withdraw_amount;
  }

  // Convenience method to get deposit amounts for quick selection
  async getDepositAmounts(): Promise<number[]> {
    const settings = await this.fetchPaymentSettings();
    return settings.deposit_amounts;
  }

  // Convenience method to get bet amounts for quick selection
  async getBetAmounts(): Promise<number[]> {
    const settings = await this.fetchPaymentSettings();
    return settings.bet_amounts;
  }

  // Convenience method to get minimum bet amount
  async getMinBetAmount(): Promise<number> {
    const settings = await this.fetchPaymentSettings();
    return settings.min_bet;
  }
}

// Export singleton instance
export const paymentSettingsService = new PaymentSettingsService();