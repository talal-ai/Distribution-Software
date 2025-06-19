const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Body parser with larger size limit for efficiency
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Use compression for all responses
app.use(compression());

// Add basic caching for static assets
const cacheTime = 86400000 * 7; // 7 days

// Dev logging middleware - only use in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Define routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder with caching
  app.use(express.static(path.join(__dirname, '../frontend/build'), {
    maxAge: cacheTime
  }));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  );
} else {
  // Also add caching for development mode
  app.use(express.static(path.join(__dirname, '../frontend/public'), {
    maxAge: 0 // No cache in dev mode
  }));
  
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 