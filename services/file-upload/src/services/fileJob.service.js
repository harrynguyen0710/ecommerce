const path = require('path');

const { fileQueue } = require('../queues/file.queue');


async function enqueueFileJob(file, meta = {}) {
    return await fileQueue.add('process-csv', {
        filePath: path.resolve(file.path),
        originalName: file.originalname,
        ...meta,
    });
}

module.exports = {
    enqueueFileJob,
}