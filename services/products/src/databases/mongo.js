const mongoose = require('mongoose');

async function connectMongo(retries = 5) {
  const uri = process.env.MONGO_URI;
  
  while (retries) {

    try {
      await mongoose.connect(uri, {
        maxPoolSize: 50,
      });
      console.log('📦 Connected to DB:', mongoose.connection.name);
      console.log('✅ In Product Service, MongoDB connected');
      break;
    } catch (err) {
      console.log(`❌ MongoDB connection failed. Retrying in 5s... (${retries} left)`);
      retries--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  if (!retries) {
    console.error('❌ Could not connect to MongoDB after several attempts');
    process.exit(1);
  }
}

module.exports = connectMongo;
