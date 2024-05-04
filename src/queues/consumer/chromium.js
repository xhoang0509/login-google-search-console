const { SHOPIFY_THEME_FILENAME } = require("../../constants");
const { error, info } = require("../../logger");
const { SearchConsoleChromiumService } = require("../../services/chromium/search-console");
const ThemeService = require("../../services/shopify/theme");

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
        const { action, siteUrl } = dataJson;
        if (!action) {
            channel.ack(message);
            error(__filename, "handleChromium", "must be action!");
            return;
        }

        if (action === GET_AND_ADD_METATAG) {
            const metaTag = await SearchConsoleChromiumService.getMetaTag(siteUrl);
            if (!metaTag) {
                info(__filename, "handleChromium", "Could not get meta tag form Chromium!");
                channel.ack(message);
                return;
            }
            const { domain, themeId, accessToken, content } = dataJson.payload;
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
            const { domain } = dataJson.payload;
            await SearchConsoleChromiumService.verifyMetaTag(domain);
        }

        if (action === REMOVE_URL_CACHE) {
            const { domain } = dataJson.payload;
            await SearchConsoleChromiumService.removeUrlCache(domain);
        }
    } catch (e) {
        error(__filename, "APP", e.message);
    }
    channel.ack(message);
};
