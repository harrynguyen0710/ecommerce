const { createClient } = require("redis");

async function connectRedis(retries = 5, delay = 5000) {
  const REDIS_URL = process.env.REDIS_URL;

  const client = createClient({ url: REDIS_URL });

  client.on("error", (error) => {
    console.error("❌ Redis client error:", error.message);
  });

  while (retries) {
    try {
      await client.connect();
      console.log("✅ Redis connected to", REDIS_URL);
      return client;
    } catch (error) {
      console.error("❌ Redis connection failed:", error.message);
      console.log(
        `⏳ Retrying Redis in ${delay / 1000}s... (${retries} retries left)`
      );
      retries--;
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  console.error("💀 Could not connect to Redis after all attempts");
  process.exit(1);
}

module.exports = connectRedis;
