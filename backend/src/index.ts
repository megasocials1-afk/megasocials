// Stub for AppDeploy compatibility – no external dependencies
export const router = (routes: any) => routes;

export const json = (data: any) => ({
  statusCode: 200,
  body: JSON.stringify(data)
});

// Define your routes
export const handler = router({
  'GET /api/health': [
    async () => json({ ok: true, timestamp: new Date().toISOString() })
  ]
});
