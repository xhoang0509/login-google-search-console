const express = require("express");

const playwrightRoute = express.Router();

playwrightRoute.get("/", (req, res) => {
    res.status(200).json({
        message: "OK",
    });
});

playwrightRoute.get("/:id", (req, res) => {
    res.status(200).json({
        message: `OK ID ${req.params.id}`,
    });
});
module.exports = playwrightRoute;
