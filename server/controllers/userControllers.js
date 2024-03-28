const User = require("../schema/userSchema");
const Comment = require("../schema/commentSchema");
const Post = require("../schema/postSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

const createUSer = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const newUser = new User({
      name,
      username,
      email,
      password,
      profilePicture:
        "https://res.cloudinary.com/do4b8wctw/image/upload/v1711628515/profilePictures/PngItem_5040528_ptfbvb.png",
      posts: [],
      followers: [],
      following: [],
    });
    const createdUser = await newUser.save();
    res.status(201).json({ msg: "user registered", user: createdUser });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error", error: e });
  }
};

const loadUser = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      const verifiedUser = jwt.verify(
        token,
        "mynameisayazirshadmynameisayazirshad"
      );
      const loggedInUser = await User.findOne({ _id: verifiedUser._id });
      res.status(200).json({ user: loggedInUser, authenticated: true });
    } else {
      res.status(402).json({ msg: "no user logged in", authenticated: false });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error", error: e });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await user.generateAuthToken();
        res
          .status(200)
          .cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          })
          .json({ msg: "logged in", loggedIn: true, user });
      } else {
        res
          .status(404)
          .json({ msg: "invalid email or password", loggedIn: false });
      }
    } else {
      res.status(404).json({ msg: "invalid email or password" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error", error: e });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    req.user.tokens = req.user?.tokens?.filter(
      (item) => item.token != req.token
    );
    await req.user.save();
    res.status(201).json({ msg: "logged out successfully", success: true });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ msg: "Internal server error", error: e, success: false });
  }
};

const updateAccount = async (req, res) => {
  try {
    const userId = req.params.userId;
    let { username, name, bio, image } = req.body;
    // TODO to set bio and name
    if (name === undefined) {
      name = "";
    }
    if (bio === undefined) {
      bio = "";
      console.log("in bio if");
    }
    cloudinary.config({
      cloud_name: "do4b8wctw",
      api_key: "565196955737653",
      api_secret: "ngoKYorc2Vd1hY-0FQzbgQc5Tbs",
    });
    const result = await cloudinary.uploader.upload(image, {
      use_filename: true,
      folder: "profilePictures",
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, name, bio, profilePicture: result.secure_url },
      { new: true }
    );
    res.status(201).json(updatedUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const follow = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { userToBeFollowed } = req.body;

    const userFollowing = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { following: userToBeFollowed },
      },
      { new: true }
    ).populate([
      { path: "followers", model: "User" },
      { path: "following", model: "User" },
      { path: "posts", model: "Post" },
    ]);

    const userFollowed = await User.findByIdAndUpdate(
      userToBeFollowed,
      {
        $addToSet: { followers: userId },
      },
      { new: true }
    )
      .populate("followers")
      .populate("following")
      .populate("posts");

    if (userFollowing && userFollowed) {
      res.status(200).json({
        msg: "started following",
        followingUser: userFollowing,
        followedUser: userFollowed,
      });
    } else {
      res.status(204).json({ msg: "user not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const unFollow = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { userToBeUnfollowed } = req.body;

    const userUnfollowing = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { following: userToBeUnfollowed },
      },
      { new: true }
    )
      .populate("followers")
      .populate("following")
      .populate("posts");

    const userUnfollowed = await User.findByIdAndUpdate(
      userToBeUnfollowed,
      {
        $pull: { followers: userId },
      },
      { new: true }
    )
      .populate("followers")
      .populate("following")
      .populate("posts");

    if (userUnfollowing && userUnfollowed) {
      res.status(200).json({
        msg: "unfollowed",
        unFollowingUser: userUnfollowing,
        unFollowedUser: userUnfollowed,
      });
    } else {
      res.status(204).json({ msg: "user not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getByUserName = async (req, res) => {
  try {
    const userName = req.params.userName;
    const userFound = await User.findOne({ username: userName }).populate([
      { path: "posts" },
      { path: "followers" },
      { path: "following" },
    ]);
    if (userFound) {
      res.status(200).json(userFound);
    } else {
      res.status(204).json({ msg: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(200).json({ msg: "no registered user" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userFound = await User.findById(userId).populate([
      { path: "posts" },
      { path: "followers" },
      { path: "following" },
    ]);
    if (userFound) {
      res.status(201).json(userFound);
    } else {
      res.status(204).json({ msg: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getUserSuggestions = async (req, res) => {
  try {
    const loggedInUser = req.params.userLoggedIn;
    const foundUsers = await User.find({
      username: { $ne: loggedInUser },
    }).limit(10);
    const logInUser = await User.findOne({ username: loggedInUser });
    const followingIds = logInUser.following.map((user) => user._id);
    const users = foundUsers.filter(
      (item) =>
        !followingIds.some((id) => id.toString() === item._id.toString())
    );
    if (users) {
      res.status(200).json({ msg: "Users found", suggestedUsers: users });
    } else {
      res.status(204).json({ msg: "Users not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      await Post.deleteMany({ user: userId });
      await Comment.deleteMany({ user: userId });
      //TODO delete user from followers and following lists of every user
      res.status(201).json({ msg: "user deleted" });
    } else {
      res.status(204).json({ msg: "user not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  createUSer,
  loadUser,
  login,
  logout,
  updateAccount,
  follow,
  unFollow,
  getByUserName,
  getAllUsers,
  getUserById,
  getUserSuggestions,
  deleteUser,
};
