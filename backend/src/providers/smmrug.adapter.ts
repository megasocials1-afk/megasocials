import axios from 'axios';
import { ProviderAdapter } from './provider.interface.js';

export class SMMRUGAdapter implements ProviderAdapter {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, params: any = {}) {
    const response = await axios.post(this.apiUrl, {
      key: this.apiKey,
      action: endpoint,
      ...params,
    });
    return response.data;
  }

  async getBalance(): Promise<number> {
    const data = await this.request('balance');
    return parseFloat(data.balance);
  }

  async getServices(): Promise<any[]> {
    const data = await this.request('services');
    return data.services;
  }

  async createOrder(serviceId: string, link: string, quantity: number): Promise<{ orderId: string; price: number }> {
    const data = await this.request('add', { service: serviceId, link, quantity });
    return { orderId: data.order, price: data.price };
  }

  async getOrderStatus(orderId: string): Promise<{ status: string; startCount?: number; currentCount?: number; remains?: number }> {
    const data = await this.request('status', { order: orderId });
    return {
      status: data.status,
      startCount: data.start_count,
      currentCount: data.current_count,
      remains: data.remains,
    };
  }

  async refillOrder(orderId: string, quantity: number): Promise<any> {
    return this.request('refill', { order: orderId, quantity });
  }

  async cancelOrder(orderId: string): Promise<any> {
    return this.request('cancel', { order: orderId });
  }
}
