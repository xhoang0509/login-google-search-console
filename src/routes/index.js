const express = require("express");

const routes = express.Router();

routes.use("/chromium", require("./chromium.route"));
routes.use("/google-auth", require("./google-auth.route"));
routes.use("/google-search-console", require("./google-search-console.route"));

module.exports = routes;
