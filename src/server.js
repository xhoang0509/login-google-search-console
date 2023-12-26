const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const routes = require("./routes");
const config = require("./config");

const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(routes);

app.listen(config.app.port, () => {
    console.log(`🚀 App is running on http://localhost:${config.app.port} 🚀`);
});
