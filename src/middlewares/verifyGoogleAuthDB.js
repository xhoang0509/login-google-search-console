const { findGoogleAuth, updateGoogleAuth } = require("../models/repo/googleAuth.repo");
const { NotFound, InternalServerError } = require("../response/error.res");
const {
    createOAuthWidthCredentials,
    refreshAccessToken,
} = require("../services/google-api.service");
const { info } = require("../logger");

const verifyGoogleAuthDB = async (req, res, next) => {
    try {
        const googleAuthDB = await findGoogleAuth();
        if (!googleAuthDB) {
            return new NotFound({ message: "Could not found google auth from DB" }).send(res);
        }
        const expiryDate = new Date(googleAuthDB.expiry_date);

        if (expiryDate < new Date()) {
            info(__filename, "[APP]", "auto refresh token");
            const { access_token, refresh_token, expiry_date, scope } = await refreshAccessToken(
                googleAuthDB.refresh_token,
            );
            await updateGoogleAuth({
                access_token,
                refresh_token,
                expiry_date,
                scope,
            });
        }

        const oauth2Client = createOAuthWidthCredentials({
            access_token: googleAuthDB.access_token,
            refresh_token: googleAuthDB.refresh_token,
        });
        req.stateApp = {
            googleAuthDB: googleAuthDB,
            oauth2Client: oauth2Client,
        };
        return next();
    } catch (e) {
        return new InternalServerError({ message: e.message }).send(res);
    }
};

module.exports = verifyGoogleAuthDB;
