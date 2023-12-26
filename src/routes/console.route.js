const express = require("express");
const {
    authApi,
    openDashboard,
    openSitemap,
    submitSitemap,
    removeUrlCache,
    callback
} = require("../controllers/console.controller");
const consoleRoute = express.Router();

// auth google api;
consoleRoute.get("/auth", authApi);
consoleRoute.get("/callback", callback);
// auto chromium
consoleRoute.post("/open-dashboard", openDashboard);
consoleRoute.post("/open-sitemap", openSitemap);
consoleRoute.post("/submit-sitemap", submitSitemap);
consoleRoute.post("/remove-url-cache", removeUrlCache);
module.exports = consoleRoute;
