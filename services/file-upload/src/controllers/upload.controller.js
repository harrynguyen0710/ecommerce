const { enqueueFileJob } = require('../services/fileJob.service');
const { v4: uuidv4 } = require("uuid");

async function handleUpload(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const correlationId = uuidv4(); 
    const startTimestamp = Date.now(); 

    const job = await enqueueFileJob(req.file, { correlationId, startTimestamp });

    return res.json({
        jobId: job.id,
        status: 'QUEUED',
        file: req.file.originalname,
        correlationId,
    });
}

module.exports = { handleUpload };
