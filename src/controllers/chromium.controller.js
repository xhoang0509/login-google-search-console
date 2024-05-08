/* eslint-disable no-empty */
const fs = require("fs");
const { InternalServerError, NotFound, Forbidden } = require("../response/error.res");
const SuccessResponse = require("../response/success.res");
const { BadRequestResponse } = require("../response/error.res");
const { getContentFile } = require("../services/shopify/theme");
const ShopModel = require("../models").shops;
const ConfigModel = require("../models").configs;

const googleAccountService = require("../services/chromium/gmail");
const { convertShopifyDomainToSiteUrl } = require("../helpers");
const { error, info } = require("../logger");
const { google } = require("googleapis");

const webmasters = google.webmasters("v3");
const { publishChromium } = require("../queues/publisher");
const { CHROMIUM_QUEUE } = require("../queues/consumer");
const { CONSUME_ACTION } = require("../queues/consumer/chromium");

exports.removeUrlCache = async (req, res) => {
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
        const siteUrl = convertShopifyDomainToSiteUrl(domain);
        const { oauth2Client } = req.stateApp;
        const sites = await webmasters.sites.list({
            auth: oauth2Client,
        });
        let foundSite = null;

        if (sites?.data?.siteEntry?.length) {
            foundSite = sites?.data?.siteEntry.find((site) => site.siteUrl === siteUrl);
        }

        if (!foundSite) {
            return new BadRequestResponse({ message: "domain not found in sites added" }).send(res);
        }
        await publishChromium(CHROMIUM_QUEUE, {
            siteUrl,
            action: CONSUME_ACTION.REMOVE_URL_CACHE,
            payload: {
                domain,
            },
        });
        return new SuccessResponse({
            message: `Publish event ${CONSUME_ACTION.REMOVE_URL_CACHE}`,
        }).send(res);
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
        const siteUrl = convertShopifyDomainToSiteUrl(domain);
        const { oauth2Client } = req.stateApp;
        const sites = await webmasters.sites.list({
            auth: oauth2Client,
        });
        let foundSite = null;
        if (sites?.data?.siteEntry?.length) {
            foundSite = sites?.data?.siteEntry.find((site) => site.siteUrl === siteUrl);
        }

        if (!foundSite) {
            return new BadRequestResponse({ message: "domain not found in sites added" }).send(res);
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
            info(__filename, domain, "Metatag existed in theme.liquid");
            return new SuccessResponse({
                message: "meta tag exist in theme, do nothing !",
            }).send(res);
        } else {
            await publishChromium(CHROMIUM_QUEUE, {
                siteUrl,
                action: CONSUME_ACTION.GET_AND_ADD_METATAG,
                payload: {
                    domain,
                    themeId,
                    accessToken: shopDB.token,
                    content,
                },
            });
            return new SuccessResponse({
                message: `Publish event ${CONSUME_ACTION.GET_AND_ADD_METATAG}`,
            }).send(res);
        }
    } catch (e) {
        error(__filename, "addMetaTagToTheme error", e.message);
        return new InternalServerError({ message: e.message }).send(res);
    }
};

/**
 * @description verify meta tag after include 'theme.liquid'
 */
exports.verifyMetaTag = async (req, res) => {
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
        const siteUrl = convertShopifyDomainToSiteUrl(domain);
        const { oauth2Client } = req.stateApp;
        const sites = await webmasters.sites.list({
            auth: oauth2Client,
        });
        let foundSite = null;
        if (sites?.data?.siteEntry?.length) {
            foundSite = sites?.data?.siteEntry.find((site) => site.siteUrl === siteUrl);
        }

        if (!foundSite) {
            return new BadRequestResponse({ message: "domain not found in sites added" }).send(res);
        }

        await publishChromium(CHROMIUM_QUEUE, {
            siteUrl,
            action: CONSUME_ACTION.VERIFY_METATAG,
            payload: {
                domain,
            },
        });

        return new SuccessResponse({
            message: `Publish event ${CONSUME_ACTION.VERIFY_METATAG}`,
        }).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.googleAccountLogin = async (req, res) => {
    try {
        const status = await googleAccountService.login();
        if (status) {
            return new SuccessResponse({
                success: true,
                message: "Login google account success!",
            }).send(res);
        } else {
            return new Forbidden({
                success: false,
                message: "Login google account failed!",
            }).send(res);
        }
    } catch (e) {
        error(__filename, "APP", "Google account login error: ", e.message);
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.googleAccountCheck = async (req, res) => {
    try {
        const status = await googleAccountService.checkLogin();
        if (status) {
            return new SuccessResponse({
                success: true,
                message: "Logged in to Google account",
            }).send(res);
        } else {
            return new Forbidden({
                success: false,
                message: "Not logged in to Google account",
            }).send(res);
        }
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.googleAccountLog = async (req, res) => {
    try {
        const logPath = `${process.cwd()}/src/logs/daily_check_status_google_account.jsonl`;
        let logContent = fs.readFileSync(logPath, { encoding: "utf8", flag: "r" });
        logContent = logContent.split("\n");
        const result = [];
        logContent.forEach((log) => {
            try {
                result.push(JSON.parse(log));
            } catch (error) {}
        });

        return new SuccessResponse({
            success: true,
            message: "Logged in to Google account",
            payload: {
                result,
            },
        }).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};
