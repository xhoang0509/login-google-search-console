const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const routes = require("./routes");
const PORT = process.env.PORT || 3333;

const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(routes);

app.listen(PORT, () => {
    console.log(`🚀 App is running on http://localhost:${PORT} 🚀`);
});
