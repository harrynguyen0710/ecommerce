'use strict'

const express = require('express');
const router = express.Router();

// required helpers
const asyncHandler = require('../utils/asyncHandler');

// authenticate middleware
const authenticate = require('../middlewares/authenticateUser');

// auth controller
const AuthController = require('../controllers/auth.controller');

router.post("/signup", asyncHandler(AuthController.signup));
router.post("/login", asyncHandler(AuthController.login));


router.use(asyncHandler(authenticate));

router.post("/logout",asyncHandler(AuthController.logout));
router.post("/logout-all", asyncHandler(AuthController.logoutAll));
router.post("/get-access-token", asyncHandler(AuthController.getAccessToken));

module.exports = router;
