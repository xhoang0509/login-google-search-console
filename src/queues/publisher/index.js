const { error } = require("../../logger");
const { createChannelQueue } = require("../init");

let channel = null;

exports.initChromiumPublish = async () => {
    try {
        channel = await createChannelQueue();
    } catch (e) {
        error(__filename, "", `Init publish failed: ${e.message}`);
    }
};

exports.publishChromium = async (queue, message) => {
    await channel.assertQueue(queue, { durable: true });
    const messageBuffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queue, messageBuffer, { persistent: true });
};
