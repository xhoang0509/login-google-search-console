const { GoogleSearchConsole } = require("../auto/searchConsole");
const { InternalServerError, Forbidden, NotFound } = require("../response/error.res");
const SuccessResponse = require("../response/success.res");
const { getContentFile, pushContentFile } = require("../services/shopify/theme");
const ShopModel = require("../models").shops;
const ConfigModel = require("../models").configs;

const googleAccountService = require("../services/google-account.service");
const { convertShopifyDomainToSiteUrl } = require("../helpers");
exports.openDashboard = async (req, res) => {
    try {
        const { domain } = req.body;
        if (!domain) {
            return new Forbidden({ message: "domain is required!" }).send(res);
        }
        const googleSearchConsole = new GoogleSearchConsole(domain);
        await googleSearchConsole.init();
        await googleSearchConsole.openDashboard();
        // await googleSearchConsole.close();
        return new SuccessResponse({}).send(res);
    } catch (e) {
        console.log(e);
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

/**
 * @description get meta tag after add new sites in google search console.
 * Push this tag to 'theme.liquid'
 */
exports.addMetaTagToTheme = async (req, res) => {
    try {
        const { domain } = req.body;
        if (!domain) {
            return new NotFound({ message: "domain is required!" }).send(res);
        }
        const shopDB = await ShopModel.findOne({
            where: {
                domain,
            },
        });

        if (!shopDB) {
            return new NotFound({ message: `find shop with domain ${domain} not found!` }).send(
                res,
            );
        }

        const configDB = await ConfigModel.findOne({
            where: { domain_id: shopDB.id },
        });

        const themeId = configDB.theme_id;
        const key = "layout/theme.liquid";
        const content = await getContentFile({
            domain,
            accessToken: shopDB.token,
            themeId,
            key,
        });

        if (content.includes(`<meta name="google-site-verification"`)) {
            return new SuccessResponse({
                message: "meta tag exist in theme, do nothing !",
            }).send(res);
        } else {
            const siteUrl = convertShopifyDomainToSiteUrl(domain);
            const googleSearchConsole = new GoogleSearchConsole(siteUrl);
            await googleSearchConsole.init();
            const metaTag = await googleSearchConsole.getMetaTag();
            await googleSearchConsole.close();
            if (!metaTag) {
                return new NotFound({ message: "metatag is empty" }).send(res);
            }
            const contentUpdate = content.replace("</title>", `</title>\n ${metaTag}\n`);
            const pushContentFileResp = await pushContentFile({
                domain,
                accessToken: shopDB.token,
                themeId,
                fileName: key,
                fileContent: contentUpdate,
            });
            console.log("push content to theme: ", pushContentFileResp);
            return new SuccessResponse({
                message: "meta tag has been pushed to the theme.",
                payload: {
                    metaTag,
                },
            }).send(res);
        }
    } catch (e) {
        console.log(e);
        return new InternalServerError({ message: e.message }).send(res);
    }
};

/**
 * @description verify meta tag after include 'theme.liquid'
 */
exports.verifyMetaTag = async (req, res) => {
    try {
        const { domain } = req.body;

        const googleSearchConsole = new GoogleSearchConsole(domain, false);
        await googleSearchConsole.init();
        await googleSearchConsole.verifyMetaTag();
        // await googleSearchConsole.close();

        return new SuccessResponse({
            message: "Verify meta tag success!",
        }).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.googleAccountLogin = async (req, res) => {
    try {
        await googleAccountService.login();
        return new SuccessResponse({
            message: "Login google account success!",
        }).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.googleAccountCheck = async (req, res) => {
    try {
        return new SuccessResponse({
            message: "Verify meta tag success!",
        }).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};
