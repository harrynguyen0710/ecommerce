const express = require('express');
const router = express.Router();

const LoggingController = require('../controllers/logging.controller');


router.get('/', LoggingController.getAllMetrics);
router.get('/:service', LoggingController.getServiceMetrics);
router.get('/:service/:event', LoggingController.getEventMetrics);

module.exports = router;
