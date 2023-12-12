const { GoogleSearchConsole } = require("../handlers/searchConsole");

exports.openDashboard = async (req, res) => {
    try {
        const { domain } = req.body;
        const googleSearchConsole = new GoogleSearchConsole(domain);
        await googleSearchConsole.init();
        await googleSearchConsole.openDashboard();
        // await googleSearchConsole.close();
        res.status(200).json({
            message: "open dashboard",
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message,
        });
    }
};

exports.submitSitemap = async (req, res) => {
    try {
        const { domain } = req.body;
        const googleSearchConsole = new GoogleSearchConsole(domain);
        await googleSearchConsole.init();
        await googleSearchConsole.submitSiteMap();
        // await googleSearchConsole.close();
        res.status(200).json({ message: `OK` });
    } catch (e) {
        return res.status(500).json({
            message: e.message,
        });
    }
};

exports.removeUrlCache = async (req, res) => {
    try {
        const { domain } = req.body;
        const googleSearchConsole = new GoogleSearchConsole(domain);
        await googleSearchConsole.init();
        await googleSearchConsole.removeUrlCache();

        res.status(200).json({
            message: "OK",
            type: "removeUrlCache",
        });
        // setTimeout(async () => {
        //     await googleSearchConsole.close();
        // }, 10000);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e.message,
        });
    }
};
