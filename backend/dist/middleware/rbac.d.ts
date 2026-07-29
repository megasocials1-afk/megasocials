export declare const rbac: (roles: string[]) => (req: any, res: any, next: any) => any;
export declare const requirePermission: (permission: string) => (req: any, res: any, next: any) => Promise<any>;
export declare const requireAdminOrSelf: (paramName?: string) => (req: any, res: any, next: any) => any;
//# sourceMappingURL=rbac.d.ts.map