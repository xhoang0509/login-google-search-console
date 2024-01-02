const express = require("express");
const {
    openDashboard,
    openSitemap,
    submitSitemap,
    removeUrlCache,
} = require("../controllers/chromium.controller");
const chromiumRoute = express.Router();

chromiumRoute.post("/open-dashboard", openDashboard);
chromiumRoute.post("/open-sitemap", openSitemap);
chromiumRoute.post("/submit-sitemap", submitSitemap);
chromiumRoute.post("/remove-url-cache", removeUrlCache);
module.exports = chromiumRoute;
