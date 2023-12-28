const express = require("express");
const chromiumRoute = require("./chromium.route");
const googleAuthRoute = require("./google-auth.route");
const googleSearchConsoleRoute = require("./google-search-console.route");

const routes = express.Router();

routes.use("/chromium", chromiumRoute);
routes.use("/google-auth", googleAuthRoute);
routes.use("/google-search-console", googleSearchConsoleRoute);

module.exports = routes;
