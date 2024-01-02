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
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    try {
        const { token } = await oauth2Client.getAccessToken();
        return token;
    } catch (error) {
        console.error("Error refreshing access token:", error.message);
        throw error;
    }
};
