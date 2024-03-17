const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/instaClone")
  .then(() => console.log("connected to db"))
  .catch((e) => {
    console.log(e);
    console.log("failed to connect");
  });
