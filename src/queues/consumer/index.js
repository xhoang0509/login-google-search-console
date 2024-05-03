const { handleChromium } = require("./chromium");

const CHROMIUM_QUEUE = "chromium_queue";

const chromiumConsume = async (channel) => {
    await channel.assertQueue(CHROMIUM_QUEUE, { durable: true });
    channel.prefetch(1);
    channel.consume(CHROMIUM_QUEUE, (message) => handleChromium(channel, message));
};

module.exports = {
    CHROMIUM_QUEUE,
    chromiumConsume,
};
