import Sequelize from 'sequelize';
import config from '../config/envConfig.js';
import User from './user.model.js';

const sequelize = new Sequelize(config.DB_NAME, config.DB_USERNAME, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: config.DB_DIALECT,
  logging: false,
});

// Initialize models
const db = {
  User: User(sequelize, Sequelize.DataTypes),
};

// Apply associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
