const express = require("express");
const {
  getCommentByPostId,
  getCommentByUserId,
  getCommentByCommentId,
  deleteComment,
} = require("../controllers/commentControllers");

const router = express.Router();

router.get("/:postId/postId", getCommentByPostId);
router.get("/:userId/userId", getCommentByUserId);
router.get("/:commentId/commentId", getCommentByCommentId);
router.delete("/:commentId/delete", deleteComment);

module.exports = router;
