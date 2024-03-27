const { findGoogleAuth } = require("../../models/repo/googleAuth.repo");
const { InternalServerError, NotFound } = require("../../response/error.res");
const SuccessResponse = require("../../response/success.res");
const { google: googleAPI } = require("googleapis");

exports.get = async (req, res) => {
    try {
        const googleAuthDB = await findGoogleAuth();

        if (googleAuthDB) {
            return new NotFound({ message: "Could not found google auth from DB" });
        }

        const searchConsole = googleAPI.searchconsole("v1");
        const sitemaps = searchConsole.sitemaps;
        const listSitemap = await sitemaps.list({
            siteUrl: "https://doppelherz.neo-artistic.com/",
            access_token: googleAuthDB.access_token,
        });
        return new SuccessResponse({
            message: "test",
            payload: listSitemap.data,
        }).send(res);
    } catch (e) {
        console.log(e);
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.list = async (req, res) => {
    try {
        const googleAuthDB = await findGoogleAuth();
        if (googleAuthDB) {
            return new NotFound({ message: "Could not found google auth from DB" });
        }
        const siteUrl = encodeURIComponent(req.query.siteUrl);
        const resp = await fetch(
            `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${googleAuthDB.access_token}`,
                },
            },
        );
        const resJson = await resp.json();
        return new SuccessResponse({ payload: { resJson } }).send(res);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
};

exports.submit = async (req, res) => {
    try {
        if (!req.query.siteUrl) {
            return res.status(400).json({
                success: false,
                message: `siteUrl is required!`,
            });
        }

        const siteUrl = encodeURIComponent(req.query.siteUrl);
        const feedpath = encodeURIComponent(`${req.query.siteUrl}/sitemap.xml`);
        const googleAuthDB = await findGoogleAuth();
        if (googleAuthDB) {
            return new NotFound({ message: "Could not found google auth from DB" });
        }

        const resp = await fetch(
            `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${feedpath}`,
            {
                headers: {
                    method: "PUT",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${googleAuthDB.access_token}`,
                },
            },
        );
        const resJson = await resp.json();
        return res.status(200).json(resJson);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.delete = async (req, res) => {
    try {
        if (!req.query.siteUrl) {
            return res.status(400).json({
                success: false,
                message: `siteUrl is required!`,
            });
        }

        const siteUrl = encodeURIComponent(req.query.siteUrl);
        const feedpath = encodeURIComponent(`${req.query.siteUrl}/sitemap.xml`);
        const googleAuthDB = await findGoogleAuth();
        if (googleAuthDB) {
            return new NotFound({ message: "Could not found google auth from DB" });
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
        res.status(500).json({ error: e.message });
    }
};
