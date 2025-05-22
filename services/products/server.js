'use strict'

const app = require('./src/app');
const dotenv = require('dotenv');   


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});
