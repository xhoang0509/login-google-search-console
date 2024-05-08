/* eslint-disable no-unused-vars */
const schedule = require("node-schedule");
const { publishChromium } = require("../queues/publisher");
const { CONSUME_ACTION } = require("../queues/consumer/chromium");
const { CHROMIUM_QUEUE } = require("../queues/consumer");
const { info } = require("../logger");

const _EVERY_1_HOUR = `0 * * * *`;
const _EVERY_3_MINUTES = `*/3 * * * *`;
module.exports = {
    checkGoogleAccountLogged: schedule.scheduleJob(_EVERY_1_HOUR, () => {
        info(__filename, "[APP schedule]", "hourly check google account login");
        publishChromium(CHROMIUM_QUEUE, {
            siteUrl: "",
            action: CONSUME_ACTION.CHECK_GG_LOGGED,
            payload: {
                domain: "",
            },
        });
    }),
};
