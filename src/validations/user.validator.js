import joi from 'joi';

const userRegisterSchema = {
  body: joi
    .object()
    .keys({
      name: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
    })
    .unknown(false),
};

const userLoginSchema = {
  body: joi
    .object()
    .keys({
      email: joi.string().email().required(),
      password: joi.string().required(),
    })
    .unknown(false),
};
export { userRegisterSchema, userLoginSchema };
