import db_service from '../services/db.service.js';
import { sendSuccess } from '../utils/response.util.js';
import messages from '../constants/messages.constants.js';
import STATUS_CODE from '../constants/statusCode.constant.js';
import { buildWhereClause } from '../utils/app.util.js';
// Create One
const createHandler = (model) => async (req, res, next) => {
  try {
    const record = await db_service.createOne(model, req.body);
    return sendSuccess(res, record, messages.CRUD.CREATED, STATUS_CODE.CREATED);
  } catch (err) {
    next(err);
  }
};

// Get One by Primary Key
const getHandler = (model) => async (req, res, next) => {
  try {
    const id = req.params.id;
    const record = await db_service.findOne(model, { id });
    if (!record) throw new ApiError(404, `${model.name} not found`);
    return sendSuccess(res, record, messages.CRUD.FETCHED, STATUS_CODE.SUCCESS);
  } catch (err) {
    next(err);
  }
};

// Get All with filters, pagination, sorting
const getAllHandler =
  (model, queryOptions = {}) =>
  async (req, res) => {
    try {
      const { filters = [], pagination } = req.body || {};

      // Build Sequelize where clause from filters
      const where = buildWhereClause(filters);

      // Sorting
      const sortBy = sort.sortBy || 'updated_at';
      const sortOrder = sort.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      const order = [[sortBy, sortOrder]];

      // Final Sequelize query options
      const options = {
        order,
        ...queryOptions, // for attributes, include, subQuery, etc.
      };

      // Pagination
      if (pagination && pagination.page && pagination.limit) {
        const page = parseInt(pagination.page);
        const limit = parseInt(pagination.limit);
        const offset = (page - 1) * limit;

        options.limit = limit;
        options.page = page;
        options.offset = offset;
      }

      const result = await db_service.findAndCountAll(model, where, options);

      return sendSuccess(res, result, messages.CRUD.FETCHED, STATUS_CODE.SUCCESS);
    } catch (err) {
      next(err);
    }
  };

// Update by ID or query
const updateHandler = (model) => async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = id
      ? { [model.primaryKeyField]: id }
      : req.query.filter
        ? JSON.parse(req.query.filter)
        : {};

    if (!Object.keys(query).length) {
      throw new ApiError(400, 'No valid query or ID provided for update');
    }

    const result = await db_service.update(model, query, req.body);
    return sendSuccess(res, result, messages.CRUD.UPDATED, STATUS_CODE.SUCCESS);
  } catch (err) {
    next(err);
  }
};

// Delete by ID or query
const deleteHandler = (model) => async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = id
      ? { [model.primaryKeyField]: id }
      : req.query.filter
        ? JSON.parse(req.query.filter)
        : {};

    if (!Object.keys(query).length) {
      throw new ApiError(400, 'No valid query or ID provided for deletion');
    }

    const result = await db_service.destroy(model, query);
    return sendSuccess(res, result, messages.CRUD.DELETED, STATUS_CODE.SUCCESS);
  } catch (err) {
    next(err);
  }
};

export { createHandler, getHandler, getAllHandler, updateHandler, deleteHandler };
