const express = require('express');
const validateInput =  require("../middlewares/validateInput");

const router = express.Router();
const discountController = require('../controllers/discount.controller');

router.post('/discounts', validateInput, discountController.createDiscount);

module.exports = router;