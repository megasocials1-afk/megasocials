import pg from 'pg';
export declare const db: pg.Pool;
export declare const query: (text: string, params?: any[]) => Promise<pg.QueryResult<any>>;
//# sourceMappingURL=pool.d.ts.map