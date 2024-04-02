const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      // minlength: 8,
    },
    profilePicture: {
      type: String, // Url or reference
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid url for profile picture");
        }
      },
    },
    name: String,
    bio: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id },
      "mynameisayazirshadmynameisayazirshad"
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    // res.status(500).json({ msg: "token generation error" });
    console.log(error);
  }
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, 8);
    console.log(this.password);
  }
  next();
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
