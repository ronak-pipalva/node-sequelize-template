const JWT = {
  ACCESS_EXPIRES_IN: 60,
  REFRESH_EXPIRES_IN: 365,
};

const TOKEN_TYPES = {
  ACCESS_TOKEN: 1,
  REFRESH_TOKEN: 2,
  FORGOT_PASSWORD: 3,
  SET_PASSWORD: 4,
};

const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

const MESSAGES = {
  GENERAL: {
    SUCCESS: 'Success',
    ERROR: 'Something went wrong',
    NOT_FOUND: 'Resource not found',
    BAD_REQUEST: 'Bad request',
  },
  AUTH: {
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGIN_FAIL: 'Invalid email or password',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Access denied',
    TOKEN_REQUIRED: 'Authorization token is required.',
    INVALID_TOKEN: 'Invalid or malformed token.',
    TOKEN_EXPIRED: 'Token has expired.',
  },
  USER: {
    CREATED: 'User registered successfully',
    UPDATED: 'User details updated successfully',
    DELETED: 'User deleted successfully',
    EXISTS: 'Email already in use',
    NOT_FOUND: 'User not found',
  },
  CRUD: {
    CREATED: 'Created successfully',
    FETCHED: 'Data fetched successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    NOT_FOUND: 'No record found',
  },
  VALIDATION: {
    REQUIRED: 'Missing required fields',
    INVALID: 'Invalid input',
    FORMAT: 'Invalid format',
  },
  DB: {
    CONNECTED: 'Database connected successfully',
    ERROR: 'Database connection failed',
    DUPLICATE: 'Duplicate record',
  },
  COMMON: {
    INVALID_MODEL: 'Invalid model',
    VALIDATION_FAILED: 'Validation failed',
    RECORD_CREATED: 'Record created',
    RECORD_UPDATED: 'Record updated',
    RECORD_DELETED: 'Record deleted',
    RECORD_NOT_FOUND: 'Record not found',
    RECORDS_FETCHED: 'Records fetched',
    FILE_UPLOADED: 'File uploaded successfully',
  },
};

export { JWT, TOKEN_TYPES, MESSAGES, STATUS_CODE };
