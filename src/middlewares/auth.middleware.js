import ApiError from '../utils/apiError.util.js';
import STATUS_CODE from '../constants/statusCode.constant.js';
import messages from '../constants/messages.constants.js';
import jwt from 'jsonwebtoken';
import config from '../config/envConfig.js';
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(STATUS_CODE.UNAUTHORIZED, messages.AUTH.TOKEN_REQUIRED);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new ApiError(STATUS_CODE.UNAUTHORIZED, messages.AUTH.TOKEN_REQUIRED);
    }

    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

    if (!decoded || !decoded.id) {
      throw new ApiError(STATUS_CODE.UNAUTHORIZED, messages.AUTH.INVALID_TOKEN);
    }

    // Attach user to request
    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      new ApiError(STATUS_CODE.UNAUTHORIZED, messages.AUTH.TOKEN_EXPIRED);
    } else if (err.name === 'JsonWebTokenError') {
      new ApiError(STATUS_CODE.UNAUTHORIZED, messages.AUTH.INVALID_TOKEN);
    } else {
      next(err);
    }
  }
};

export default authenticate;
