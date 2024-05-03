require("dotenv").config();
const fetch = require("node-fetch");
global.fetch = fetch;
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const config = require("./config");
const { connectQueue } = require("./queues/init");
const { initChromiumPublish } = require("./queues/publisher");

const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

app.use(routes);

app.listen(config.app.port, async () => {
    await connectQueue();
    await initChromiumPublish();
    console.log(`App is running on port ${config.app.port}`);
});
