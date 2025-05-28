const express = require('express');
const router = express.Router();

const LoggingController = require('../controllers/logging.controller');


router.get('/', LoggingController.getAllMetrics.bind(controller));
router.get('/:service', LoggingController.getServiceMetrics.bind(controller));
router.get('/:service/:event', LoggingController.getEventMetrics.bind(controller));

module.exports = router;
