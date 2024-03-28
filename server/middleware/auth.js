const jwt = require("jsonwebtoken");
const User = require("../schema/userSchema");

const auth = async (req, res, next) => {
  try {
    const token = await req.cookies.token;
    const verifiedUser = await jwt.verify(
      token,
      "mynameisayazirshadmynameisayazirshad"
    );
    const user = await User.findById(verifiedUser._id);
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ msg: "authentication failed", error });
  }
};

module.exports = auth;
