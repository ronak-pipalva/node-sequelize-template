const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const data = err.data || null;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    data,
  });

  console.log('error', err);

  next();
};

export default errorHandler;
