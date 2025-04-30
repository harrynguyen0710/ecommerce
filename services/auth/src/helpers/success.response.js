const {
    StatusCode,
    ReasonPhrase,
} = require('../core/httpStatusCode');


class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonPhrase.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata
    }

    send(res, header = {}) {
        return res.status(this.status).json(this);
    }

}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, statusCode: StatusCode.CREATED, reasonStatusCode: ReasonPhrase.CREATED, metadata });
    }
}

class NO_CONTENT extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, statusCode: StatusCode.NO_CONTENT, reasonStatusCode: ReasonPhrase.NO_CONTENT, metadata});
    }
}


module.exports = {
    OK, CREATED, SuccessResponse, NO_CONTENT,
}