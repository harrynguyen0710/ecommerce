'use strict'

const app = require('./src/app');

require('dotenv').config();

const PORT = process.env.PORT || 5002;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Inventories Service is running on port ${PORT}`);
});
