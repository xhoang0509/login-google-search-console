import express from "express";
import { google } from "googleapis";

const app = express();
const PORT = 3333;

// Init config auth
const CLIENT_ID = "382737212957-15uv1l1m4lgjh95do0sovfsnkts0b5sh.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3333/callback";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.get("/", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/webmasters"],
    });
    res.send(`<a href="${authUrl}">Click here to authorize</a>`);
});

app.get("/callback", async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log(tokens);
        res.send(`Authorization successful. Code: ${code}. Token: ${tokens}`);
    } catch (err) {
        res.status(500).send("Authorization failed.");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 App is running on http://localhost:${PORT} 🚀`);
});
