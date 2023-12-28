const { Forbidden, InternalServerError } = require("../../response/error.res");
const SuccessResponse = require("../../response/success.res");

const GoogleApis = require("../../models").googleApis;

exports.get = async (req, res) => {
    try {
        if (!req.query.siteUrl) {
            return new Forbidden({ message: "siteUrl is required" }).send(res);
        }

        const siteUrl = encodeURIComponent(req.query.siteUrl);
        const googleApi = await GoogleApis.findOne({
            where: {
                shop_id: 1,
            },
        });

        const resp = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${siteUrl}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${googleApi.access_token}`,
            },
        });
        const resJson = await resp.json();
        return new SuccessResponse({ payload: resJson }).send(res);
    } catch (e) {
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

        const resp = await fetch(`https://www.googleapis.com/webmasters/v3/sites`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${googleApi.access_token}`,
            },
        });
        const resJson = await resp.json();
        return new SuccessResponse({ payload: resJson }).send(res);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.add = async (req, res) => {};
exports.delete = async (req, res) => {};
