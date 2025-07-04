import cors from 'cors';
import express from 'express';
import router from '../routes/index.js';
import errorHandler from '../utils/errorHandler.util.js';
import apiLogger from './apiLogger.middleware.js';
import limiter from './rateLimiter.middleware.js';

const globalMiddleware = (app) => {
  // Middleware
  app.use(cors());
  app.use(express.json()); // Parse JSON bodies
  app.use(express.urlencoded({ extended: true }));

  // Apply rate limit globally
  app.use(limiter);

  // API logging
  app.use(apiLogger);

  // Routes
  app.use('/api', router);

  // Global Error Handler
  app.use(errorHandler);

  // 404 Handler
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });

  // Health Check Route
  app.get('/', (req, res) => {
    res.send('✅ Server is up and running!');
  });
};

export default globalMiddleware;
