const express = require("express");
const router = require("./router");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
var cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
require("../db/connection");
const messageRoutes = require("../routes/messageRoutes");
const chatRoutes = require("../routes/chatRoutes");
const postRoutes = require("../routes/postRoutes");
const userRoutes = require("../routes/userRoutes");
const commentRoutes = require("../routes/commentRoutes");

app.use(bodyParser.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(cors({ allowedHeaders: "*", credentials: true }));

// app.use(router);
app.use("/messages", messageRoutes);
app.use("/chats", chatRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);
app.use("/comment", commentRoutes);

app.listen(port, () => {
  console.log("listening to port", port);
});
