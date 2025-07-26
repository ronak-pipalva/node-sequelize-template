import os from 'os';
import { Op } from 'sequelize';

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};
const buildWhereClause = (filters) => {
  const where = {};

  filters.forEach((filter) => {
    const { field, operator, value } = filter;

    switch (operator) {
      case 'eq':
        where[field] = value;
        break;
      case 'gt':
        where[field] = { [Op.gt]: value };
        break;
      case 'lt':
        where[field] = { [Op.lt]: value };
        break;
      case 'gte':
        where[field] = { [Op.gte]: value };
        break;
      case 'lte':
        where[field] = { [Op.lte]: value };
        break;
      case 'like':
        where[field] = { [Op.iLike]: `%${value}%` };
        break;
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          where[field] = { [Op.between]: value };
        } else {
          throw new Error(`Invalid value for 'between' on "${field}"`);
        }
        break;
      case 'ne':
        where[field] = { [Op.ne]: value };
        break;
      case 'in':
        where[field] = { [Op.in]: value };
        break;
      case 'nin':
        where[field] = { [Op.notIn]: value };
        break;
      case 'overlap':
        if (field === 'location') {
          const escapedArray = value.map((v) => `'${v}'`).join(', ');
          where[Op.and] = literal(`"location" && ARRAY[${escapedArray}]::TEXT[]`);
        } else {
          where[field] = { [Op.overlap]: value };
        }
        break;
      default:
        throw new Error(`Unsupported operator "${operator}"`);
    }
  });

  return where;
};

export { getLocalIP, buildWhereClause };
