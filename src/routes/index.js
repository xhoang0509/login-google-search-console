const express = require("express");
const consoleRoute = require("./console.route");

const routes = express.Router();

routes.use("/console", consoleRoute);
module.exports = routes;
