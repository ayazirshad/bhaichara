const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://localhost:27017/instaClone"
    // "mongodb+srv://ayazirshad:Paaswurd58%25%2A@cluster0.9prsg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("connected to db"))
  .catch((e) => {
    console.log(e);
    console.log("failed to connect");
  });
