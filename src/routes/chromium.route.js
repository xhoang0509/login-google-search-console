const express = require("express");
const {
    openDashboard,
    removeUrlCache,
    getMetaTag,
    verifyMetaTag,
} = require("../controllers/chromium.controller");
const chromiumRoute = express.Router();

chromiumRoute.post("/open-dashboard", openDashboard);
chromiumRoute.post("/meta-tag", getMetaTag);
chromiumRoute.post("/meta-tag/verify", verifyMetaTag);
chromiumRoute.post("/remove-url-cache", removeUrlCache);
module.exports = chromiumRoute;
