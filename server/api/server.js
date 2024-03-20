const express = require("express");
const router = require("./router");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
var cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
require("../db/connection");

app.use(bodyParser.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(cors({ allowedHeaders: "*", credentials: true }));
app.use(router);

app.listen(port, () => {
  console.log("listening to port", port);
});
