import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import validate from '../middlewares/validation.middleware.js';
import { userLoginSchema, userRegisterSchema } from '../validations/user.validator.js';
import { validateByModel } from '../validations/model.validator.js';
import Models from '../models/index.js';

const router = express.Router();

router.use('/auth/register', validate(userRegisterSchema), register);
router.use('/auth/login', validateByModel(Models.user), login);

export default router;
