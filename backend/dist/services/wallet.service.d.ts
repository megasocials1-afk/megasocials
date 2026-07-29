export declare class WalletService {
    static getBalance(userId: string): Promise<number>;
    static getTransactions(userId: string, limit?: number, offset?: number): Promise<any[]>;
    static credit(userId: string, amount: number, type: string, referenceId: string | null, description: string): Promise<number>;
    static debit(userId: string, amount: number, type: string, referenceId: string | null, description: string): Promise<number>;
    static freeze(userId: string, amount: number, description?: string): Promise<{
        success: boolean;
    }>;
    static release(userId: string, amount: number, description?: string): Promise<{
        success: boolean;
    }>;
    static refund(userId: string, amount: number, orderId: string, description: string): Promise<number>;
}
//# sourceMappingURL=wallet.service.d.ts.map