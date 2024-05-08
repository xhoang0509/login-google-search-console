const { google } = require("googleapis");
const { Forbidden, InternalServerError } = require("../../response/error.res");
const SuccessResponse = require("../../response/success.res");

const webmasters = google.webmasters("v3");

exports.get = async (req, res) => {
    try {
        const { siteUrl } = req.query;
        if (!siteUrl) {
            return new Forbidden({ message: "siteUrl is required" }).send(res);
        }

        const { oauth2Client } = req.stateApp;
        const siteRes = await webmasters.sites.get({
            auth: oauth2Client,
            siteUrl,
        });
        return new SuccessResponse({
            payload: {
                site: siteRes.data,
            },
        }).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.list = async (req, res) => {
    try {
        const { oauth2Client } = req.stateApp;
        const listSiteRes = await webmasters.sites.list({
            auth: oauth2Client,
        });

        return new SuccessResponse({
            payload: {
                listSite: listSiteRes.data,
            },
        }).send(res);
    } catch (e) {
        console.log(e);
        return new InternalServerError({ message: e.message, error: e }).send(res);
    }
};

exports.add = async (req, res) => {
    try {
        const siteUrl = req.body.siteUrl;
        if (!siteUrl) {
            return new Forbidden({ message: `siteUrl is required` }).send(res);
        }

        const { oauth2Client } = req.stateApp;
        await webmasters.sites.add({
            auth: oauth2Client,
            siteUrl,
        });
        return new SuccessResponse({ message: "Add new site successfully!" }).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.delete = async (req, res) => {
    try {
        let { siteUrl } = req.body;
        if (!siteUrl) {
            return new Forbidden({ message: `siteUrl is required` }).send(res);
        }
        const { oauth2Client } = req.stateApp;
        await webmasters.sites.delete({
            auth: oauth2Client,
            siteUrl,
        });
        return new SuccessResponse({ message: "Delete site success!" }).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};
