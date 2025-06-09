const express = require('express');
const upload = require('../utils/multerStorage')

const { handleUpload } = require('../controllers/upload.controller');

const validateFile = require('../middlewares/validateFile')

const router = express.Router();

router.post('/products', upload.single('file'), validateFile ,handleUpload);


module.exports = router;


