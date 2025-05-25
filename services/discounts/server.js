'use strict'

const app = require('./src/app');

require('dotenv').config();

const PORT = process.env.PORT || 5003;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Discount Service is running on port ${PORT}`);
});
