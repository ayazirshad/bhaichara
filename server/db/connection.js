const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://localhost:27017/instaClone"
    // "mongodb+srv://ayaz:AYAZ123@cluster0.v3tulca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    // "mongodb+srv://ayaz:Paaswurd58%25%2A@cluster0.v3tulca.mongodb.net/instaClone"
    // "mongodb+srv://ayaz:<Paaswurd58%25%2A>@cluster0.v3tulca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("connected to db"))
  .catch((e) => {
    console.log(e);
    console.log("failed to connect");
  });
