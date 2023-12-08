const { chromium } = require("playwright");
const googleHandler = require("./handlers/google");
const { GoogleSearchConsole } = require("./handlers/searchConsole");

const main = async () => {
    try {
        const browser = await chromium.launchPersistentContext("/home/xhoang/.config/google-chrome/Profile 8", {
            channel: "chrome",
            // headless: false,
        });
        const page = await browser.newPage();
        const pageSearchConsole = await browser.newPage();
        const googleSearchConsole = new GoogleSearchConsole("https://doppelherz.neo-artistic.com/", pageSearchConsole);
        await googleSearchConsole.openDashboard();
        await googleSearchConsole.openSiteMap();
        await googleSearchConsole.submitSiteMap();

        // await pageSearchConsole.$(`[data-node-index='2;0'] div[role='button'][jsaction] > span[jsslot] > span[class]`);
        // await browser.close();
    } catch (e) {
        console.log(e);
    }
};

main();
