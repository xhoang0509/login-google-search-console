const { Response } = require(".");

class SuccessResponse extends Response {
    constructor({ payload = null }) {
        super({ statusCode: 200, success: true, message: "OK", payload });
    }
}

module.exports = SuccessResponse;
