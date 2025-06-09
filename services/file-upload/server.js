const app = require('./src/app');

require('dotenv').config();

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
    console.log(`File Service is running on port ${PORT}`);
});