const { GoogleAutomation } = require("../../auto/googleAutomation");
const { error } = require("../../logger");

const SearchConsoleChromiumService = {
    getMetaTag: async ({ domain, siteUrl }) => {
        const ggSearchConsole = new GoogleAutomation({
            domain,
            siteUrl,
        });
        await ggSearchConsole.init();
        const metaTag = await ggSearchConsole.getMetaTag();
        await ggSearchConsole.close();

        if (!metaTag) {
            return "";
        }
        return metaTag;
    },

    verifyMetaTag: async ({ domain, siteUrl }) => {
        try {
            const ggSearchConsole = new GoogleAutomation({
                domain,
                siteUrl,
                headless: false,
            });
            await ggSearchConsole.init();
            await ggSearchConsole.verifyMetaTag();
            await ggSearchConsole.close();
        } catch (e) {
            error(__filename, "verifyMetaTag", e.message);
        }
    },

    removeUrlCache: async ({ domain, siteUrl }) => {
        try {
            const ggSearchConsole = new GoogleAutomation({
                domain,
                siteUrl,
            });
            await ggSearchConsole.init();
            await ggSearchConsole.removeUrlCache();
            await ggSearchConsole.close();
        } catch (e) {
            error(__filename, "removeUrlCache", e.message);
        }
    },
};

module.exports = { SearchConsoleChromiumService };
