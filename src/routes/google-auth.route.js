const express = require("express");
const { authApi, callback, refreshToken, test } = require("../controllers/google-auth.controller");
const googleAuthRoute = express.Router();

googleAuthRoute.get("/", authApi);
googleAuthRoute.get("/callback", callback);
googleAuthRoute.get("/refresh_token", refreshToken);
googleAuthRoute.get("/test", test);

module.exports = googleAuthRoute;
