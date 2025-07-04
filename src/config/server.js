import dotenv from 'dotenv';
import app from '../app.js';
import db from '../models/index.js';
import { getLocalIP } from '../utils/app.util.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');

    const IP = getLocalIP();

    app.listen(PORT, () => {
      console.log(`🚀 Server running at:`);
      console.log(`👉 Local:     http://localhost:${PORT}`);
      console.log(`👉 Network:   http://${IP}:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default startServer;
