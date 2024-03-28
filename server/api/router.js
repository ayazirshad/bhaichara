const express = require("express");
const Post = require("../schema/postSchema");
const Comment = require("../schema/commentSchema");
const User = require("../schema/userSchema");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const limits = {
  fieldSize: 1024 * 1024 * 30, // limit to 30MB
};
const upload = multer({ storage, limits });

//_______________ POSTS ______________

// create post

// router.post("/post/create", upload.single("image"), async (req, res) => {
//   try {
//     const { user, image, caption } = req.body;
//     console.log("create request");
//     cloudinary.config({
//       cloud_name: "do4b8wctw",
//       api_key: "565196955737653",
//       api_secret: "ngoKYorc2Vd1hY-0FQzbgQc5Tbs",
//     });
//     console.log("cloudinary request done");
//     const result = await cloudinary.uploader.upload(image, {
//       use_filename: true,
//       folder: "instaClone",
//     });

//     const newPost = new Post({
//       user,
//       image: result.secure_url,
//       caption,
//       likes: [],
//       comments: [],
//     });

//     const createdPost = await newPost.save();
//     const userWithCreatedPost = await User.findByIdAndUpdate(
//       user,
//       {
//         $push: { posts: createdPost },
//       },
//       { new: true }
//     );

//     res.status(201).json({
//       msg: "post created",
//       post: createdPost,
//       user: userWithCreatedPost,
//       success: true,
//     });
//   } catch (e) {
//     res.status(500),
//       json({ msg: "internal server error", success: false, error: e });
//   }
// });

// get posts of specific user

// router.get("/post/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const data = await Post.find({ user: userId }).populate([
//       { path: "user" },
//       { path: "comments", model: "Comment" },
//       { path: "likes", model: "User" },
//     ]);
//     //   .populate({ path: "likes", model: "User" });
//     // console.log(data);
//     res.status(201).json({ msg: "sending posts", posts: data });
//   } catch (e) {
//     // console.log(e);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });

// get all posts

// router.get("/post/get/:page", async (req, res) => {
//   try {
//     const { page } = req.params;
//     const limit = 5;
//     let skip = (page - 1) * limit;
//     const foundPosts = await Post.find();
//     const totalPosts = foundPosts.length;
//     const desiredPosts = page * limit;
//     const t_l = totalPosts + limit;

//     if (desiredPosts - t_l >= 0) {
//       return res
//         .status(201)
//         .json({ msg: "no more posts", posts: [], totalPosts });
//     }
//     const data = await Post.find()
//       .limit(limit)
//       .skip(skip)
//       .populate([
//         { path: "user" },
//         {
//           path: "comments",
//           model: "Comment",
//           populate: { path: "user", model: "User" },
//         },
//         { path: "likes", model: "User" },
//       ]);

//     // const sortingData = ["username", "id", "likes"];
//     let randomNumber = Math.floor(Math.random() * 6);
//     let newData = data;
//     if (randomNumber === 0) {
//       newData = data.sort((a, b) => a.user._id - b.user._id);
//     } else if (randomNumber === 1) {
//       newData = data.sort((a, b) => a._id - b._id);
//     } else if (randomNumber === 2) {
//       newData = data.sort((a, b) => a.likes.length - b.likes.length);
//     } else if (randomNumber === 3) {
//       newData = data.sort((a, b) => a.comments.length - b.comments.length);
//     } else if (randomNumber === 4) {
//       newData = data.sort((a, b) => a.user.username - b.user.username);
//     } else if (randomNumber === 5) {
//       newData = data.sort((a, b) => a.user.email - b.user.email);
//     }

//     res.status(201).json({ msg: "sending posts", posts: newData, totalPosts });
//   } catch (e) {
//     // console.log(e);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });

// get specific post

// router.get("/post/:id/postId", async (req, res) => {
//   try {
//     const id = req.params.id;
//     // console.log("get attempt");
//     const data = await Post.findById(id).populate([
//       { path: "user" },
//       { path: "comments", model: "Comment" },
//       { path: "likes", model: "User" },
//     ]);
//     // console.log(data[0].user.username);
//     console.log("personal post", data);
//     if (data) {
//       res.status(201).json(data);
//     } else {
//       res.status(204).json({ msg: "post not found" });
//     }
//   } catch (e) {
//     // console.log(e);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });

// delete post

// router.delete("/post/:postId/delete", async (req, res) => {
//   try {
//     const _id = req.params.postId;
//     console.log(_id);
//     // const { userId } = req.body;
//     const deletedPost = await Post.findByIdAndDelete(_id);
//     // console.log("deletedPost", deletedPost);
//     if (deletedPost) {
//       const userWithDeletedPost = await User.findByIdAndUpdate(
//         deletedPost.user,
//         { $pull: { posts: _id } },
//         { new: true }
//       ).populate([
//         { path: "followers", model: "User" },
//         { path: "following", model: "User" },
//         { path: "posts", model: "Post" },
//       ]);
//       await Comment.deleteMany({ post: _id });
//       res.status(201).json({ msg: "post deleted" });
//     } else {
//       res.status(200).json({ msg: "post not found" });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });

// like post

// router.put("/post/:postId/like", async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const { userId } = req.body;
//     const updatedPost = await Post.findByIdAndUpdate(
//       postId,
//       { $addToSet: { likes: userId } },
//       { new: true }
//     );
//     const likedPost = await Post.findById(updatedPost._id).populate([
//       { path: "user" },
//       { path: "comments", model: "Comment" },
//       { path: "likes", model: "User" },
//     ]);
//     if (likedPost) {
//       res.status(201).json(likedPost);
//     } else {
//       res.status(204).json({ msg: "no post found" });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });

// unlike post

// router.put("/post/:postId/unlike", async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const { userId } = req.body;
//     const updatedPost = await Post.findByIdAndUpdate(
//       postId,
//       { $pull: { likes: userId } },
//       { new: true }
//     );
//     const unLikedPost = await Post.findById(updatedPost._id).populate([
//       { path: "user" },
//       { path: "comments", model: "Comment" },
//       { path: "likes", model: "User" },
//     ]);
//     // console.log("updatedPost", updatedPost);
//     if (unLikedPost) {
//       res.status(201).json(unLikedPost);
//     } else {
//       res.status(204).json({ msg: "no post found" });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });

// comment

// router.put("/post/:postId/comment", async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const post = await Post.findById({ _id: postId });
//     // console.log(post);
//     // console.log("comment data", req.body);
//     if (post) {
//       const { userId, text, createdAt } = req.body;
//       // console.log(userId, text, createdAt);
//       const comment = new Comment({
//         user: userId,
//         post: postId,
//         text,
//         createdAt,
//       });
//       // console.log("commentToBePosted", comment);
//       const newComment = await comment.save();
//       // console.log("comment", newComment);
//       const commentedPost = await Post.findByIdAndUpdate(
//         postId,
//         {
//           $push: { comments: newComment },
//         },
//         { new: true }
//       ).populate([
//         { path: "user" },
//         { path: "comments", model: "Comment" },
//         { path: "likes", model: "User" },
//       ]);
//       // console.log("commentedPost", commentedPost);
//       res.status(201).json(commentedPost);
//     } else {
//       res.status(204).json({ msg: "no post found" });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });

// delete Comment

// router.put("/post/:postId/deleteComment", async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const { commentId } = req.body;
//     const deletedComment = await Comment.findByIdAndDelete(commentId);
//     // console.log("deletedComment", deletedComment);
//     if (deletedComment === null) {
//       res.status(200).json({ msg: "comment not found" });
//     } else {
//       const postToBe = await Post.findById(postId);
//       const commentDeletedPost = await Post.findByIdAndUpdate(
//         postId,
//         {
//           $pull: { comments: commentId },
//         },
//         { new: true }
//       ).populate([
//         { path: "user" },
//         { path: "comments", model: "Comment" },
//         { path: "likes", model: "User" },
//       ]);
//       console.log(commentDeletedPost);
//       // console.log(postToBe);
//       res.status(201).json(commentDeletedPost);
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// });

//_______________ USERS ______________

// create user

// router.post("/user/create", async (req, res) => {
//   try {
//     const { name, username, email, password } = req.body;

//     const newUser = new User({
//       name,
//       username,
//       email,
//       password,
//       profilePicture:
//         "https://res.cloudinary.com/do4b8wctw/image/upload/v1711628515/profilePictures/PngItem_5040528_ptfbvb.png",
//       posts: [],
//       followers: [],
//       following: [],
//     });
//     // // console.log("user before reg", newUser);
//     // const token = await newUser.generateAuthToken();
//     // res.cookie("jwt", token, {
//     //   sameSite: "None",
//     // });
//     // console.log("token", token);
//     const createdUser = await newUser.save();
//     console.log("user after reg", createdUser);
//     res.status(201).json({ msg: "user registered", user: createdUser });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ msg: "Internal server error", error: e });
//   }
// });

// load user

// router.get("/user/loadUser", async (req, res) => {
//   try {
//     // console.log("load user request ");
//     // console.log(req.cookies);
//     const token = req.cookies?.token;
//     console.log("token", token);
//     // const temp = req.headers.cookie;
//     // console.log(temp);
//     // console.log(req.cookies);
//     if (token) {
//       const verifiedUser = jwt.verify(
//         token,
//         "mynameisayazirshadmynameisayazirshad"
//       );
//       const loggedInUser = await User.findOne({ _id: verifiedUser._id });
//       // console.log("loggedInUser", loggedInUser);
//       res.status(200).json({ user: loggedInUser, authenticated: true });
//     } else {
//       res.status(402).json({ msg: "no user logged in", authenticated: false });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ msg: "Internal server error", error: e });
//   }
// });

// user login

// router.post("/user/login", async (req, res) => {
//   try {
//     console.log("login request", req.body);
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     // console.log("user", user);
//     console.log("password", password);

//     if (user) {
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (isMatch) {
//         const token = await user.generateAuthToken();
//         res
//           .status(200)
//           .cookie("token", token, {
//             httpOnly: true,
//             expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//           })
//           .json({ msg: "logged in", loggedIn: true, user });
//       } else {
//         res
//           .status(404)
//           .json({ msg: "invalid email or password", loggedIn: false });
//       }
//     } else {
//       res.status(404).json({ msg: "invalid email or password" });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ msg: "Internal server error", error: e });
//   }
// });

// user logout

router.get("/user/logout", auth, async (req, res) => {
  try {
    res.clearCookie("token");
    req.user.tokens = req.user.tokens.filter((item) => item.token != req.token);
    await req.user.save();
    res.status(201).json({ msg: "logged out successfully", success: true });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ msg: "Internal server error", error: e, success: false });
  }
});

// update user account

router.put("/user/:userId/update", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log("req.body", req.body);
    let { username, name, bio, image } = req.body;
    console.log("name", name);
    console.log("bio", bio);
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
      folder: "instaClone",
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, name, bio, profilePicture: result.secure_url },
      { new: true }
    );
    console.log(updatedUser);
    res.status(201).json(updatedUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// follow

router.put("/user/:userId/follow", async (req, res) => {
  try {
    // console.log("fllow attempt");
    const userId = req.params.userId;
    // console.log(userId);
    // console.log(req.body);
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
    // const userFollowing = await User.find({ _id: following._id })
    console.log("userFollowing", userFollowing);

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

    console.log("userFollowed", userFollowed);

    if (userFollowing && userFollowed) {
      console.log("sending follow followers");
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
});

// get user by username

router.get("/user/:userName", async (req, res) => {
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
});

// get all users

router.get("/user", async (req, res) => {
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
});

//get user by id

router.get("/user/:userId/userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log(userId);
    const userFound = await User.findById(userId).populate([
      { path: "posts" },
      { path: "followers" },
      { path: "following" },
    ]);
    // console.log("userFound", userFound);
    if (userFound) {
      res.status(201).json(userFound);
    } else {
      res.status(204).json({ msg: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// user for ssuggestions // TODO , this will be reviews latter

router.get("/user/:userLoggedIn/suggestions", async (req, res) => {
  try {
    const loggedInUser = req.params.userLoggedIn;
    const foundUsers = await User.find({
      username: { $ne: loggedInUser },
    }).limit(10);
    const logInUser = await User.findOne({ username: loggedInUser });
    // console.log("logInUser from suggestion", logInUser);
    const followingIds = logInUser.following.map((user) => user._id);
    // console.log("followingIds", followingIds);
    const users = foundUsers.filter(
      (item) =>
        !followingIds.some((id) => id.toString() === item._id.toString())
    );
    // console.log("users", users);
    if (users) {
      res.status(200).json({ msg: "Users found", suggestedUsers: users });
    } else {
      res.status(204).json({ msg: "Users not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// unfollow

router.put("/user/:userId/unfollow", async (req, res) => {
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
});

// delete account of user

router.delete("/user/:userId/delete", async (req, res) => {
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
});

//_______________ COMMENTS ______________

// get comment by post id

router.get("/comment/:postId/postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const foundCommment = await Comment.findOne({ post: postId }).populate(
      "user"
    );
    if (foundCommment) {
      res.status(201).json(foundCommment);
    } else {
      res.status(204).json({ msg: "comment not found" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// get comment by user id

router.get("/comment/:userId/userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const foundCommment = await Comment.findOne({ user: userId }).populate(
      "user"
    );
    if (foundCommment) {
      res.status(201).json(foundCommment);
    } else {
      res.status(204).json({ msg: "comment not found" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// get comment by comment id

router.get("/comment/:commentId/commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const foundCommment = await Comment.findOne({ _id: commentId }).populate(
      "user"
    );
    if (foundCommment) {
      res.status(201).json(foundCommment);
    } else {
      res.status(204).json({ msg: "comment not found" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// delete comment

router.delete("/comment/:commentId/delete", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const isCommentFound = await Comment.findById(commentId);
    if (isCommentFound) {
      await Comment.deleteOne({ _id: commentId });
      res.status(201).json({ msg: "Comment deleted" });
    } else {
      res.status(204).json({ msg: "Comment not found" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// _____________DEFAULT ERROR ROUTE_____________________

// router.get("*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.get("/post/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.get("/post/:userId/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });

// router.post("*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.post("/post/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.post("/post/create/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.post("/user/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.post("/user/create/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });

// router.put("*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.put("/user/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.put("/user/:userId/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.put("/post/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.put("/post/:postId/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });

// router.delete("*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.delete("/post/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.delete("/post/:postId/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.delete("/post/:postId/delete*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.delete("/user/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.delete("/user/:postId/*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });
// router.delete("/user/:postId/delete*", (req, res) => {
//   res.status(404).json({ msg: "Error 404! page not found" });
// });

module.exports = router;
