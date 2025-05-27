const path = require('path');
const { fileQueue } = require('../queues/file.queue');

async function enqueueFileJob(file) {
  const filename = path.basename(file.path);

  await fileQueue.add('process-csv', {
    filePath: `/app/uploads/${filename}`,
    originalName: file.originalname,
  });

  return;
}

module.exports = {
  enqueueFileJob,
};
