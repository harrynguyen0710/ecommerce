'use strict'

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const router = express.Router();

// signup
router.post('/shop/signup', asyncHandler(accessController.signup));

// login
router.post('/shop/login', asyncHandler(accessController.login));

// refresh access token
router.post('/shop/refresh-access-token', asyncHandler(accessController.refreshAccessToken));

// logout 
router.post('/shop/logout', asyncHandler(accessController.logout));


module.exports = router;