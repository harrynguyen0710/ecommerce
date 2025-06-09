const mongoose = require("mongoose");

async function connectMongo(retries = 5, delay = 5000) {
  const uri = process.env.MONGO_URI;

  if (!uri) throw new Error("❌ MONGO_URI is missing in .env");

  while (retries) {
    try {
      await mongoose.connect(uri, {
        maxPoolSize: 50,
      });

      console.log("📦 Connected to DB:", mongoose.connection.name);
      console.log("✅ In Cart Service, MongoDB connected");
      return;
    } catch (error) {
      console.error("❌ MongoDB connection error:", error.message);
      console.log(
        `⏳ Retrying in ${delay / 1000}s... (${retries} retries left)`
      );
      retries--;
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  console.error("💀 Could not connect to MongoDB after all attempts");
  process.exit(1);
}

module.exports = connectMongo;
