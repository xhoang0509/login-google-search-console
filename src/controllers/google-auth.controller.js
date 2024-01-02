const GoogleApi = require("../models").googleApis;

const { google } = require("googleapis");
const { NotFound, InternalServerError, Forbidden } = require("../response/error.res");
const SuccessResponse = require("../response/success.res");
const { generateAuthUrl, getToken, refreshAccessToken } = require("../services/google-api.service");

exports.authApi = async (req, res) => {
    try {
        const authUrl = generateAuthUrl();
        res.send(`<a href="${authUrl}">Click to auth</a>`);
    } catch (e) {
        console.log(e);
    }
};
exports.callback = async (req, res) => {
    try {
        const code = req.query.code;
        const tokens = await getToken(code);
        const googleApi = await GoogleApi.findOne({
            where: {
                shop_id: 1,
            },
        });

        if (googleApi) {
            googleApi.access_token = tokens.access_token;
            googleApi.refresh_token = tokens.refresh_token ? tokens.refresh_token : "";
            googleApi.expiry_date = tokens.expiry_date;
            await googleApi.save();
        } else {
            await GoogleApi.create({
                shop_id: 1,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expiry_date: tokens.expiry_date,
            });
        }
        res.status(200).json({
            message: "Authorization successful!",
            success: true,
            environment: "development",
            tokens,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const googleApi = await GoogleApi.findOne({
            where: {
                shop_id: 1,
            },
        });

        if (!googleApi) {
            return new NotFound({ message: "Not found googleApi in DB!" }).send(res);
        }

        if (!googleApi.refresh_token) {
            return new Forbidden({
                message: "This google api don't have refresh_token!",
            }).send(res);
        }

        const token = await refreshAccessToken(googleApi.refresh_token);

        await GoogleApi.update(
            {
                access_token: token,
            },
            {
                where: {
                    shop_id: 1,
                },
            },
        );
        return new SuccessResponse({ message: "Update accessToken success!" }).send(res);
    } catch (e) {
        console.log(e);
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.test = async (req, res) => {
    try {
        const googleApiDB = await GoogleApi.findOne({
            where: {
                shop_id: 1,
            },
        });
        const searchconsole = google.searchconsole("v1");
        const sitemaps = searchconsole.sitemaps;
        const listSitemap = await sitemaps.list({
            siteUrl: "https://doppelherz.neo-artistic.com/",
            access_token: googleApiDB.access_token,
        });
        console.log(listSitemap.data);
        return new SuccessResponse({
            message: "test",
            payload: listSitemap.data,
        }).send(res);
    } catch (e) {
        console.log(e);
        return new InternalServerError({ message: e }).send(res);
    }
};
