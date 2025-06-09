require("dotenv").config();
const app = require("./src/app");


const connectMongo = require("./src/configs/mongo");
const connectRedis = require("./src/configs/cartRedis/redisConnector");

async function startServer() {
  try {
    await connectMongo();
    await connectRedis();

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`🚀 Cart Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("💥 Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();