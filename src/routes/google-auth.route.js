const express = require("express");
const { authApi, callback } = require("../controllers/google-auth.controller");
const googleAuthRoute = express.Router();

googleAuthRoute.get("/", authApi);
googleAuthRoute.get("/callback", callback);

// sitemap

// site
module.exports = googleAuthRoute;
