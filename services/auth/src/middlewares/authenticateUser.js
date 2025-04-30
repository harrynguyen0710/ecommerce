'use strict'

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// error response
const { AuthFailureError } = require('../helpers/errors.response');

dotenv.config({ path: "./local.env" });

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.body.refreshToken;
    console.log(token);
    // check if token exists    
    if (!token) {
        console.log('no token');
        return next(new AuthFailureError('Authentication failed'));
    }

    try {
        // verify token        
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY_SECRET);
        req.user = decoded.userId;

        next();
    } catch {
        return next(new AuthFailureError('Authentication failed'));
    }
}


module.exports = authenticateUser;