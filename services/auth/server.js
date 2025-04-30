'use strict'

const app = require('./src/app');
const dotenv = require('dotenv');   

dotenv.config({ path: "./local.env" });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
