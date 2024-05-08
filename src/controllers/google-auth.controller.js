const googleAuthModel = require("../models").googleAuth;

const { google } = require("googleapis");
const { NotFound, InternalServerError, Forbidden } = require("../response/error.res");
const SuccessResponse = require("../response/success.res");
const { generateAuthUrl, getToken, refreshAccessToken } = require("../services/google-api.service");
const { LTAP_GOOGLE_AUTH_KEY } = require("../constants");
const { findGoogleAuth } = require("../models/repo/googleAuth.repo");

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
        const googleAuthDB = await findGoogleAuth();

        if (googleAuthDB) {
            googleAuthDB.access_token = tokens.access_token;
            googleAuthDB.refresh_token = tokens.refresh_token ? tokens.refresh_token : "";
            googleAuthDB.expiry_date = tokens.expiry_date;
            googleAuthDB.scope = tokens.scope;
            await googleAuthDB.save();
        } else {
            await googleAuthModel.create({
                shop_id: 1,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expiry_date: tokens.expiry_date,
                scope: tokens.scope,
            });
        }
        res.status(200).json({
            message: "Authorization successful!",
            success: true,
            environment: "development",
            tokens,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const googleAuthDB = await findGoogleAuth();

        if (!googleAuthDB) {
            return new NotFound({ message: "Not found googleAuthModel in DB!" }).send(res);
        }

        if (!googleAuthDB.refresh_token) {
            return new Forbidden({
                message: "This google api don't have refresh_token!",
            }).send(res);
        }

        const token = await refreshAccessToken(googleAuthDB.refresh_token);

        await googleAuthModel.update(
            {
                access_token: token,
            },
            {
                where: {
                    key: LTAP_GOOGLE_AUTH_KEY,
                },
            },
        );
        return new SuccessResponse({ message: "Update accessToken success!" }).send(res);
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

exports.test = async (req, res) => {
    try {
        const googleAuthModelDB = await findGoogleAuth();
        const searchconsole = google.searchconsole("v1");
        const sitemaps = searchconsole.sitemaps;
        const listSitemap = await sitemaps.list({
            siteUrl: "https://c8b5a2-7d.myshopify.com/",
            access_token: googleAuthModelDB.access_token,
        });
        return new SuccessResponse({
            message: "test",
            payload: listSitemap.data,
        }).send(res);
    } catch (e) {
        console.log(e);
        return new InternalServerError({ message: e }).send(res);
    }
};
