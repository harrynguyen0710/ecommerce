const express = require('express');
const app = express();


app.use(express.json());

const { connectPrisma } = require('./configs/prisma');

connectPrisma(); 


app.use('/v1/api', require('./route/discount.route'));

// middleware 404
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});


// midleware 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


module.exports = app;