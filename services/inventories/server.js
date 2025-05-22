'use strict'

const app = require('./src/app');
const dotenv = require('dotenv');   

require('dotenv').config();

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Inventories Service is running on port ${PORT}`);
});
