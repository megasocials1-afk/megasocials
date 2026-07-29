export interface ProviderAdapter {
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
export interface ProviderService {
    id: string;
    name: string;
    category: string;
    rate: number;
    min: number;
    max: number;
    description?: string;
    type?: string;
}
//# sourceMappingURL=provider.interface.d.ts.map