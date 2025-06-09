const express = require('express');


const app = express();

app.use('/metrics', require('./routes/logging.route'));


module.exports = app;
