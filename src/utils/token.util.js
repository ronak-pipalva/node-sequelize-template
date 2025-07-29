import moment from 'moment';
import appConstant from '../constants/app.constant.js';
import Models from '../models/index.js';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.util.js';
import config from '../config/envConfig.js';
const saveToken = async (token, user, expires, type) => {
  try {
    let user_id = user.id;

    let body = {
      token: token,
      type: type,
      user_id: user_id,
      token_expiry: expires ? expires.toDate() : new Date(),
    };

    const create_token = await Models.user_token.create(body);
    return create_token;
  } catch (error) {
    throw error;
  }
};

const generateToken = (user, expires, secret) => {
  try {
    const { id, name, email } = user;

    const payload = {
      sub: id,
      name,
      email,
      iat: moment().unix(),
      ...(expires && { exp: expires.unix() }),
    };

    return jwt.sign(payload, secret);
  } catch (error) {
    throw error;
  }
};

const generateAuthTokens = async (user) => {
  try {
    const access_token_expires = moment().add(appConstant.JWT.ACCESS_EXPIRES_IN, 'minutes');

    const access_token = generateToken(user, access_token_expires, config.JWT_SECRET_KEY);

    const refresh_token_expires = moment().add(appConstant.JWT.REFRESH_EXPIRES_IN, 'days');

    const refresh_token = generateToken(user, refresh_token_expires, config.JWT_SECRET_KEY);

    await saveToken(
      refresh_token,
      user,
      refresh_token_expires,
      appConstant.TOKEN_TYPES.REFRESH_TOKEN,
    );

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  } catch (error) {
    throw error;
  }
};

const readToken = async (token, token_type) => {
  try {
    let decoded_token = jwt.decode(token);

    let query = {
      token: token,
      type: token_type,
    };

    let get_token = await Models.user_token.findOne({ where: query });

    if (!get_token) {
      throw new ApiError(401, 'Invalid Token');
    }

    return get_token;
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (refresh_token) => {
  try {
    let token = await readToken(refresh_token, auth_const.TOKEN_TYPES.REFRESH);

    if (!token) {
      throw new ApiError(401, 'Invalid Token');
    }

    let user_id = token.data.sub;

    const find_user = await Models.user.findOne({
      where: {
        id: user_id,
      },
    });

    if (!find_user) {
      throw new ApiError(401, 'User Not Found');
    }

    const access_token_expires = moment().add(appConstant.JWT.ACCESS_EXPIRES_IN, 'minutes');

    token = generateToken(find_user, access_token_expires, config.JWT_SECRET_KEY);

    return { access_token: token };
  } catch (error) {
    throw error;
  }
};

export { generateAuthTokens, saveToken, generateToken, refreshToken, readToken };
