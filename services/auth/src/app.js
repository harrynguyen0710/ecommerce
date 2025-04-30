require('dotenv').config({ path: '../local.env' });

const express = require('express');
const app = express();

const bodyParser = require('body-parser');


app.use(express.json());

console.log('test');
// routes
app.use('/v1/api/auth', require('./routes/auth.routes'));

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