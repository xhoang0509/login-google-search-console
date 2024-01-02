const { google } = require("googleapis");
const { createOAuthWidthCredentials } = require("../../services/google-api.service");
const SuccessResponse = require("../../response/success.res");
const { InternalServerError, NotFound } = require("../../response/error.res");
const GoogleApiModel = require("../../models").googleApis;

const searchconsole = google.searchconsole("v1");

exports.check = async (req, res) => {
    try {
        const { inspectionUrl, siteUrl } = req.body;
        if (!inspectionUrl || !siteUrl) {
            return new NotFound({
                message: "Missing inspectionUrl or siteUrl!",
            }).send(res);
        }
        const googleDB = await GoogleApiModel.findOne({
            where: {
                shop_id: 1,
            },
        });
        const oauth2Client = createOAuthWidthCredentials({
            access_token: googleDB.access_token,
            refresh_token: googleDB.refresh_token,
        });
        const { data } = await searchconsole.urlInspection.index.inspect({
            auth: oauth2Client,
            inspectionUrl,
            siteUrl,
            languageCode: "vi",
        });
        return new SuccessResponse({ message: "check", payload: data }).send(res);
    } catch (e) {
        console.log(e);
        return new InternalServerError({ message: e.message, error: e }).send(res);
    }
};
