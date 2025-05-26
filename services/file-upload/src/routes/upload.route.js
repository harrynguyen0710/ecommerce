const express = require('express');
const upload = require('../utils/multerStorage')

const { handleUpload } = require('../controllers/upload.controller');

const router = express.Router();

router.post('/products', upload.single('file'), handleUpload);


module.exports = router;


