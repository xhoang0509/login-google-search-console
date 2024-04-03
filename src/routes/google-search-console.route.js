const express = require("express");
const { sites, sitemaps, urlInspection } = require("../controllers/google-search-console");
const googleSearchConsoleRoute = express.Router();

// sites
googleSearchConsoleRoute.get("/sites", sites.get);
googleSearchConsoleRoute.get("/sites/list", sites.list);
googleSearchConsoleRoute.post("/sites", sites.add);
googleSearchConsoleRoute.delete("/sites", sites.delete);

// sitemaps
googleSearchConsoleRoute.get("/sitemaps", sitemaps.get);
googleSearchConsoleRoute.get("/sitemaps/list", sitemaps.list);
googleSearchConsoleRoute.post("/sitemaps", sitemaps.submit);
googleSearchConsoleRoute.delete("/sitemaps", sitemaps.delete);

// URL Inspection
googleSearchConsoleRoute.get("/url/check", urlInspection.check);
module.exports = googleSearchConsoleRoute;
