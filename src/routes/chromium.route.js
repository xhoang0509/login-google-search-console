const express = require("express");
const {
    removeUrlCache,
    addMetaTagToTheme,
    verifyMetaTag,
    googleAccountLogin,
    googleAccountCheck,
    googleAccountLog
} = require("../controllers/chromium.controller");
const chromiumRoute = express.Router();

// google search console
chromiumRoute.post("/search-console/add-meta-tag", addMetaTagToTheme);
chromiumRoute.post("/search-console/meta-tag/verify", verifyMetaTag);
chromiumRoute.post("/search-console/remove-url-cache", removeUrlCache);

// auth google account search console
chromiumRoute.post("/google-account/login", googleAccountLogin);
chromiumRoute.post("/google-account/check", googleAccountCheck);
chromiumRoute.post("/google-account/log", googleAccountLog);
module.exports = chromiumRoute;
