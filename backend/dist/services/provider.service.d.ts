export declare class ProviderService {
    static getProvider(providerId: string): Promise<any>;
    static getAdapter(providerId: string): Promise<import("../providers/provider.interface.js").ProviderAdapter>;
    static listProviders(): Promise<any[]>;
    static createProvider(data: {
        name: string;
        api_url: string;
        api_key?: string;
        api_secret?: string;
        type?: string;
        config?: any;
    }): Promise<any>;
    static updateProvider(providerId: string, data: any): Promise<{
        success: boolean;
    }>;
    static deleteProvider(providerId: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=provider.service.d.ts.map