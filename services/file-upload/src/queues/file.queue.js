const { Queue } = require('bullmq');

const connection = require('../configs/redisConnection');

const fileQueue = new Queue('file-upload-queue', { connection });

module.exports = { fileQueue };

