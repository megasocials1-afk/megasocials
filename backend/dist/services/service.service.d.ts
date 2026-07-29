export declare class ServiceService {
    static getService(serviceId: string): Promise<any>;
    static listServices(status?: string): Promise<any[]>;
    static syncServices(providerId: string): Promise<{
        success: boolean;
        count: number;
    }>;
    private static ensureCategory;
    static updateMargin(serviceId: string, marginPercent?: number, marginFixed?: number): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=service.service.d.ts.map