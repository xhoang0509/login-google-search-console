class Response {
    constructor({ statusCode, success, message, payload }) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.payload = payload;
    }

    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            ...(this.payload ? { payload: this.payload } : {}),
        });
    }
}
module.exports = {
    Response,
};
