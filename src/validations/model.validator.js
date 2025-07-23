import ApiError from '../utils/apiError.util.js';

export const validateByModel = (model, options = {}) => {
  const { allowUnknown = false } = options;

  return async (req, res, next) => {
    try {
      const body = req.body;
      const method = req.method.toUpperCase();
      const isCreate = method === 'POST';

      const attributes = model.rawAttributes;
      const bodyKeys = Object.keys(body);
      const modelKeys = Object.keys(attributes);

      // Unknown fields check
      const unknownFields = bodyKeys.filter((key) => !modelKeys.includes(key));
      if (!allowUnknown && unknownFields.length > 0) {
        throw new ApiError(400, `Unknown fields: ${unknownFields.join(', ')}`);
      }

      // Validate each known field
      for (const key of bodyKeys) {
        const attr = attributes[key];
        if (!attr) continue;

        const value = body[key];

        // Required field check (only on create)
        if (isCreate && attr.allowNull === false && (value === null || value === undefined)) {
          throw new ApiError(400, `${key} is required.`);
        }

        // Unique check (only on create)
        if (isCreate && attr.unique && value != null) {
          const whereClause = { [key]: value };
          const existing = await model.scope('defaultScope').findOne({ where: whereClause });

          if (existing) {
            throw new ApiError(409, `${key} already exists.`);
          }
        }

        // Type validation
        if (value != null) {
          const typeName = attr.type.constructor.name;

          switch (typeName) {
            case 'STRING':
            case 'TEXT':
              if (typeof value !== 'string') throw new ApiError(400, `${key} must be a string.`);
              break;

            case 'INTEGER':
            case 'BIGINT':
              if (typeof value !== 'number' || !Number.isInteger(value)) {
                throw new ApiError(400, `${key} must be an integer.`);
              }
              break;

            case 'FLOAT':
            case 'DOUBLE':
            case 'DECIMAL':
              if (typeof value !== 'number') throw new ApiError(400, `${key} must be a number.`);
              break;

            case 'BOOLEAN':
              if (typeof value !== 'boolean') throw new ApiError(400, `${key} must be a boolean.`);
              break;

            case 'DATE':
            case 'DATEONLY':
              if (isNaN(Date.parse(value))) throw new ApiError(400, `${key} must be a valid date.`);
              break;

            case 'UUID':
              if (
                typeof value !== 'string' ||
                !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                  value,
                )
              ) {
                throw new ApiError(400, `${key} must be a valid UUID.`);
              }
              break;

            case 'JSON':
            case 'JSONB':
              if (typeof value !== 'object')
                throw new ApiError(400, `${key} must be a JSON object.`);
              break;

            default:
              // Skip unsupported types silently
              break;
          }
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
