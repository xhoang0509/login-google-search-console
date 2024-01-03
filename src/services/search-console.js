const { GoogleSearchConsole } = require("../auto/searchConsole");

exports.getMetaTag = async (siteDomain) => {
    const googleSearchConsole = new GoogleSearchConsole(siteDomain);
    await googleSearchConsole.init();
    await googleSearchConsole.getMetaTag();

    return "";
};
