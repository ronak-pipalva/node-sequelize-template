import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import validate from '../middlewares/validation.middleware.js';
import { userLoginSchema, userRegisterSchema } from '../validations/user.validator.js';
import { validateByModel } from '../validations/model.validator.js';
import Models from '../models/index.js';
import { getAllHandler } from '../middlewares/handler.middleware.js';

const router = express.Router();

router.post('/auth/register', validateByModel(Models.user), register);
router.get('/auth/login', validateByModel(Models.user), login);
// router.post('/candidates/list', getAllHandler(Models.candidates));

export default router;
