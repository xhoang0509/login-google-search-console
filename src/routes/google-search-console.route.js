const express = require("express");
const { sites, sitemaps } = require("../controllers/google-search-console");
const googleSearchConsoleRoute = express.Router();

// sites
googleSearchConsoleRoute.get("/sites", sites.get);
googleSearchConsoleRoute.get("/sites/list", sites.list);
googleSearchConsoleRoute.put("/sites", sites.add);
googleSearchConsoleRoute.delete("/sites", sites.delete);

// sitemaps
googleSearchConsoleRoute.get("/sitemaps", sitemaps.get);
googleSearchConsoleRoute.get("/sitemaps/list", sitemaps.list);
googleSearchConsoleRoute.put("/sitemaps", sitemaps.submit);
googleSearchConsoleRoute.delete("/sitemaps", sitemaps.delete);

module.exports = googleSearchConsoleRoute;
