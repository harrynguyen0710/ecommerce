require('dotenv').config({ path: "./local.env" });

const Redis = require('ioredis');   

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.2',
    port: process.env.REDIS_PORT || 6379,   
});



redis.on('connect', () => {
    console.log('✅ Redis is connected');
});

redis.on('error', (err) => {
    console.log('❌ Redis error:', err);
});


module.exports = redis;