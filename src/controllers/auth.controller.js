import Models from '../models/index.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { generateAuthTokens } from '../utils/token.util.js';
const register = async (req, res, next) => {
  try {
    const dataToCreate = req.body;
    const { email } = dataToCreate;

    const userExists = await Models.User.findOne({ where: { email } });
    if (userExists) {
      return sendError(res, {}, 'User already exists', 400);
    }
    const user = await Models.User.create(dataToCreate);
    return sendSuccess(res, user, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Models.User.findOne({ where: { email } });
    if (!user) {
      return sendError(res, {}, 'User not found', 404);
    }
    const isPasswordMatch = await user.isPasswordMatch(password);

    if (!isPasswordMatch) {
      return sendError(res, {}, 'Invalid password', 401);
    }
    const tokens = await generateAuthTokens(user);

    return sendSuccess(res, { ...user.toJSON(), tokens }, 'Login successfully', 200);
  } catch (error) {
    next(error);
  }
};

export { register, login };
