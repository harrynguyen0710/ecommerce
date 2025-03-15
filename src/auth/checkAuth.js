'use strict'

const { verifyToken, getPrivateKey } = require('./authUtils');
const { AuthFailureError } = require('../core/error.response');
const jwt = require('jsonwebtoken');

const HEADER = {
    // API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const checkTokenExpiry = (async (req, res, next) => {
    // get token from user request header
    const token = req.headers[HEADER.AUTHORIZATION];

    // decode the token without signature
    const decoded = jwt.decode(token);

    // if token is expired, throw an error
    if (decoded.exp < Date.now() / 1000) {
        return next(new AuthFailureError('Something went wrong!'));
    }

    // pass request to the next middleware
    next();
})

const checkAuthentication = ( async (req, res, next) => {
    // get token from user request header
    const token = req.headers[HEADER.AUTHORIZATION];
        
    // get private key to verify token from the user
    const privateKey = getPrivateKey();

    const payload = await verifyToken(token, privateKey);

    if (!payload || payload.exp < Date.now() / 1000) {
        return next (new AuthFailureError('Invalid request'));
    }

    // pass userId to the request to check role for the next middleware session
    req.userId = payload.userId;
    console.log('in this::', typeof req.userId);
    console.log('this is from authentication::', req.userId);
    // pass request to the next middleware
    return next();
});

module.exports = {
    checkAuthentication,
    checkTokenExpiry,
}