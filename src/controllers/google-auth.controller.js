const GoogleApi = require("../models").googleApis;

const { generateAuthUrl, getToken } = require("../services/google-api.service");

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
        console.log("tokens: ", tokens);
        const googleApi = await GoogleApi.findOne({
            where: {
                shop_id: 1,
            },
        });

        if (googleApi) {
            googleApi.access_token = tokens.access_token;
            googleApi.refresh_token = tokens.refresh_token ? tokens.refresh_token : "";
            await googleApi.save();
        } else {
            await GoogleApi.create({
                shop_id: 1,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            });
        }
        res.status(200).json({
            message: "Authorization successful!",
            success: true,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
};
