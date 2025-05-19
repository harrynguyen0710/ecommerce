const mongoose = require('mongoose');

async function connectMongo() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 50,
        });
        console.log('✅ In Product Service, MongoDB connected (pool size 50)');
    } catch (error) {
        console.error('❌ In Product Service, MongoDB connection failed:', error);
        process.exit(1);
    }
}

module.exports = connectMongo;