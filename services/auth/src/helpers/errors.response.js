'use strict'
const {
    StatusCode,
    ReasonPhrase
} = require('../core/httpStatusCode');

class ErrorResponse extends Error{
    constructor( message, status ) {
        super(message);
        this.status = status;
    }
}

class BadRequestError extends ErrorResponse {
    constructor( message = ReasonPhrase.BAD_REQUEST, status = StatusCode.BAD_REQUEST ) {
        super(message, status);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor( message = ReasonPhrase.FORBIDDEN, status = StatusCode.FORBIDDEN ) {
        super(message, status);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor( message = ReasonPhrase.UNAUTHORIZED, status = StatusCode.UNAUTHORIZED ) {
        super(message, status);
    }
}

class NotFoundError extends ErrorResponse {
    constructor( message = ReasonPhrase.NOT_FOUND, status = StatusCode.NOT_FOUND ) {
        super(message, status);
    }
}


module.exports = {
    BadRequestError,
    ForbiddenError,   
    AuthFailureError,
    NotFoundError,
}