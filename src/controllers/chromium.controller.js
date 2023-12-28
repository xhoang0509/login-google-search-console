const { GoogleAccount } = require("../auto/gmail");
const { GoogleSearchConsole } = require("../auto/searchConsole");
const config = require("../config");
const { InternalServerError, Forbidden } = require("../response/error.res");
const SuccessResponse = require("../response/success.res");
const { googleAccount } = config;

exports.openDashboard = async (req, res) => {
    try {
        const { domain } = req.body;
        if (!domain) {
            return new Forbidden({ message: "domain is required!" }).send(res);
        }
        const googleSearchConsole = new GoogleSearchConsole(domain);
        await googleSearchConsole.init();
        await googleSearchConsole.openDashboard();
        await googleSearchConsole.close();
        return new SuccessResponse({}).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.openSitemap = async (req, res) => {
    try {
        const { domain } = req.body;
        if (!domain) {
            return new Forbidden({ message: "domain is required!" }).send(res);
        }
        const googleSearchConsole = new GoogleSearchConsole(domain);
        await googleSearchConsole.init();
        await googleSearchConsole.openSiteMap();
        return new SuccessResponse({}).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.submitSitemap = async (req, res) => {
    try {
        const { domain } = req.body;
        const googleSearchConsole = new GoogleSearchConsole(domain);
        await googleSearchConsole.init();
        await googleSearchConsole.submitSiteMap();
        // await googleSearchConsole.close();
        return new SuccessResponse({}).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
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
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};
