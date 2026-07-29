export declare class AdminService {
    static getAdminPermissions(adminUserId: string): Promise<string[]>;
    static checkPermission(adminUserId: string, required: string): Promise<boolean>;
    static grantAdmin(userId: string, permissions: string[], grantorId: string): Promise<{
        success: boolean;
    }>;
    static revokeAdmin(userId: string): Promise<{
        success: boolean;
    }>;
    static getDashboardStats(): Promise<{
        totalUsers: number;
        totalOrders: number;
        totalRevenue: number;
        pendingOrders: number;
        totalBalance: number;
    }>;
    static getUsers(filters?: {
        status?: string;
        role?: string;
    }): Promise<any[]>;
    static updateUser(userId: string, data: {
        status?: string;
        role?: string;
        balance?: number;
        suspension_reason?: string;
    }): Promise<{
        success: boolean;
    }>;
    static suspendUser(userId: string, action: 'suspend' | 'ban' | 'reactivate', reason?: string, adminId?: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=admin.service.d.ts.map