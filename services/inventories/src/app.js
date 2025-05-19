require('dotenv').config({ path: '../local.env' });

const express = require('express');
const app = express();

const bodyParser = require('body-parser');


const { connectPrisma } = require('./config/prisma');

connectPrisma(); 


app.use(express.json());

// routes

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