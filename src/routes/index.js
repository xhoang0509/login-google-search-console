const express = require("express");
const playwrightRoute = require("./playwright.route");
const consoleRoute = require("./console.route");

const routes = express.Router();

routes.use("/playwright", playwrightRoute);
routes.use("/console", consoleRoute);
module.exports = routes;
