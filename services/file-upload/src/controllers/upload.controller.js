const { enqueueFileJob } = require('../services/fileJob.service');

async function handleUpload(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const job = await enqueueFileJob(req.file);

    return res.json({
        jobId: job.id,
        status: 'QUEUED',
        file: req.file.originalname,
    });
}

module.exports = { handleUpload };
