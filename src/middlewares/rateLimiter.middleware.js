import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per window
  message: {
    status: 429,
    error: 'Too many requests. You are allowed only 60 requests per minute.',
  },
  standardHeaders: true, // Include `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

export default limiter;
