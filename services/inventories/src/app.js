require('dotenv').config({ path: '../local.env' });

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { startConsumer } = require('./kafka/consumer');
const { connectDlqProducer } = require('./kafka/dlqProducer');

const { connectPrisma } = require('./config/prisma');

connectPrisma(); 

async function startApp() {
  await connectDlqProducer();
  await startConsumer();
}

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


startApp();


module.exports = app;