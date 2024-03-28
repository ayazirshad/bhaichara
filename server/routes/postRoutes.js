const express = require("express");

const router = express.Router();
const multer = require("multer");
const {
  createPost,
  getPostOfSpecificUser,
  getAllPosts,
  getSpecificPost,
  deletePost,
  likePost,
  unLikePost,
  commentOnPost,
  deleteComment,
} = require("../controllers/postControllers");
const storage = multer.memoryStorage();
const limits = {
  fieldSize: 1024 * 1024 * 30, // limit to 30MB
};
const upload = multer({ storage, limits });

router.post("/create", upload.single("image"), createPost);
router.get("/:userId", getPostOfSpecificUser);
router.get("/get/:page", getAllPosts);
router.get("/:id/postId", getSpecificPost);
router.delete("/:postId/delete", deletePost);
router.put("/:postId/like", likePost);
router.put("/:postId/unlike", unLikePost);
router.put("/:postId/comment", commentOnPost);
router.put("/:postId/deleteComment", deleteComment);

module.exports = router;
