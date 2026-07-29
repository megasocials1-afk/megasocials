import axios from 'axios';
export class SMMRUGAdapter {
    constructor(apiUrl, apiKey) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }
    async request(endpoint, params = {}) {
        const response = await axios.post(this.apiUrl, {
            key: this.apiKey,
            action: endpoint,
            ...params,
        });
        return response.data;
    }
    async getBalance() {
        const data = await this.request('balance');
        return parseFloat(data.balance);
    }
    async getServices() {
        const data = await this.request('services');
        return data.services;
    }
    async createOrder(serviceId, link, quantity) {
        const data = await this.request('add', { service: serviceId, link, quantity });
        return { orderId: data.order, price: data.price };
    }
    async getOrderStatus(orderId) {
        const data = await this.request('status', { order: orderId });
        return {
            status: data.status,
            startCount: data.start_count,
            currentCount: data.current_count,
            remains: data.remains,
        };
    }
    async refillOrder(orderId, quantity) {
        return this.request('refill', { order: orderId, quantity });
    }
    async cancelOrder(orderId) {
        return this.request('cancel', { order: orderId });
    }
}
