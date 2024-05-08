const { SHOPIFY_THEME_FILENAME } = require("../../constants");
const { error, info } = require("../../logger");
const { SearchConsoleChromiumService } = require("../../services/chromium/search-console");
const GmailChromiumService = require("../../services/chromium/gmail");
const ThemeService = require("../../services/shopify/theme");

const CONSUME_ACTION = {
    GET_AND_ADD_METATAG: "get_and_add_meta_tag",
    VERIFY_METATAG: "verify_metatag",
    REMOVE_URL_CACHE: "remove_url_cache",
    CHECK_GG_LOGGED: "check_gg_logged",
};
const { GET_AND_ADD_METATAG, VERIFY_METATAG, REMOVE_URL_CACHE, CHECK_GG_LOGGED } = CONSUME_ACTION;

exports.CONSUME_ACTION = CONSUME_ACTION;

exports.handleChromium = async (channel, message) => {
    try {
        const data = message.content.toString();
        const dataJson = JSON.parse(data);
        const { action, siteUrl, payload } = dataJson;
        const { domain } = payload;
        if (!action) {
            channel.ack(message);
            error(__filename, "handleChromium", "must be action!");
            return;
        }

        if (action === GET_AND_ADD_METATAG) {
            const { themeId, accessToken, content } = dataJson.payload;

            const metaTag = await SearchConsoleChromiumService.getMetaTag({ domain, siteUrl });
            if (!metaTag) {
                info(__filename, "handleChromium", "Could not get meta tag form Chromium!");
                channel.ack(message);
                return;
            }
            const contentUpdate = content.replace("</title>", `</title>\n ${metaTag}\n`);
            const pushContentFileResp = await ThemeService.pushContentFile({
                domain,
                accessToken,
                themeId,
                fileName: SHOPIFY_THEME_FILENAME,
                fileContent: contentUpdate,
            });
            console.log("===> push content to theme: ", pushContentFileResp);
        }

        if (action === VERIFY_METATAG) {
            await SearchConsoleChromiumService.verifyMetaTag({ domain, siteUrl });
        }

        if (action === REMOVE_URL_CACHE) {
            await SearchConsoleChromiumService.removeUrlCache({ domain, siteUrl });
        }

        if (action === CHECK_GG_LOGGED) {
            const status = await GmailChromiumService.checkLogin();
            if (status == false) {
                await GmailChromiumService.login();
            }
            info(
                __filename,
                "[APP schedule]",
                status ? "Google Account logged" : "Google Account is not logged in",
            );
        }
    } catch (e) {
        error(__filename, "APP", e.message);
    }
    channel.ack(message);
};
