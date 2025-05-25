'use strict'

const app = require('./src/app');

require('dotenv').config();

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`Discount Service is running on port ${PORT}`);
});
