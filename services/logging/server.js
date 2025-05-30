const dotenv = require("dotenv");

require("dotenv").config();

const startKafkaConsumer = require("./src/kafka/consumers/metricConsumer");

const startTTLCleaner = require("./src/utils/ttlCleaner");

const app = require("./src/app");

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`🚀 Metrics service running at http://localhost:${port}`);
  startKafkaConsumer();
  startTTLCleaner();
});
