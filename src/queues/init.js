const amqp = require("amqplib");
const { app } = require("../config");
const { error, info } = require("../logger");
const { chromiumConsume } = require("./consumer");

const createChannelQueue = async () => {
    try {
        const connection = await amqp.connect(app.amqp_uri);
        const channel = await connection.createConfirmChannel();

        return channel;
    } catch (e) {
        error(__filename, "APP", `Create chanel failed: ${e.message}`);
    }
};

const connectQueue = async () => {
    try {
        const connection = await amqp.connect(app.amqp_uri);
        info(__filename, "", "Connected RabbitMQ");
        connection.on("error", function (err) {
            error(__filename, "", err.message);
            setTimeout(connectQueue, 10000);
        });
        connection.on("close", function () {
            error(__filename, "APP", "connection to RabbitQM closed!");
            setTimeout(connectQueue, 10000);
        });

        const chanel = await connection.createConfirmChannel();
        await chromiumConsume(chanel);
    } catch (e) {
        error(__filename, "APP", `Connect RabbitMQ failed: ${e.message}`);
        setTimeout(connectQueue, 10000);
    }
};

module.exports = {
    connectQueue,
    createChannelQueue,
};
