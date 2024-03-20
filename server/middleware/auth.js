const jwt = require("jsonwebtoken");
const User = require("../schema/userSchema");

const auth = async (req, res, next) => {
  try {
    const token = await req.cookies.token;
    console.log("auth token", token);
    const verifiedUser = await jwt.verify(
      token,
      "mynameisayazirshadmynameisayazirshad"
    );
    const user = await User.findById(verifiedUser._id);
    req.token = token;
    req.user = user;
    console.log("going to next");
    next();
  } catch (error) {
    res.status(500).json({ msg: "authentication failed", error });
  }
};

module.exports = auth;
