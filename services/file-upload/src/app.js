const express = require('express');

const uploadRoute = require('./routes/upload.route');

const app = express();

app.use('/v1/api/bulk-upload', uploadRoute);

module.exports = app;