const app = require('./src/app');
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log('Listening on: ', PORT);
})