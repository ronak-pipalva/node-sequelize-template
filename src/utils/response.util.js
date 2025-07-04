import STATUS_CODE from '../constants/statusCode.constant.js';

const sendSuccess = (res, data = {}, message = 'Success', statusCode = STATUS_CODE.SUCCESS) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};

const sendError = (
  res,
  error = {},
  message = 'Something went wrong',
  statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR,
) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    error,
  });
};

export { sendSuccess, sendError };
