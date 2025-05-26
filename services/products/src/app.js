// require('dotenv').config();

const express = require('express');
const app = express();

const requestTimer = require('./middlewares/requestTimer');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// request timer for measure metrics
app.use(requestTimer); 


// database connections
const connectMongo = require('../src/databases/mongo');

connectMongo();


// routes
app.use('/v1/api/products', require('./routes/products.route'));



// error catching handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// global error handling middleware
app.use((error, req, res, next) => {
    const statusCode = error.status || 500; 
    console.log('500 error::', error);
    return res.status(statusCode).json({
        status: statusCode,
        message: error.message || 'Internal Server Error',
    });
});

module.exports = app;