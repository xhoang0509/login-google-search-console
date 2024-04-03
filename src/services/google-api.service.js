const { google } = require("googleapis");
const config = require("../config");

const { clientId, clientSecret, redirectUrl } = config.googleApi;
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);

exports.createOAuthWidthCredentials = ({ access_token, refresh_token }) => {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
    oauth2Client.setCredentials({ access_token, refresh_token });
    return oauth2Client;
};

exports.generateAuthUrl = () => {
    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/webmasters",
            "https://www.googleapis.com/auth/webmasters.readonly",
            "https://www.googleapis.com/auth/indexing",
            "https://www.googleapis.com/auth/siteverification",
            "https://www.googleapis.com/auth/siteverification.verify_only",
        ],
    });
};

exports.getToken = async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        return tokens;
    } catch (err) {
        throw new Error("Authorization failed.");
    }
};

exports.refreshAccessToken = async (refreshToken) => {
    let result = {
        access_token: null,
        scope: null,
        token_type: null,
        expiry_date: null,
        refresh_token: null,
    };
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    try {
        const response = await oauth2Client.getAccessToken();
        result = {
            access_token: response.res.data.access_token,
            scope: response.res.data.scope,
            token_type: response.res.data.token_type,
            expiry_date: response.res.data.expiry_date,
            refresh_token: response.res.data.refresh_token,
        };
    } catch (error) {
        console.error("Error refreshing access token:", error.message);
    }
    return result;
};
