import joi from 'joi';
import dotenv from 'dotenv';
import ApiError from '../utils/apiError.util.js';
import statusCode from '../constants/statusCode.constant.js';

// Load environment file based on NODE_ENV
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

// Define environment variable schema
const envVarsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('prod', 'dev', 'local')
      .required()
      .description('Environment (prod, dev, local)'),

    PORT: joi.number().default(3000).required().description('App port'),

    // Database
    DB_USERNAME: joi.string().required().description('Database username'),
    DB_PASSWORD: joi.string().required().description('Database password'),
    DB_NAME: joi.string().required().description('Database name'),
    DB_HOST: joi.string().required().description('Database host'),
    DB_DIALECT: joi.string().required().description('Database dialect'),

    // AWS S3
    // AWS_ACCESS_KEY_ID: joi.string().required().description('AWS Access Key'),
    // AWS_SECRET_ACCESS_KEY: joi.string().required().description('AWS Secret Access Key'),
    // AWS_REGION: joi.string().required().description('AWS Region'),
    // AWS_BUCKET_NAME: joi.string().required().description('AWS S3 Bucket name'),

    // JWT
    // JWT_SECRET_KEY: joi.string().required().description('JWT secret key'),
    // ACCESS_EXPIRES_IN: joi.string().default('1h').description('Access token expiration'),
    // REFRESH_EXPIRES_IN: joi.string().default('30d').description('Refresh token expiration'),

    // Email (SES)
    // AWS_MAIL_ACCESS_KEY_ID: joi.string().required().description('AWS Mail Access Key ID'),
    // AWS_MAIL_SECRET_ACCESS_KEY: joi.string().required().description('AWS Mail Secret Access Key'),
    // EMAIL_FROM: joi.string().required().description('Sender email address'),

    // App
    // URL: joi.string().required().description('Base URL'),
  })
  .unknown();

// Validate environment variables
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new ApiError(statusCode.BAD_REQUEST, `Config validation error: ${error.message}`);
}

// Export config object
const config = {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  DB_USERNAME: envVars.DB_USERNAME,
  DB_PASSWORD: envVars.DB_PASSWORD,
  DB_NAME: envVars.DB_NAME,
  DB_HOST: envVars.DB_HOST,
  DB_DIALECT: envVars.DB_DIALECT,
  // AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID,
  // AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
  // AWS_REGION: envVars.AWS_REGION,
  // AWS_BUCKET_NAME: envVars.AWS_BUCKET_NAME,
  // JWT_SECRET_KEY: envVars.JWT_SECRET_KEY,
  // ACCESS_EXPIRES_IN: envVars.ACCESS_EXPIRES_IN,
  // REFRESH_EXPIRES_IN: envVars.REFRESH_EXPIRES_IN,
  // AWS_MAIL_ACCESS_KEY_ID: envVars.AWS_MAIL_ACCESS_KEY_ID,
  // AWS_MAIL_SECRET_ACCESS_KEY: envVars.AWS_MAIL_SECRET_ACCESS_KEY,
  // EMAIL_FROM: envVars.EMAIL_FROM,
  // URL: envVars.URL,
};

export default config;
