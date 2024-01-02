const { Response } = require(".");

class SuccessResponse extends Response {
    constructor({ message = "OK", payload = null }) {
        super({ statusCode: 200, success: true, message, payload });
    }
}

module.exports = SuccessResponse;
