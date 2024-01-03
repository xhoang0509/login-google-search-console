const { GoogleSearchConsole } = require("../auto/searchConsole");
const { InternalServerError, Forbidden } = require("../response/error.res");
const SuccessResponse = require("../response/success.res");
const { getContentFile, pushContentFile } = require("../services/shopify/theme");
const GoogleApiModel = require("../models").googleApis;
const ShopModel = require("../models").shops;

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

/**
 * @description get meta tag after add new sites in google search console.
 * Push this tag to 'theme.liquid'
 */
exports.getMetaTag = async (req, res) => {
    try {
        const { domain } = req.body;
        const googleSearchConsole = new GoogleSearchConsole(domain);
        await googleSearchConsole.init();
        const metaTag = await googleSearchConsole.getMetaTag();
        await googleSearchConsole.close();

        const resUpdate = await GoogleApiModel.update(
            {
                meta_tag: metaTag,
            },
            {
                where: {
                    shop_id: 1,
                },
            },
        );
        if (resUpdate[0] === 0) {
            console.log(`GoogleAPI with shop_id = ${1} not found in DB!`);
        }

        const shopDB = await ShopModel.findOne({
            where: {
                domain: "dev-xuan-d-ng-store.myshopify.com",
            },
        });

        const themeId = "131390570677";
        const key = "layout/theme.liquid";
        const content = await getContentFile({
            domain: "dev-xuan-d-ng-store.myshopify.com",
            accessToken: shopDB.token,
            themeId,
            key,
        });

        if (content.includes(`<meta name="google-site-verification"`)) {
            console.log("meta tag exist in theme, do nothing !");
        } else {
            const contentUpdate = content.replace("</title>", `${metaTag} \n</title>`);
            const pushContentFileResp = await pushContentFile({
                domain: "dev-xuan-d-ng-store.myshopify.com",
                accessToken: shopDB.token,
                themeId,
                fileName: key,
                fileContent: contentUpdate,
            });
            console.log("push content to theme: ", pushContentFileResp);
        }
        return new SuccessResponse({
            message: "get meta tag success!",
            payload: { metaTag, content },
        }).send(res);
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
