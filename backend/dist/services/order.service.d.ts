export declare class OrderService {
    static createOrder(userId: string, serviceId: string, link: string, quantity: number, promoCode?: string): Promise<{
        id: string;
        status: string;
        message: string;
        wallet_debited: boolean;
        amount: number;
    } | {
        id: string;
        status: string;
        message: string;
        wallet_debited?: undefined;
        amount?: undefined;
    }>;
    static syncOrderStatus(orderId: string): Promise<void>;
    static retryPendingOrders(): Promise<void>;
    static getOrder(orderId: string, userId: string): Promise<any>;
    static getUserOrders(userId: string, limit?: number, offset?: number): Promise<any[]>;
    static getAllOrders(limit?: number, offset?: number): Promise<any[]>;
    static updateStatus(orderId: string, status: string): Promise<{
        success: boolean;
    }>;
    private static mapProviderStatus;
}
//# sourceMappingURL=order.service.d.ts.map