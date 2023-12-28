const { google } = require("googleapis");
const config = require("../config");

const { clientId, clientSecret, redirectUrl } = config.googleApi;
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);

exports.generateAuthUrl = () => {
    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/webmasters"],
    });
};

exports.getToken = async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        return tokens;
    } catch (err) {
        throw new Error("Authorization failed.");
    }
};

exports.oauth2Client = oauth2Client;
