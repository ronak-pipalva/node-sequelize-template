import express from 'express';
import globalMiddleware from './middlewares/app.middleware.js';
import startServer from './config/server.js';

const app = express();

//setup middlewares
globalMiddleware(app);

// Start server
startServer();

export default app;
