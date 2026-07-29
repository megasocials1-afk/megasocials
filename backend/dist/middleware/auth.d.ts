import jwt from 'jsonwebtoken';
export declare const generateToken: (payload: any) => never;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload;
export declare const authMiddleware: (req: any, res: any, next: any) => any;
//# sourceMappingURL=auth.d.ts.map