const { convertShopifyDomainToSiteUrl } = require("../../helpers");
const { findGoogleAuth } = require("../../models/repo/googleAuth.repo");
const { InternalServerError, NotFound } = require("../../response/error.res");
const SuccessResponse = require("../../response/success.res");
const { google: googleAPI } = require("googleapis");
const webmasters = googleAPI.webmasters("v3");

exports.get = async (req, res) => {
    try {
        const { oauth2Client } = req.stateApp;
        const siteUrl = req.query.siteUrl;
        const feedpath = `${siteUrl}sitemap.xml`;

        const listSitemap = await webmasters.sitemaps.list({
            auth: oauth2Client,
            siteUrl,
            feedpath,
        });
        return new SuccessResponse({
            message: "test",
            payload: listSitemap.data,
        }).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.list = async (req, res) => {
    try {
        const { oauth2Client } = req.stateApp;
        const siteUrl = encodeURIComponent(req.query.siteUrl);
        const resp = await webmasters.sitemaps.list({
            auth: oauth2Client,
            siteUrl,
        });

        const resJson = await resp.json();
        return new SuccessResponse({ payload: { resJson } }).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.submit = async (req, res) => {
    try {
        if (!req.body.domain) {
            return new NotFound({ message: "domain is required!" }).send(res);
        }
        const { oauth2Client } = req.stateApp;
        const domain = req.body.domain;
        const siteUrl = convertShopifyDomainToSiteUrl(domain);
        const feedpath = `${siteUrl}/sitemap.xml`;
        const submitResponse = await webmasters.sitemaps.submit({
            auth: oauth2Client,
            siteUrl: siteUrl,
            feedpath: feedpath,
        });
        return new SuccessResponse({ message: "Submit sitemap success", payload: submitResponse });
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.delete = async (req, res) => {
    try {
        if (!req.body.siteUrl) {
            return res.status(400).json({
                success: false,
                message: `siteUrl is required!`,
            });
        }

        const siteUrl = encodeURIComponent(req.body.siteUrl);
        const feedpath = encodeURIComponent(`${req.query.siteUrl}/sitemap.xml`);
        const googleAuthDB = await findGoogleAuth();
        if (!googleAuthDB) {
            return new NotFound({ message: "Could not found google auth from DB" }).send(res);
        }

        const resp = await fetch(
            `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${feedpath}`,
            {
                headers: {
                    method: "DELETE",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${googleAuthDB.access_token}`,
                },
            },
        );
        const resJson = await resp.json();
        return res.status(200).json(resJson);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};
