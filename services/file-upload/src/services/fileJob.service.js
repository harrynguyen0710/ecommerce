const path = require('path');

const { fileQueue } = require('../queues/file.queue');

const { JOB_NAMES } = require("../constants/index");

async function enqueueFileJob(file, meta = {}) {
    return await fileQueue.add(JOB_NAMES.PROCESS_CSV, {
        filePath: path.resolve(file.path),
        originalName: file.originalname,
        ...meta,
    });
}

module.exports = {
    enqueueFileJob,
}