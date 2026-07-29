export declare class AuthService {
    static register(email: string, username: string, password: string, referralCode?: string, ip?: string, userAgent?: string): Promise<any>;
    static verifyEmail(userId: string, code: string): Promise<{
        success: boolean;
    }>;
    static login(email: string, password: string, ip?: string, userAgent?: string): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            username: any;
            balance: any;
            role: any;
            status: any;
        };
    }>;
    static forgotPassword(email: string, ip?: string, userAgent?: string): Promise<{
        success: boolean;
    }>;
    static resetPassword(email: string, code: string, newPassword: string, ip?: string, userAgent?: string): Promise<{
        success: boolean;
    }>;
    static changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    static getMe(userId: string): Promise<any>;
    static updateProfile(userId: string, data: {
        username?: string;
        email?: string;
    }): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map