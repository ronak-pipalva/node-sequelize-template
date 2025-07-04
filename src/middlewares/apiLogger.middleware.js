import logger from '../utils/logger.util.js';
import bcrypt from 'bcryptjs';
const apiLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    const { method, originalUrl, ip, body, query, params } = req;
    const duration = Date.now() - start;

    if (body && body?.password) {
      const saltRounds = 10;
      body.password = await bcrypt.hash(body.password, saltRounds);
    }
    const log = `${method} ${originalUrl} ${res.statusCode} - ${duration}ms`;

    const metadata = {
      method: method,
      url: originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: ip,
      userAgent: req.headers['user-agent'],
      params: params,
      query: query,
      body: body,
    };

    logger.info(log, metadata);
  });

  next();
};

export default apiLogger;
