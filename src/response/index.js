const env = process.env.NODE_ENV;
class Response {
    constructor({ statusCode, success, message, payload, error = null }) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.payload = payload;
        this.error = error;
    }

    send(res) {
        const body = {
            success: this.success,
            message: this.message,
        };
        if (this.payload) {
            body.metadata = this.payload;
        }
        if (this.error instanceof Error) {
            body.errors = {
                message: this.error.message,
                ...(env !== "production" ? { stack: this.error.stack } : {}),
            };
        }

        return res.status(this.statusCode).json(body);
    }
}
module.exports = {
    Response,
};
