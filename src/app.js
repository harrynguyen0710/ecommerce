require('dotenv').config()
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const { default: helmet } = require('helmet');

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json()); // parse JSON requests
app.use(express.urlencoded({ extended: true }));

// init mongodb
require('./dbs/init.mongodb');

app.use('/', require('./routes/index'));

// 404 error handling middleware
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


