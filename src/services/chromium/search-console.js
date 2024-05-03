const { GoogleSearchConsole } = require("../../auto/searchConsole");
const { error } = require("../../logger");

const SearchConsoleChromiumService = {
    getMetaTag: async (siteUrl) => {
        const googleSearchConsole = new GoogleSearchConsole(siteUrl);
        await googleSearchConsole.init();
        const metaTag = await googleSearchConsole.getMetaTag();
        await googleSearchConsole.close();

        if (!metaTag) {
            return "";
        }
        return metaTag;
    },

    verifyMetaTag: async () => {
        try {
        } catch (e) {
            error(__filename, "verifyMetaTag", e.message);
        }
    },

    removeUrlCache: async () => {
        try {
        } catch (e) {
            error(__filename, "removeUrlCache", e.message);
        }
    },
};

module.exports = { SearchConsoleChromiumService };
