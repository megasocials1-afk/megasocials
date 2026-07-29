import axios from 'axios';
import { ProviderAdapter } from './provider.interface.js';

export class SMMRUGAdapter implements ProviderAdapter {
  private apiUrl: string;
  private apiKey: string;
  private timeout: number = 30000;

  constructor(apiUrl: string, apiKey: string, config: any = {}) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    if (config.timeout) this.timeout = config.timeout;
  }

  private async request(endpoint: string, params: any = {}) {
    try {
      const response = await axios.post(this.apiUrl, {
        key: this.apiKey,
        action: endpoint,
        ...params,
      }, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MegaSocials/1.0',
        },
      });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Provider request timeout');
        }
        if (error.response) {
          throw new Error(`Provider API error: ${error.response.status} - ${error.response.data?.error || error.message}`);
        }
      }
      throw error;
    }
  }

  async getBalance(): Promise<number> {
    const data = await this.request('balance');
    return parseFloat(data.balance);
  }

  async getServices(): Promise<any[]> {
    const data = await this.request('services');
    return data.services || [];
  }

  async createOrder(serviceId: string, link: string, quantity: number): Promise<{ orderId: string; price: number }> {
    const data = await this.request('add', {
      service: serviceId,
      link: link,
      quantity: quantity,
    });
    if (!data.order) {
      throw new Error('Provider did not return an order ID');
    }
    return {
      orderId: data.order,
      price: parseFloat(data.price || 0),
    };
  }

  async getOrderStatus(orderId: string): Promise<{
    status: string;
    startCount?: number;
    currentCount?: number;
    remains?: number;
  }> {
    const data = await this.request('status', { order: orderId });
    return {
      status: data.status || 'pending',
      startCount: data.start_count ? parseInt(data.start_count) : undefined,
      currentCount: data.current_count ? parseInt(data.current_count) : undefined,
      remains: data.remains ? parseInt(data.remains) : undefined,
    };
  }

  async refillOrder(orderId: string, quantity: number): Promise<any> {
    return this.request('refill', {
      order: orderId,
      quantity: quantity,
    });
  }

  async cancelOrder(orderId: string): Promise<any> {
    return this.request('cancel', { order: orderId });
  }
}
