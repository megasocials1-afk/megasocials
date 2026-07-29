import { ProviderAdapter } from './provider.interface.js';
export declare class SMMRUGAdapter implements ProviderAdapter {
    private apiUrl;
    private apiKey;
    private timeout;
    constructor(apiUrl: string, apiKey: string, config?: any);
    private request;
    getBalance(): Promise<number>;
    getServices(): Promise<any[]>;
    createOrder(serviceId: string, link: string, quantity: number): Promise<{
        orderId: string;
        price: number;
    }>;
    getOrderStatus(orderId: string): Promise<{
        status: string;
        startCount?: number;
        currentCount?: number;
        remains?: number;
    }>;
    refillOrder(orderId: string, quantity: number): Promise<any>;
    cancelOrder(orderId: string): Promise<any>;
}
//# sourceMappingURL=smmrug.adapter.d.ts.map