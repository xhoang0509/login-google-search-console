const { Response } = require(".");

class InternalServerError extends Response {
    constructor({ message = "Internal Server Error", payload = null, error = null }) {
        super({ statusCode: 500, message, success: false, payload, error });
    }
}

class BadRequestResponse extends Response {
    constructor({ message = "Bad Request", payload = null, error = null }) {
        super({ statusCode: 400, message, success: false, payload, error });
    }
}

class NotFound extends Response {
    constructor({ message = "Not found", payload = null }) {
        super({ statusCode: 404, message, success: false, payload });
    }
}

class Forbidden extends Response {
    constructor({ message = "Forbidden", payload = null }) {
        super({ statusCode: 403, message, success: false, payload });
    }
}

module.exports = {
    Forbidden,
    InternalServerError,
    NotFound,
    BadRequestResponse,
};
