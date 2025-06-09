const express = require('express');
const app = express();

const { connectPrisma } = require('./config/prisma');

app.use(express.json());


connectPrisma(); 

app.use((req, res, next) => {
  console.log(`🛰️ Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// routes
app.use('/v1/api', require('./routes/inventory.route'));

// error catching handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// global error handling middleware
app.use((error, req, res, next) => {
    const statusCode = error.status || 500; 
    return res.status(statusCode).json({
        status: statusCode,
        message: error.message || 'Internal Server Error',
    });
});

module.exports = app;