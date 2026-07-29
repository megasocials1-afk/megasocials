export declare class ActivityLogService {
    static log(userId: string | null, action: string, details: any, ip?: string | null, userAgent?: string | null): Promise<{
        success: boolean;
    }>;
    static getLogs(limit?: number): Promise<any[]>;
    static getLogsByUser(userId: string, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=activity-log.service.d.ts.map