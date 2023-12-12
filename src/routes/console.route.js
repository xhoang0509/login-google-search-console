const express = require("express");
const { openDashboard, submitSitemap, removeUrlCache } = require("../controllers/console.controller");
const consoleRoute = express.Router();

consoleRoute.post("/open-dashboard", openDashboard);
consoleRoute.post("/submit-sitemap", submitSitemap);
consoleRoute.post("/remove-url-cache", removeUrlCache);
module.exports = consoleRoute;
