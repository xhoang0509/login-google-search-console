const { InternalServerError } = require("../../response/error.res");
const SuccessResponse = require("../../response/success.res");

const GoogleApis = require("../../models").googleApis;

exports.get = async (req, res) => {
    try {
        const googleApi = await GoogleApis.findOne({
            where: {
                shop_id: 1,
            },
        });
        const siteUrl = encodeURIComponent(req.query.siteUrl);
        const feedpath = encodeURIComponent(`${req.query.siteUrl}/sitemap.xml`);
        const resp = await fetch(
            `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${feedpath}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${googleApi.access_token}`,
                },
            },
        );
        const resJson = await resp();
        return new SuccessResponse({ payload: resJson }).send(res);
    } catch (e) {
        console.log(e);
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.list = async (req, res) => {
    try {
        const googleApi = await GoogleApis.findOne({
            where: {
                shop_id: 1,
            },
        });
        const siteUrl = encodeURIComponent(req.query.siteUrl);
        const resp = await fetch(
            `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${googleApi.access_token}`,
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
        const googleApi = await GoogleApis.findOne({
            where: {
                shop_id: 1,
            },
        });

        const resp = await fetch(
            `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${feedpath}`,
            {
                headers: {
                    method: "PUT",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${googleApi.access_token}`,
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
        const googleApi = await GoogleApis.findOne({
            where: {
                shop_id: 1,
            },
        });

        const resp = await fetch(
            `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${feedpath}`,
            {
                headers: {
                    method: "DELETE",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${googleApi.access_token}`,
                },
            },
        );
        const resJson = await resp.json();
        return res.status(200).json(resJson);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
