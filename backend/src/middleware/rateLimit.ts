export const rateLimit = (max: number) => {
  let count = 0;
  return (req: any, res: any, next: any) => {
    if (++count > max) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  };
};
