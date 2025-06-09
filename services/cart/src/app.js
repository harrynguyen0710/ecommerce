const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const cartRoutes = require("./routes/cart.route");
const app = express();


app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));


app.use("/v1/api/cart", cartRoutes);


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
