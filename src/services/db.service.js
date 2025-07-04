import { Op, Sequelize } from 'sequelize';
import Models from '../models/index.js';

const OPERATORS = [
  '$and',
  '$or',
  '$like',
  '$in',
  '$eq',
  '$gt',
  '$lt',
  '$gte',
  '$lte',
  '$any',
  '$between',
  '$contains',
  '$ne',
  '$nin',
  '$overlap',
];

// create one record
const createOne = async (model, data) => model.create(data);

// create multiple records
const createMany = async (model, data, options = { validate: true }) =>
  model.bulkCreate(data, options);

// update record(s) when query matches
const update = async (model, query, data) => {
  query = queryBuilderParser(query);
  let result = await model.update(data, {
    where: query,
    individualHooks: true,
  });
  result = await model.findAll({ where: query });
  return result;
};

const updateRecord = async (instance, data) => {
  try {
    return await instance.update(data);
  } catch (error) {
    console.log(error);
  }
};

// save a Sequelize model instance (new or modified)
const save = async (instance) => {
  try {
    return await instance.save();
  } catch (error) {
    console.log(error);
  }
};

// delete record(s) when query matches
const destroy = async (model, query) => {
  query = queryBuilderParser(query);
  const result = await model.findAll({ where: query });
  await model.destroy({ where: query });
  return result;
};

// delete record using primary key
const deleteByPk = async (model, pk) => model.destroy({ where: { [model.primaryKeyField]: pk } });

// find single record
const findOne = async (model, query, options = {}) => {
  try {
    query = queryBuilderParser(query);
    return model.findOne({
      where: query,
      ...options,
    });
  } catch (error) {
    console.log(error);
  }
};
// find a single record by primary key
const findByPk = async (model, pk, options = {}) => {
  try {
    return await model.findByPk(pk, options);
  } catch (error) {
    console.log(error);
  }
};

// find multiple records with pagination
const paginate = async (model, query, options = {}) => {
  try {
    query = queryBuilderParser(query);
    if (options && options.attributes && options.attributes.length) {
      options.attributes = options.attributes;
      delete options.attributes;
    }
    if (options && options.sort) {
      options.order = sortParser(options.sort);
      delete options.sort;
    }
    if (options && options.include && options.include.length) {
      const include = [];
      options.include.forEach((i) => {
        i.model = Models[i.model];
        if (i.query) {
          i.where = queryBuilderParser(i.query);
        }
        include.push(i);
      });
      options.include = include;
    }
    options = {
      ...options,
      where: query,
    };

    const result = await model.paginate(options);
    const data = {
      data: result.docs,
      paginator: {
        itemCount: result.total,
        perPage: options.paginate || 25,
        pageCount: result.pages,
        currentPage: options.page || 1,
      },
    };
    return data;
  } catch (error) {
    console.log(error);
  }
};

// find multiple records without pagination
const findAll = async (model, query, options = {}) => {
  try {
    query = queryBuilderParser(query);

    // attributes specific attributes
    if (options.attributes && options.attributes.length) {
      options.attributes = options.attributes;
      delete options.attributes;
    }

    // Sort handling
    if (options.sort) {
      options.order = sortParser(options.sort);
      delete options.sort;
    }

    // Include relationships
    if (options.include && options.include.length) {
      const include = [];
      options.include.forEach((i) => {
        if (typeof i.model === 'string') {
          i.model = Models[i.model];
        }
        if (i.query) {
          i.where = queryBuilderParser(i.query);
        }
        include.push(i);
      });
      options.include = include;
    }

    // Handle group and custom attributes like COUNT DISTINCT
    if (options.groupCount) {
      const groupBy = options.groupCount.groupBy;
      const countDistinct = options.groupCount.countDistinct;

      options.attributes = [
        groupBy,
        [
          Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col(countDistinct))),
          'candidate_count',
        ],
      ];

      options.group = [groupBy];

      delete options.groupCount;
    }
    // Merge all options
    options = {
      where: query,
      ...options,
    };
    return model.findAll(options);
  } catch (error) {
    console.log(error);
  }
};

// count records for specified query
const count = async (model, query, options = {}) => {
  query = queryBuilderParser(query);
  return model.count({
    where: query,
    ...options,
  });
};

//
const upsert = async (model, data, options = {}) => model.upsert(data, options);

/*
 * @description : parser for query builder
 * @param  {obj} data : {}
 * @return {obj} data : query
 */
const queryBuilderParser = (data) => {
  if (data) {
    Object.entries(data).forEach(([key]) => {
      if (typeof data[key] === 'object') {
        queryBuilderParser(data[key]);
      }
      if (OPERATORS.includes(key)) {
        const opKey = key.replace('$', '');
        data[Op[opKey]] = data[key];
        delete data[key];
      } else if (key === '$ne') {
        data[Op.not] = data[key];
        delete data[key];
      } else if (key === '$nin') {
        data[Op.notIn] = data[key];
        delete data[key];
      }
    });
  }

  return data;
};

/*
 * @description : parser for query builder of sort
 * @param  {obj} input : {}
 * @return {obj} data : query
 */
const sortParser = (input) => {
  const newSortedObject = [];
  if (input) {
    Object.entries(input).forEach(([key, value]) => {
      if (value === 1) {
        newSortedObject.push([key, 'ASC']);
      } else if (value === -1) {
        newSortedObject.push([key, 'DESC']);
      }
    });
  }
  return newSortedObject;
};

/*
 * @description : find and count multiple records with pagination
 * @param  {obj} data : {}
 * @return {obj} data : query
 */
const findAndCountAll = async (model, query, options = {}, formatPaginatedResponse = true) => {
  try {
    query = queryBuilderParser(query);

    if (options?.attributes?.length) {
      options.attributes = options.attributes;
    }

    if (options?.distinct) {
      options.distinct = options.distinct;
    }
    if (options.sort) {
      options.order = sortParser(options.sort);
      delete options.sort;
    }

    if (options.include?.length) {
      const resolveIncludeModels = (includes) => {
        return includes.map((includeItem) => {
          // Resolve model from string
          if (typeof includeItem.model === 'string') {
            includeItem.model = Models[includeItem.model];
          }

          // Convert query to where clause
          if (includeItem.where) {
            includeItem.where = queryBuilderParser(includeItem.where);
          }

          // Recursively resolve nested includes
          if (Array.isArray(includeItem.include)) {
            includeItem.include = resolveIncludeModels(includeItem.include);
          }
          return includeItem;
        });
      };

      options.include = resolveIncludeModels(options.include);
    }

    // Merge options cleanly (keep offset, limit, order, etc.)
    const finalOptions = {
      where: query,
      ...options,
      distinct: true,
    };

    const { count, rows } = await model.findAndCountAll(finalOptions);

    if (!formatPaginatedResponse) {
      return {
        count,
        rows,
      };
    }
    return {
      data: rows,
      paginator: {
        itemCount: count,
        perPage: options.limit || 25,
        pageCount: Math.ceil(count / (options.limit || 25)),
        currentPage: options.page || 1,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

export default {
  findOne,
  findByPk,
  createOne,
  createMany,
  update,
  destroy,
  deleteByPk,
  findAll,
  findAndCountAll,
  count,
  upsert,
  paginate,
  queryBuilderParser,
  sortParser,
  save,
  updateRecord,
};
