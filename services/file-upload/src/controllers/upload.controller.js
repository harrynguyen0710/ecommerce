const { enqueueFileJob } = require("../services/fileJob.service");

const { generateCorrelationMetadata } = require("../utils/correlation");

const jobStatus = require('../enum/job.status');

async function handleUpload(req, res) {
    const metadata = generateCorrelationMetadata();
    
    const job = await enqueueFileJob(req.file, metadata);

    return res.json({
        jobId: job.id,
        status: jobStatus.QUEUE,
        file: req.file.originalname,
        correlationId: metadata.correlationId,
    });
}

module.exports = { handleUpload };
