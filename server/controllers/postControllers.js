const Comment = require("../schema/commentSchema");
const Post = require("../schema/postSchema");
const User = require("../schema/userSchema");
const cloudinary = require("cloudinary").v2;

const createPost = async (req, res) => {
  try {
    const { user, image, caption } = req.body;
    cloudinary.config({
      cloud_name: "do4b8wctw",
      api_key: "565196955737653",
      api_secret: "ngoKYorc2Vd1hY-0FQzbgQc5Tbs",
    });
    const result = await cloudinary.uploader.upload(image, {
      use_filename: true,
      folder: "posts",
    });

    const newPost = new Post({
      user,
      image: result.secure_url,
      caption,
      likes: [],
      comments: [],
    });

    const createdPost = await newPost.save();
    const userWithCreatedPost = await User.findByIdAndUpdate(
      user,
      {
        $push: { posts: createdPost },
      },
      { new: true }
    );

    res.status(201).json({
      msg: "post created",
      post: createdPost,
      user: userWithCreatedPost,
      success: true,
    });
  } catch (e) {
    res.status(500),
      json({ msg: "internal server error", success: false, error: e });
  }
};

const getPostOfSpecificUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await Post.find({ user: userId }).populate([
      { path: "user" },
      { path: "comments", model: "Comment" },
      { path: "likes", model: "User" },
    ]);
    res.status(201).json({ msg: "sending posts", posts: data });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { page } = req.params;
    const limit = 5;
    let skip = (page - 1) * limit;
    const foundPosts = await Post.find();
    const totalPosts = foundPosts.length;
    const desiredPosts = page * limit;
    const t_l = totalPosts + limit;

    if (desiredPosts - t_l >= 0) {
      return res
        .status(201)
        .json({ msg: "no more posts", posts: [], totalPosts });
    }
    const data = await Post.find()
      .limit(limit)
      .skip(skip)
      .populate([
        { path: "user" },
        {
          path: "comments",
          model: "Comment",
          populate: { path: "user", model: "User" },
        },
        { path: "likes", model: "User" },
      ]);

    let randomNumber = Math.floor(Math.random() * 6);
    let newData = data;
    if (randomNumber === 0) {
      newData = data.sort((a, b) => a.user._id - b.user._id);
    } else if (randomNumber === 1) {
      newData = data.sort((a, b) => a._id - b._id);
    } else if (randomNumber === 2) {
      newData = data.sort((a, b) => a.likes.length - b.likes.length);
    } else if (randomNumber === 3) {
      newData = data.sort((a, b) => a.comments.length - b.comments.length);
    } else if (randomNumber === 4) {
      newData = data.sort((a, b) => a.user.username - b.user.username);
    } else if (randomNumber === 5) {
      newData = data.sort((a, b) => a.user.email - b.user.email);
    }

    res.status(201).json({ msg: "sending posts", posts: newData, totalPosts });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getSpecificPost = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Post.findById(id).populate([
      { path: "user" },
      { path: "comments", model: "Comment" },
      { path: "likes", model: "User" },
    ]);
    if (data) {
      res.status(201).json(data);
    } else {
      res.status(204).json({ msg: "post not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const _id = req.params.postId;
    const deletedPost = await Post.findByIdAndDelete(_id);
    if (deletedPost) {
      await User.findByIdAndUpdate(
        deletedPost.user,
        { $pull: { posts: _id } },
        { new: true }
      ).populate([
        { path: "followers", model: "User" },
        { path: "following", model: "User" },
        { path: "posts", model: "Post" },
      ]);
      await Comment.deleteMany({ post: _id });
      res.status(201).json({ msg: "post deleted" });
    } else {
      res.status(200).json({ msg: "post not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    const likedPost = await Post.findById(updatedPost._id).populate([
      { path: "user" },
      { path: "comments", model: "Comment" },
      { path: "likes", model: "User" },
    ]);
    if (likedPost) {
      res.status(201).json(likedPost);
    } else {
      res.status(204).json({ msg: "no post found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const unLikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    const unLikedPost = await Post.findById(updatedPost._id).populate([
      { path: "user" },
      { path: "comments", model: "Comment" },
      { path: "likes", model: "User" },
    ]);
    if (unLikedPost) {
      res.status(201).json(unLikedPost);
    } else {
      res.status(204).json({ msg: "no post found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById({ _id: postId });
    if (post) {
      const { userId, text, createdAt } = req.body;
      const comment = new Comment({
        user: userId,
        post: postId,
        text,
        createdAt,
      });
      const newComment = await comment.save();
      const commentedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $push: { comments: newComment },
        },
        { new: true }
      ).populate([
        { path: "user" },
        { path: "comments", model: "Comment" },
        { path: "likes", model: "User" },
      ]);
      res.status(201).json(commentedPost);
    } else {
      res.status(204).json({ msg: "no post found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { commentId } = req.body;
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (deletedComment === null) {
      res.status(200).json({ msg: "comment not found" });
    } else {
      await Post.findById(postId);
      const commentDeletedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { comments: commentId },
        },
        { new: true }
      ).populate([
        { path: "user" },
        { path: "comments", model: "Comment" },
        { path: "likes", model: "User" },
      ]);
      res.status(201).json(commentDeletedPost);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  createPost,
  getPostOfSpecificUser,
  getAllPosts,
  getSpecificPost,
  deletePost,
  likePost,
  unLikePost,
  commentOnPost,
  deleteComment,
};
