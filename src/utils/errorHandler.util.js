import logger from './logger.util.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const data = err.data || null;

  logger.error(`[Error]: ${message} | Status Code: ${statusCode} | Stack: ${err.stack}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    data,
  });

  next();
};

export default errorHandler;
