const { error } = require("../../logger");

const CONSUME_ACTION = {
    GET_AND_ADD_METATAG: "get_and_add_meta_tag",
    VERIFY_METATAG: "verify_metatag",
    REMOVE_URL_CACHE: "remove_url_cache",
};
const { GET_AND_ADD_METATAG, VERIFY_METATAG, REMOVE_URL_CACHE } = CONSUME_ACTION;

exports.CONSUME_ACTION = CONSUME_ACTION;
exports.handleChromium = async (channel, message) => {
    try {
        const data = message.content.toString();
        const dataJson = JSON.parse(data);
        const { action } = dataJson;
        if (!action) {
            channel.ack(message);
            error(__filename, "handleChromium", "must be action!");
            return;
        }

        if (action === GET_AND_ADD_METATAG) {
        }

        if (action === VERIFY_METATAG) {
        }

        if (action === REMOVE_URL_CACHE) {
        }
        console.log("run handle chromium", { dataJson });
        await new Promise((res) => setTimeout(res, 10000));
    } catch (e) {
        error(__filename, "APP", e.message);
    }
    channel.ack(message);
};
