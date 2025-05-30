const { Queue } = require('bullmq');

const redisOptions = require('../configs/bullMQConnection');

const { QUEUE_NAMES } = require("../constants/index")

const fileQueue = new Queue(QUEUE_NAMES.FILE_UPLOAD, { connection: redisOptions });

module.exports = { fileQueue };

