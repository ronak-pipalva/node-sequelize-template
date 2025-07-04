import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import validate from '../middlewares/validation.middleware.js';
import { userLoginSchema, userRegisterSchema } from '../validations/user.validation.js';

const router = express.Router();

router.use('/auth/register', validate(userRegisterSchema), register);
router.use('/auth/login', validate(userLoginSchema), login);

export default router;
