require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { startConsumer } = require('./kafka/consumer');
const { connectDlqProducer } = require('./kafka/dlqProducer');

const { connectPrisma } = require('./config/prisma');

connectPrisma(); 

const { producer } = require('./config/kafka');

(async () => {
  await producer.connect();
})();


async function startApp() {
  await connectDlqProducer();
  await startConsumer();
}

app.use(express.json());
// app.use(bodyParser.json());

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


startApp();


module.exports = app;