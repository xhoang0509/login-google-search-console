const { GoogleAccount } = require("../auto/google");
const { GoogleSearchConsole } = require("../auto/searchConsole");
const config = require("../config");
const { googleAccount } = config;

exports.authApi = async (req, res) => {
    const resp = {
        message: "OK",
    };
    let statusCode = 200;
    try {
    } catch (e) {
        console.log(e);
    }
    return res.status(statusCode).json(resp);
};

exports.callback = async (req, res) => {
    const resp = {
        message: "OK",
    };
    let statusCode = 200;
    try {
    } catch (e) {
        console.log(e);
    }
    return res.status(statusCode).json(resp);
};

exports.openDashboard = async (req, res) => {
    try {
        const { domain } = req.body;
        const googleSearchConsole = new GoogleSearchConsole(domain);
        await googleSearchConsole.init();
        await googleSearchConsole.openDashboard();
        // await googleSearchConsole.close();

        // const googleChrome = new GoogleAccount(googleAccount.email, googleAccount.password);
        // await googleChrome.init();
        // await googleChrome.login();
        res.status(200).json({
            message: "open dashboard",
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message,
        });
    }
};

exports.openSitemap = async (req, res) => {
    try {
        const { domain } = req.body;
        const googleSearchConsole = new GoogleSearchConsole(domain);
        await googleSearchConsole.init();
        await googleSearchConsole.openSiteMap();
        res.status(200).json({ message: `OK` });
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
