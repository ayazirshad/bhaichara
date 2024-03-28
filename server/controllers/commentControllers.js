const Comment = require("../schema/commentSchema");

const getCommentByPostId = async (req, res) => {
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
};

const getCommentByUserId = async (req, res) => {
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
};

const getCommentByCommentId = async (req, res) => {
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
};

const deleteComment = async (req, res) => {
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
};

module.exports = {
  getCommentByPostId,
  getCommentByUserId,
  getCommentByCommentId,
  deleteComment,
};
